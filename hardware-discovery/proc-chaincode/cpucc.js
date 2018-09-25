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
      model: args[3]
    })

    obj = JSON.stringify(obj);

    await stub.putState(company, Buffer.from(obj));

    return shim.success(Buffer.from("Log recorded"));
  }

  async query(stub, args) {
    let data = await stub.getState(args[0]);

    return shim.success(Buffer.from("Processor info: " + data));
  }
}

shim.start(new Chaincode);