const shim = require('fabric-shim');
// const util = require('util');

const Chaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let company = ret.params[0];
    let logs = "0";

    await stub.putState(company, logs)
 
    return shim.success(Buffer.from('Initialized Successfully'));
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();

    let fcn = this[ret.fcn];
    return fcn(stub, ret.params);
  }

  async initLog(stub, args) {
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

    let logCount = await stub.getState(args[0]);
    logCount = parseInt(logCount);
    logCount = logCount + 1;
    logCount = logCount.toString();

    await stub.putState(logCount, JSON.stringify(obj));
    await stub.putState(args[0], logCount);

    return shim.success(Buffer.from('Log recorded successfully'));
  }

  async query(stub, args) {
    let company = args[0];
    let data = await stub.getState(company)

    return shim.success(Buffer.from(data));
  }

  async queryLog(stub, args) {
    let log = await stub.getState(args[0]);
    return shim.success(Buffer.from(log));
  }

  async queryLogs(stub, args) {
    let company = args[0];
    let logCount = stub.getState(company);
    logCount = parseInt(logCount)++;

    let startKey = "1";
    let endKey = logCount;

    return stub.GetStateByRange(startKey, endKey);
  }
}

shim.start(new Chaincode);