const shim = require("fabric-shim");

const Chaincode = class {
  
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let company = ret.params[0];
    let logs = "0";

    await stub.putState(company, Buffer.from(logs));

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
      cores: args[1],
      vendor: args[2],
      model: args[3],
      dateTime: args[4],
      subVendor: args[5],
      category: args[6],
      userCount: args[7],
      IP: args[8],
      MAC: args[9],
      virtualization: args[10]
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

    return shim.success(Buffer.from(data));
  }

  async queryLog(stub, args) {
    let log = await stub.getState(args[0]);
    return shim.success(Buffer.from(log));
  }

  async queryAllLogs(stub, args) {
    let company = args[0];
    let logCount = await stub.getState(company);
    logCount = parseInt(logCount);
    logCount = logCount + 1;

    let logArr = [];

    for (let i = 1; i < logCount; i++) {
      i = i.toString();
      let data = await stub.getState(i);
      logArr.push(data);
    }
    return shim.success(
      Buffer.from(`${logArr}`)
    )
  }
}

shim.start(new Chaincode());