const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {
  async Init(stub) {
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    
    let fcn = this[ret.fcn];
    return fcn(stub, ret.params);
  }

  async set(stub, args) {
    let a = ({
      key1: args[0],
      key2: args[1]
    });

    await stub.putState('key', JSON.stringify(a));
    
    return shim.success(Buffer.from('Log recorded'));
  }

  async get(stub, args) {
    let value = await stub.getState('key');
    return shim.success(Buffer.from(value));
  }
};

shim.start(new Chaincode);