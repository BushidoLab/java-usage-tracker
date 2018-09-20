import { Chaincode, ChaincodeError, Helpers, StubHelper } from '@theledger/fabric-chaincode-utils';

export class UsageTracker extends Chaincode {

    async queryLog(stubHelper: StubHelper, args: string[]) {

      Helpers.checkArgs(args, 1);

      let logId = args[0];

      const log = stubHelper.getStateAsObject(logId);

      if (!log) {
          throw new ChaincodeError('Log id not found');
      }

      return log;
    }

    async initLog(stubHelper: StubHelper, args: string[]) {

      Helpers.checkArgs(args, 7);

      let company = "Oracle";

      let log = {
        process: args[0],
        dateTime: args[1],
        hostname: args[2],
        javaLocation: args[3],
        javaVersion: args[4],
        OS: args[5],
        OSArchitecture: args[6],
        OSVersion: args[7]
      }

      let logId = await stubHelper.getStateAsString(company);
      let idInt = parseInt(logId);
      idInt = idInt++;
      logId = idInt.toString();

      await stubHelper.putState(logId, log);
      await stubHelper.putState(company, logId);
    }

    async queryAllLogs(stubHelper: StubHelper, args: string[]) {
      Helpers.checkArgs(args, 1);

      let company = args[0];

      let logId:string = await stubHelper.getStateAsString(company);

      let idInt = parseInt(logId);
      idInt = idInt++;
      logId = idInt.toString();

      return await stubHelper.getStateByRangeAsList("1", logId);
    }

}
