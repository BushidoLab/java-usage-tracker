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
      _id: '_' + Math.random().toString(36).substr(2, 9),
      process: args[1],
      dateTime: args[2],
      hostname: args[3],
      javaLocation: args[4],
      javaVersion: args[5],
      OS: args[6],
      OSArchitecture: args[7],
      OSVersion: args[8]
    })

    await stub.putState(log, obj);

    const company = await stub.getState(company);


    return shim.success(Buffer.from('Log recorded successfully'));
  }

  async query(stub, args) {
    const company = args[0];
    const data = await stub.getState(company);

    return shim.success(Buffer.from(data));
  }

}

shim.start(new Chaincode);