import sinon, { spy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from '../src/logger/logger';
import { Logger4Node } from '../src/logger/logger4-node';
import { loggerSpy, stringLogsToJSON, wait } from './test-logs';

type SinonSpy = sinon.SinonSpy;

const currentFolder = __dirname;

describe('Logger4nodeAnonymous', () => {
  describe('logging string, object, array in one log', () => {
    let logger: Logger4Node;
    let callbackSpy: SinonSpy;
    let loggerInstance: Logger;

    beforeAll(() => {
      logger = new Logger4Node('Logger');
      loggerInstance = logger.instance('Instance');
      logger.setJsonLogging(true);
    });

    beforeEach(() => {
      logger.setLogPattern('Logger:*');
      logger.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger.setLogSeverityPattern(logSeverity));
      callbackSpy = spy(console, 'log');
    });

    it('should log object with string in proper json format', async () => {
      loggerInstance.error('this is string', { var: 1, var2: 2 });
      await wait();
      expect(callbackSpy.callCount).toBe(1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([{
        level: 'error',
        time: 0,
        extra: {},
        stack: '',
        className: 'Logger:Instance',
        source: {
          caller: 'Object.<anonymous>',
          fileName: 'test-json-annonomous.test.ts',
          path: currentFolder,
          line: '30',
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
