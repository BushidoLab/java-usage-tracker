const shim = require('fabric-shim');

const Chaincode = class {
  async Init(stub) {
    const ret = stub.getFunctionAndParameters();
    const company = ret.params[0];
    const logs = "Log id's: ";

    await stub.putState(company, logs);

    return shim.success(Buffer.from('Initialized Successfully'));
  }

  async Invoke(stub) {
    const ret = stub.getFunctionAndParameters();
    const fcn = this[ret.fcn];

    return fcn(stub, ret.params);
  }

  async initLog(stub, args) {
    const obj = JSON.stringify({
      _id: '_' +
        Math.random()
        .toString(36)
        .substr(2, 9),
      process: args[1],
      dateTime: args[2],
      hostname: args[3],
      javaLocation: args[4],
      javaVersion: args[5],
      OS: args[6],
      OSArchitecture: args[7],
      OSVersion: args[8]
    });

    await stub.putState(log, obj);

    const company = await stub.getState(company);

    return shim.success(Buffer.from('Log recorded successfully'));
  }

  async query(stub, args) {
    const company = args[0];
    const data = await stub.getState(company);

    return shim.success(Buffer.from(data));
  }
  static parseUsageTracker(usageTracker) {
    return usageTracker.split(',');
  }
};

// shim.start(new Chaincode());

/* 
  VM start,Thu Aug 30 20:14:14 EDT 2018,HP-Spectre-x360/192.168.1.31,jdk.javaws/com.sun.javaws.registration.RegisterDeploy -fixShortcuts,C:\Program Files\Java\jre-10.0.2,10.0.2,10.0.2+13,Oracle Corporation,"Oracle Corporation",Windows 10,amd64,10.0,-Djdk.disableLastUsageTracking --add-exports=java.base/jdk.internal.misc=jdk.deploy -Djdk.module.main=jdk.javaws , ,
*/
console.log(
  Chaincode.parseUsageTracker(
    'VM start,Thu Aug 30 20:14:14 EDT 2018,HP-Spectre-x360/192.168.1.31,jdk.javaws/com.sun.javaws.registration.RegisterDeploy -fixShortcuts,C:Program FilesJavajre-10.0.2,10.0.2,10.0.2+13,Oracle Corporation,"Oracle Corporation",Windows 10,amd64,10.0,-Djdk.disableLastUsageTracking --add-exports=java.base/jdk.internal.misc=jdk.deploy -Djdk.module.main=jdk.javaws , ,'
  )
);