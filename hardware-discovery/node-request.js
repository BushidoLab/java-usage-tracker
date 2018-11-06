const axios = require("axios");
const mac = require('getmac');
const cmd = require('node-cmd')
const companyName = "oracle";
const arg = [];

const os = require('os');
const ifaces = os.networkInterfaces();
let address;

// Iterate over interfaces
for (let ips in ifaces) {
    let iface = ifaces[ips].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) address = iface[0].address;
}

function setArguments() {

  // Sets the body of the POST request
  let data = {
    channel: "default",
    chaincode: "processor-cc",
    chaincodeVer: "1.0",
    method: "Log",
    args: arg
  };
  
  // process.argv gives all parameters passed to the CLI
  // In this case process.argv[0] = node and process.argv[1] = node-requests.js
  for (let i = 2; i < process.argv.length; i++) {
    arg.push(process.argv[i]);
  }
  
  mac.getMac((err, macAddress) => {
    if (err) throw err
    arg.push(macAddress);
  })
  
  arg.push('Processor');
  arg.push("1");
  arg.push(address);
  arg.push(os.type());
  
  // Function get virtualization information using lscpu cmd which works on unix style systems
  cmd.get('lscpu', function(err, output) {
    // Gets virtualization key from lscpu command, then formats it like our other args
    let dataArr = output.replace(/\n/g, ",")
    dataArr = dataArr.split(",");
    let virtualization = dataArr[19].replace("        ", "");
    arg.push(virtualization.substring(virtualization.indexOf(':') + 1)); 
    
    // Add the companies name mannually to pass as first argument in the body
    arg.unshift(companyName);
    // Stringify the data object to format for POST request
    data = JSON.stringify(data);
    axios
    .post(
      "https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation",
      data,
      {
        dataType: "json",
        withCredentials: true,
        async: true,
        // Body format has to be application/json type
        // Authorization is Base64 encoded OABCS login credentials
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic ZGllZ29AYXBwby50ZWNoOjEyMzQ1Njc4OUFhLg=="
        },
        proxy: {
          host:
            "8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com",
          port: 443,
          path: "/restproxy1/bcsgw/rest/v1/transaction/invocation"
        },
        data: data
      }
    )
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  });
}

setArguments();