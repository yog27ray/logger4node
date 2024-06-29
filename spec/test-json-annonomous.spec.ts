import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from '../src/logger/logger';
import { Logger4Node } from '../src/logger/logger4-node';
import { loggerSpy, stringLogsToJSON, wait } from './test-logs';

const currentFolder = __dirname;

describe('Logger4nodeAnonymous', () => {
  context('logging string, object, array in one log', () => {
    let logger: Logger4Node;
    let callbackSpy: SinonSpy;
    let loggerInstance: Logger;

    before(() => {
      logger = new Logger4Node('Logger');
      loggerInstance = logger.instance('Instance');
      logger.setJsonLogging(true);
    });

    beforeEach(() => {
      logger.setLogPattern('Logger:*');
      logger.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger.setLogSeverityPattern(logSeverity));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should log object with string in proper json format', async () => {
      loggerInstance.error('this is string', { var: 1, var2: 2 });
      await wait();
      expect(callbackSpy.callCount).to.equal(1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).to.deep.equal([{
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json-annonomous.spec.ts',
          path: currentFolder,
          line: '29',
          column: '22',
        },
        message: 'this is string {"var":1,"var2":2}',
      }]);
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });
});
