const shim = require('fabric-shim');
const util = require('util');

const Chaincode = class {
  async Init(stub) {
    const ret = stub.getFunctionAndParameters();
    const company = ret.params[0];
    const logs = "0";

    await stub.putState(company, logs)
 
    return shim.success(Buffer.from('Initialized Successfully'));
  }

  async Invoke(stub) {
    console.info('Transaction ID: ' + stub.getTxId());
    console.info(util.format('Args: %j', stub.getArgs()));

    const { fcn, args } = stub.getFunctionAndParameters();
    console.info('Calling function: ' + fcn)

    switch (fcn) {
      case 'initLog':
        return await this.initLog(stub, args);
      case 'query':
        return await this.query(stub, args);
      case 'queryLogs':
        return await this.queryLogs(stub, args);
    }
  }

  async initLog(stub, args) {

    params = args[1].split(',').join('');

    const obj = ({
      process: params[0],
      dateTime: params[1],
      hostname: params[2],
      javaLocation: params[4],
      javaVersion: params[5],
      OS: params[9],
      OSArchitecture: params[10],
      OSVersion: params[11]
    })

    const company = args[0];
    const logCount = await stub.getState(company);
    logCount = parseInt(logCount++);

    var obj = new Uint16Array(obj)

    await stub.putState(logCount.toString(), obj);
    await stub.putState(company, logCount.toString());

    return shim.success(Buffer.from('Log recorded successfully'));
  }

  async query(stub, args) {
    const company = args[0];
    const data = await stub.getState(company);

    return shim.success(Buffer.from(data));
  }

  async queryLogs(stub, args) {
    const company = args[0];
    const logCount = stub.getState(company);

    const startKey = "0";
    const endKey = logCount;

    return stub.GetStateByRange(startKey, endKey);
  }

}

shim.start(new Chaincode);