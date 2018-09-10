const shim = require('fabric-shim');

const Chaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();  
    let company = ret.params[0];
    let logs = "Log id's: ";

    await stub.putState(company, logs);

    return shim.success(Buffer.from('Initialized Successfully'))
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    let fcn = this[ret.fcn];
    
    return fcn(stub, ret.params);
  }

  async initLog(stub, args) {
    let processVal = args[1];
    let dateTimeVal = args[2];
    let hostnameVal = args[3];
    let javaLocationVal = args[4];
    let javaVersionVal = args[5];
    let OSVal = args[6];
    let OSArchitectureVal = args[7];
    let OSVersionVal = args[8];
    let idVal = '_' + Math.random().toString(36).substr(2, 9);
    
    var obj = { _id: idVal, process: processVal, dateTime: dateTimeVal, hostname: hostnameVal, javaLocation: javaLocationVal, javaVersion: javaVersionVal, OS: OSVal, OSArchitecture: OSArchitectureVal, OSVersion: OSVersionVal }
    obj = JSON.stringify(obj);

    await stub.putState(log, obj);

    let company = await stub.getState(company);


    return shim.success(Buffer.from('Log recorded successfully'));
  }  

  async query(stub, args) {
    let company = args[0];
    let data = await stub.getState(company);

    return shim.success(Buffer.from(data));
  }

}

shim.start(new Chaincode);