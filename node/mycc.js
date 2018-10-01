
// shim package used to help serialize/deserialize data stored in blockchain
const shim = require('fabric-shim');

const Chaincode = class {

  // Initialize chaincode on the peer, requires an argument specyfing the user's company name
  // Then the company gets stored as a key-value pair with a value of "0" represinting the amount of logs recorded
  
  async Init(stub) {
    // .getFunctionAndParameters() returns the function and parameters as ret.fcn and ret.params
    let ret = stub.getFunctionAndParameters();
    let company = ret.params[0];
    let logs = "0";

    // Stores company name with a value of "0"
    await stub.putState(company, Buffer.from(logs));
 
    return shim.success(Buffer.from('Initialized Successfully'));
  }

  // Method used to get invoke all other functions
  async Invoke(stub) {

    let ret = stub.getFunctionAndParameters();

    let fcn = this[ret.fcn];
    return fcn(stub, ret.params);
  }

  // Stores a log as a stringified JSON object and adds one to the companies log count
  async Log(stub, args) {
    // Specify company name to be able to get its state (log count)
    const company = args[0];

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

    // Making object with log data into a JSON stringified object
    obj = JSON.stringify(obj)

    // Increases the companies log count by one
    let logCount = await stub.getState(company);
    logCount = parseInt(logCount);
    logCount = logCount + 1;
    logCount = logCount.toString();

    // Stores object with it's companies log count as its key
    await stub.putState(logCount, Buffer.from(obj))
        
    // Updates the companies total log count
    await stub.putState(company, Buffer.from(logCount))
  
    return shim.success(Buffer.from('Log recorded successfully'));
  }

  // Queries using the company name as a key and returns it's log count
  async query(stub, args) {
    const company = args[0];
    let data = await stub.getState(company);

    return shim.success(Buffer.from('Log count: ' + data));
  }

  // Queries a single log's data using it's key
  async queryLog(stub, args) {
    let log = await stub.getState(args[0]);
    return shim.success(Buffer.from("Log #" + args[0] + ": " + log));
  }

  // Queries all logs associated with a company name
  // Requires company name to get their log count and then loops from log #1 up until the last log
  // Returns an array with each of these logs as a object inside the array
  async queryAllLogs(stub, args) {
    let company = args[0];
    let logCount = await stub.getState(company);
    logCount = parseInt(logCount);
    logCount = logCount + 1;
    
    // Defines array were all logs are pushed into
    let logArr = [];
    
    for (let i = 1; i < logCount; i++) {
      i = i.toString();
      let data = await stub.getState(i);
      logArr.push(data);
    }
    return shim.success(Buffer.from("All logs from " + args[0] + ": " + logArr));
  }
}

shim.start(new Chaincode);