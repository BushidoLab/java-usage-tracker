package com.zetcode;

import java.net.InetAddress;
import java.net.DatagramSocket;
import java.net.DatagramPacket;
import java.io.IOException;
import java.net.SocketException;
 
import java.io.File;
import java.io.OutputStream;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;
import java.io.StringReader;

/**
  * A daemon that listens for and logs UsageTracker information.
  */
public class UsageTrackerServer {
 
    static boolean verbose = false;
    boolean initialized = false;
    String logFileName = null;
    File logFile;
    OutputStreamWriter writer;
    int port = 32139;
    InetAddress address = null;
    DatagramSocket socket;
    private static final int BUFFERSIZE = 65536;
    long received = 0;
    boolean running = true;
 
    /**
      * Main entry point for starting this daemon.
      */
    public static void main(String [] args) {
        try {
            UsageTrackerServer uts = new UsageTrackerServer(args);
            uts.run();
        } catch (Exception e) {
            System.out.println("UsageTrackerServer: " + e.getMessage());
            if (verbose) {
                e.printStackTrace();
            }
            System.exit(1);
        }
    }

    public static void usage() {
        System.out.println("UsageTrackerServer [-v] [-o filename] [host]:port\n" +
            "e.g. UsageTrackerServer -v -o usagetracker.out :32139\n");
    }

    private void recordLog(String data) throws Exception {
        HttpsURLConnection con;
        
        // Parse through data
        String body = data;
        String delims = "[,]";
        String[] tokens = body.split(delims);
        String payload = "{\"channel\": \"default\",\"chaincode\":\"usage-tracker-29\",\"chaincodeVer\":\"1.0\",\"method\":\"initLog\",\"args\":[\""+tokens[0]+"\",\""+tokens[1]+"\", \""+tokens[2]+"\",\""+tokens[5]+"\", \""+tokens[6]+"\", \""+tokens[8]+"\", \""+tokens[9]+"\", \""+tokens[10]+"\"]}";
        StringEntity params = new StringEntity(payload, ContentType.APPLICATION_JSON);
        String url = "https://C7CE0094293A4DFF924280677225F55D.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
    
        // Make request

            try {
                URL myurl = new URL(url);
                con = (HttpsURLConnection) myurl.openConnection();

                con.setDoOutput(true);
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setRequestProperty("Authorization", "Basic ZGllZ29AYXBwby50ZWNoOjEyMzQ1Njc4OUFhLg==");

                try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
                    wr.write(params);
                    StringBuilder content;

                    try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream))) {
                        String line;
                        content = new StringBuilder();

                        while ((line = in.readLine()) != null) {
                            content.append(line);
                            content.append(System.lineSeparator());
                        }
                    }

                    System.out.println(content.toString());
                }
            } finally {
                con.disconnect();
            }
        }
    
 
    /**
      * Initialize a UsageTrackerServer given some arguments.
      */
    UsageTrackerServer(String [] args) throws Exception {
 
        boolean usage = false;
        for (int i=0; i<args.length; i++) {
 
            if (args[i].equals("-?") || args[i].equals("--h")) {
                usage = true;
                break;
            } else if (args[i].equals("-v")) {
               verbose = true;
            } else if (args[i].equals("-o")) {
                logFileName = args[i+1];
                i++;
            } else if (args[i].contains(":")) {
                // parse [address]:port
                String colon = args[i];
                int colonIndex = args[i].indexOf(":");
                System.out.println("----------:" + colon);
                if (colon != ":32139") {
                    try {
                        address = InetAddress.getByName(
                            args[i].substring(0, colonIndex));
                            System.out.println("============:" + address);
                    } catch (Exception ae) {
                        System.out.println("UsageTrackerServer: " +
                            "problem setting listen address: " + ae);
                        usage = true;
                    }
                }
                try {
                    port = Integer.parseInt(args[i].substring(colonIndex+1));
                } catch (NumberFormatException nfe) {
                    System.out.println("UsageTrackerServer: cannot set port: " +
                        args[i].substring(colonIndex+1));
                    usage = true;
                }
            } else {
                usage = true;
            }
        }
        // Argument failure or request for usage gets the usage message only:
        if (usage) {
            usage();
            return;
        }
        // Otherwise, continue to proper initialization:
        socket = null;
        try {
        if (address != null) {
            socket = new DatagramSocket(port, address);
        } else {
            socket = new DatagramSocket(port);
        }
        } catch (SocketException se) {
            throw new Exception("problem creating socket: " + se);
        }
        if (logFileName != null) {
            try {
                File logFile = new File(logFileName);
                if (verbose) {
                    System.out.println("Using logfile: " + logFileName);
                    if (logFile.exists()) {
                        System.out.println("File exists, will append.");
                    }
                }
                FileOutputStream fos = new FileOutputStream(logFile, true);
                writer = new OutputStreamWriter(fos, "UTF-8");
            } catch (IOException ioe) {
                throw new Exception("problem using file " + logFileName + ": " +
                    ioe);
            }
        }
        initialized = true;
    }
 
   public void run() throws Exception {
        if (!initialized) {
            return;
        }
        Runnable r = null;
        if (writer == null) {
            r = new UsageTrackerServerRunnable(socket);
        } else {
            r = new UsageTrackerServerRunnable(socket, writer);
        }
        Thread t = new Thread(r, "UsageTrackerServerRunnable");
        t.start();
        t.join();
    }
 
    /**
      * Runnable that listens and logs.
      */
    private class UsageTrackerServerRunnable implements Runnable {
        DatagramSocket listenSocket;
        OutputStreamWriter writer = null;
 
        UsageTrackerServerRunnable(DatagramSocket socket) {
            listenSocket = socket;
        }
        UsageTrackerServerRunnable(DatagramSocket socket,
            OutputStreamWriter writer) {
            this(socket);
            this.writer = writer;
        }
 
        public void run() {
            byte [] buf = new byte[BUFFERSIZE];
            DatagramPacket packet = new DatagramPacket(buf, buf.length);
 
            // Ready to receive data
            if (verbose) {
                String addr = listenSocket.getLocalAddress().getHostAddress();
                if (addr.equals("0.0.0.0")) {
                    addr = "129.150.205.144";
                }
                System.out.println("UsageTrackerServer: ready to receive on " +
                    addr + ":" + listenSocket.getLocalPort());
            }
            while (running) {
                try {
                    listenSocket.receive(packet);
                    String dataReceived = new String(packet.getData(), 0,
                        packet.getLength());

                    recordLog(dataReceived);
 
                    // The format of a UsageTracker record contains a newline at
                    // the end; if that is missing, we have a truncated/corrupt
                    // packet.
                    if (!dataReceived.endsWith("\n")) {
                        System.out.println("Incomplete message received: " +
                          "size = " + packet.getLength() + ", data =  " +
                          dataReceived);
                        dataReceived = dataReceived + "\n";
                    }
                    received++;
                    if (verbose) {
                        System.out.println("Received message size: " +
                            dataReceived.length() + "Log: " + dataReceived);
                    }
                    if (writer != null) {
                        writer.write(dataReceived, 0, dataReceived.length());
                        writer.flush();
                    } else {
                        System.out.print(dataReceived);
                    }
                } catch (IOException ioe) {
                    ioe.printStackTrace();
                }
            }
        }
    }
}