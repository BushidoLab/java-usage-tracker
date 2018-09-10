const shim = require('fabric-shim');

const Chaincode = class {
  async Init(stub) {
    const ret = stub.getFunctionAndParameters();
    const company = ret.params[0];
    const logs = "Log id's: ";

    await stub.putState(company, logs);

    return shim.success(Buffer.from('Initialized Successfully'))
  }

  async Invoke(stub) {
    const ret = stub.getFunctionAndParameters();
    const fcn = this[ret.fcn];

    return fcn(stub, ret.params);
  }

  async initLog(stub, args) {
    const obj = JSON.stringify({
      process: args[0],
      dateTime: args[1],
      hostname: args[2],
      javaLocation: args[3],
      javaVersion: args[4],
      OS: args[5],
      OSArchitecture: args[6],
      OSVersion: args[7]
    });

    const log = '_' + Math.random().toString(36).substr(2, 9);

    await stub.putState(log, obj);

    // const company = await stub.getState(company);
    // company = company + " " + _id + ",";
    // await stub.putState(company, company);

    return shim.success(Buffer.from('Log recorded successfully'));
  }

  async query(stub, args) {
    const company = args[0];
    const data = await stub.getState(company);

    return shim.success(Buffer.from(data));
  }

}

shim.start(new Chaincode);