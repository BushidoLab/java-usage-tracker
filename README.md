# Java Usage Tracker

## What does it do?
### Named User Plus Licenses
- Receives incoming UDP packets containing Java Usage information from computers configured with the usagetracker.properties file
- Parses the data in the UDP packets
- Sends relevant data to be stored in our hyperledger fabric network
- Fabric network endorses the request and stores it to the companies channel ledger
- Relevant information is sent to a front end webapp which provides necessary information for a reconciliation

### Processor based licenses
- Runs a script which performs hardware discovery on the local machine and returns values of CPU cores, CPU vendor and CPU model
- Logs that information directly to fabric network
- Fabric network endorses the request and stores it to the companies channel ledger
- Relevant information is sent to a front end webapp which provides necessary information for a reconciliation

## Introduction:
This tool was created to help with tracking, recollecting then providing necesarry data for a Software Asset Management's (SAM) audit.

## How to use:
- `mycc.js` and `package.json` files need to be compressed into ZIP format for deploying to Oracle Autonomous Blockchain Cloud Service (OABCS)
  - While initializing the chaincode on a peer the peer's companies name is required to identify all logs sent by the peer under the same organization.
  - For 'Quick Deployment' of the chaincode a channel, initial parameters and a REST proxy need.
  - 'Advanced Deployment' is separated into three steps
    1. Install: Select which peers to install the chaincode on and provide the chaincode ZIP file.
    2. Instantiate: Select which channel is to be used, the peers to instantiate the chaincode on, initial parameters and endorsement policies
      - For the endorsement policy the organizations to endorse transactions are provided and specified as admins or members of the channel, as well as the number of organizations that require endorsing the chaincode for it to be accepted
    3. Enable in REST proxy: Select rest proxy node and peers that endorse the chaincode

- Once chaincode is installed, navigate to 'Nodes' tab in OABCS console and find the route to the REST proxy your chaincode was installed on
- This route is the prefix of the request url, after this prefix a resource path is to be specified
- A resource path for invoking chaincode looks like this:
```bcsgw/rest/v1/transaction/invocation```
More information on OABCS REST endpoints can be found here:

  [REST API for Oracle Autonomous Blockchain Cloud Service](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/rest-api/index.html)
- Basic AUTH is required to make requests, were the username and password are the same as your OABCS credentials
- All information for POST requests in passed through the body in `application/json` format.
- For this specific chaincode the channel, chaincode name, chaincode version, method and arguments need to be passed.
- Here is an example body of a POST request storing a log on the 'default' channel ledger:
```
{
	"channel": "default",
	"chaincode": "usage-tracker",
	"chaincodeVer": "1.0",
	"method": "Log",
	"args": ["oracle","process","dateTime","hostname","javaLocation","javaVersion","operating system", "OSArchitecture", "OSVersion"]
}
```
In the 'Channels' tab of the OABCS console, click the channel name and to view the encoded ledger.
