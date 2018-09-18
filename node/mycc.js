/* Testing packages that help manage chaincode formatting

// import { Chaincode, Helpers, NotFoundError, StubHelper } from '@theledger/fabric-chaincode-utils';
// const stubHelper = new StubHelper;
// const util = require('util');

*/

const shim = require('fabric-shim');

const Chaincode = class {
  // Initialize chaincode on the peer, requires an argument specyfing the user's company name
  // Then the company get stored as a key-value pair with a value of "0" represinting the amount of logs recorded
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let company = ret.params[0];
    let logs = "0";

    // Stores company name with a value of "0"
    await stub.putState(company, logs)
 
    return shim.success(Buffer.from('Initialized Successfully'));
  }

  // Method used to get invoke all other functions
  async Invoke(stub) {

    // .getFunctionAndParameters() returns the function and parameters as ret.fcn and ret.params
    let ret = stub.getFunctionAndParameters();

    let fcn = this[ret.fcn];
    return fcn(stub, ret.params);
  }

  // Stores a log as a stringified JSON object and adds one to the companies log count
  async Log(stub, args) {

    // Object containing java usage tracker logs
    let obj = ({
      process: args[1],
      dateTime: args[2],
      hostname: args[3],
      javaLocation: args[4],
      javaVersion: args[5],
      OS: args[6],
      OSArchitecture: args[7],
      OSVersion: args[8]
    });

    // Specify company name to be able to get its state
    const company = args[0].toString();

    // Increases the companies log count by one
    let logCount = await stub.getState(company);
    logCount = parseInt(logCount);
    logCount = logCount + 1;
    logCount = logCount.toString();

    // Stores object with it's companies log count as its key
    await stub.putState(logCount, JSON.stringify(obj));

    // Updates the companies total log count
    await stub.putState(company, logCount);

    return shim.success(Buffer.from('Log recorded successfully', obj));
  }

  // Queries using the company name as a key and returns 
  async query(stub, args) {
    const company = args[0].toString();
    let data = await stub.getStateAsString(company);

    return shim.success(Buffer.from('Data: ' + data));
  }

  // Queries a log's data using its key
  async queryLog(stub, args) {
    let log = await stub.getState(args[0]);
    return shim.success(Buffer.from(log));
  }

  // Queries all of a companies logs
  async queryAllLogs(stub, args) {
    let company = args[0];
    let logCount = stub.getState(company);
    logCount = parseInt(logCount)++;

    let startKey = "1";
    let endKey = logCount;

    return stub.GetStateByRange(startKey, endKey);
  }
}

shim.start(new Chaincode);