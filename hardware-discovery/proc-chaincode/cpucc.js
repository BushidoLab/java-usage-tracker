const shim = require("fabric-shim");

const Chaincode = class {
  
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let company = ret.params[0];
    let data = "0";

    await stub.putState(company, Buffer.from(data));

    return shim.success(Buffer.from("Initialized Successfully"));
  } 

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();

    let fcn = this[ret.fcn];
    return fcn(stub, ret.params);
  }

  async Log(stub, args) {
    const company = args[0];

    let obj = ({
      cpu: args[1],
      vendor: args[2],
      model: args[3],
      dateTime: args[4]
    })

    obj = JSON.stringify(obj);

    let logCount = await stub.getState(company);
    logCount = parseInt(logCount);
    logCount = logCount + 1;
    logCount = logCount.toString();

    await stub.putState(company, Buffer.from(logCount));

    await stub.putState(logCount, Buffer.from(obj));

    return shim.success(Buffer.from("Log recorded"));
  }

  async query(stub, args) {
    let data = await stub.getState(args[0]);

    return shim.success(Buffer.from("Log count: #" + data));
  }

  async queryLog(stub, args) {
    let log = await stub.getState(args[0]);
    return shim.success(Buffer.from("Log #" + args[0] + ":" + log));
  }
}

shim.start(new Chaincode);