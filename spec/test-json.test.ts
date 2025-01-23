import { IncomingMessage, ServerResponse } from 'http';
import sinon, { spy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from '../src/logger/logger';
import { Logger4Node } from '../src/logger/logger4-node';
import {
  loggerSpy,
  printFatalLogsInDifferentType,
  printLogsInDifferentLevel,
  printLogsInDifferentType, printLogSingleLine,
  printLogsWithExtraFields,
  printLogWithBackSlashCharacter,
  printLogWithMultipleEndCharacters,
  printLogWithNewLineAndSlashNCharacter,
  printLogWithSpecialTabCharacter, stringLogsToJSON, wait,
} from './test-logs';

type SinonSpy = sinon.SinonSpy;

const currentFolder = __dirname;

describe('Logger4nodeJSON', () => {
  describe('logging in different level', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger1Instance2: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    beforeAll(() => {
      logger1 = new Logger4Node('Logger1');
      logger1.setJsonLogging(true);
      logger1Instance1 = logger1.instance('Instance1');
      logger1Instance2 = logger1.instance('Instance2');
      logger2 = new Logger4Node('Logger2');
      logger2.setJsonLogging(true);
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      logger1.setLogPattern('Logger1:*');
      logger2.setLogPattern('Logger1:*');
      logger1.setLogLevel(LogSeverity.VERBOSE);
      logger2.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger1.setLogSeverityPattern(logSeverity, undefined));
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger2.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = spy(console, 'log');
    });

    it('should print all logs', async () => {
      await printLogsInDifferentLevel(logger1Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'verbose',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '15',
            column: '10',
          },
          message: 'verbose log',
        },
        {
          level: 'debug',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '16',
            column: '10',
          },
          message: 'debug log',
        },
        {
          level: 'info',
          time: 2,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '17',
            column: '10',
          },
          message: 'info log',
        },
        {
          level: 'warn',
          time: 3,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 4,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
      ]);
    });

    it('should not print logger2 logs', async () => {
      await printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).toBe(0);
    });

    it('should allow print logger2 logs', async () => {
      logger2.setLogPattern('Logger1:*,Logger2:*');
      logger2.setLogPattern('Logger1:*,Logger2:*');
      await printLogsInDifferentLevel(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'verbose',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '15',
            column: '10',
          },
          message: 'verbose log',
        },
        {
          level: 'debug',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '16',
            column: '10',
          },
          message: 'debug log',
        },
        {
          level: 'info',
          time: 2,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '17',
            column: '10',
          },
          message: 'info log',
        },
        {
          level: 'warn',
          time: 3,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 4,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
      ]);
    });

    it('should print only Logger1 Debug  and above logs', async () => {
      logger1.setLogLevel(LogSeverity.WARN);
      logger2.setLogLevel(LogSeverity.WARN);
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'warn',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
      ]);
    });

    it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', async () => {
      logger1.setLogLevel(LogSeverity.WARN);
      logger2.setLogLevel(LogSeverity.WARN);
      logger1.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      logger2.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'warn',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
        {
          level: 'warn',
          time: 2,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
      ]);
    });

    it('should print both instance of Logger1', async () => {
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger1Instance2);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'verbose',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '15',
            column: '10',
          },
          message: 'verbose log',
        },
        {
          level: 'debug',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '16',
            column: '10',
          },
          message: 'debug log',
        },
        {
          level: 'info',
          time: 2,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '17',
            column: '10',
          },
          message: 'info log',
        },
        {
          level: 'warn',
          time: 3,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 4,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
        {
          level: 'verbose',
          time: 5,
          extra: {},
          stack: '',
          className: 'Logger1:Instance2',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '15',
            column: '10',
          },
          message: 'verbose log',
        },
        {
          level: 'debug',
          time: 6,
          extra: {},
          stack: '',
          className: 'Logger1:Instance2',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '16',
            column: '10',
          },
          message: 'debug log',
        },
        {
          level: 'info',
          time: 7,
          extra: {},
          stack: '',
          className: 'Logger1:Instance2',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '17',
            column: '10',
          },
          message: 'info log',
        },
        {
          level: 'warn',
          time: 8,
          extra: {},
          stack: '',
          className: 'Logger1:Instance2',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 9,
          extra: {},
          stack: '',
          className: 'Logger1:Instance2',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
      ]);
    });

    it('should print only instance1 of Logger1', async () => {
      logger1.setLogPattern('Logger1:*,-Logger1:Instance2*');
      logger2.setLogPattern('Logger1:*,-Logger1:Instance2*');
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger1Instance2);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'verbose',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '15',
            column: '10',
          },
          message: 'verbose log',
        },
        {
          level: 'debug',
          time: 1,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '16',
            column: '10',
          },
          message: 'debug log',
        },
        {
          level: 'info',
          time: 2,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '17',
            column: '10',
          },
          message: 'info log',
        },
        {
          level: 'warn',
          time: 3,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '18',
            column: '10',
          },
          message: 'warn log',
        },
        {
          level: 'error',
          time: 4,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentLevel',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '19',
            column: '10',
          },
          message: 'error log',
        },
      ]);
    });

    it('should print session information', async () => {
      logger1.setLogPattern('Logger1:*,-Logger1:Instance2*');
      logger2.setLogPattern('Logger1:*,-Logger1:Instance2*');
      Logger4Node.Trace.requestHandler((): Record<string, string> => ({ key1: 'value1', key2: 'value2' }))(
        {} as IncomingMessage,
        {} as ServerResponse,
        async () => {
          await printLogsInDifferentLevel(logger1Instance1);
          await printLogsWithExtraFields(logger1Instance1);
        });
      await wait(400);
      expect(callbackSpy.callCount).toBe(6);
      const calls = stringLogsToJSON(callbackSpy);
      calls.forEach((each_: { request: { id: string } }) => {
        const each = each_;
        expect(each.request.id).toBeDefined();
        delete each.request.id;
      });
      expect(calls).toEqual([{
        level: 'verbose',
        time: 0,
        extra: {},
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '15',
          column: '10',
        },
        message: 'verbose log',
      }, {
        level: 'debug',
        time: 1,
        extra: {},
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '16',
          column: '10',
        },
        message: 'debug log',
      }, {
        level: 'info',
        time: 2,
        extra: {},
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '17',
          column: '10',
        },
        message: 'info log',
      },
      {
        level: 'warn',
        time: 3,
        extra: {},
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '18',
          column: '10',
        },
        message: 'warn log',
      },
      {
        level: 'error',
        time: 4,
        extra: {},
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '19',
          column: '10',
        },
        message: 'error log',
      },
      {
        level: 'error',
        time: 5,
        stack: '',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        extra: { extraField: 'extraValue' },
        source: {
          caller: 'printLogsWithExtraFields',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '24',
          column: '10',
        },
        message: 'verbose log',
      }]);
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });

  describe('logging in different type', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    beforeAll(() => {
      logger1 = new Logger4Node('Logger1');
      logger1.setJsonLogging(true);
      logger1Instance1 = logger1.instance('Instance1');
      logger2 = new Logger4Node('Logger2');
      logger2.setJsonLogging(true);
      logger2.setStringLogging(true);
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      logger1.setLogPattern('Logger1:*,Logger2:*');
      logger2.setLogPattern('Logger1:*,Logger2:*');
      logger1.setLogLevel(LogSeverity.VERBOSE);
      logger2.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger1.setLogSeverityPattern(logSeverity, undefined));
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger2.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = spy(console, 'log');
    });

    it('should print logs not only in string', async () => {
      await printLogsInDifferentType(logger1Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger1:Instance1',
          source: {
            caller: 'printLogsInDifferentType',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '29',
            column: '10',
          },
          message: 'this is  1 true {"key1":1,"value":2}',
        },
      ]);
    });

    it('should print logs only in string', async () => {
      await printLogsInDifferentType(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printLogsInDifferentType',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '29',
            column: '10',
          },
          message: 'this is  1 true {"key1":1,"value":2}',
        },
      ]);
    });

    it('should print logs only in string for fatal', async () => {
      await printFatalLogsInDifferentType(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'fatal',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger2:Instance1',
          source: {
            caller: 'printFatalLogsInDifferentType',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '34',
            column: '10',
          },
          message: 'this is  1 true {"key1":1,"value":2}',
        },
      ]);
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });

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
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = spy(console, 'log');
    });

    it('should log multi line string in one line', async () => {
      await printLogWithMultipleEndCharacters(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger:Instance',
          source: {
            caller: 'printLogWithMultipleEndCharacters',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '39',
            column: '10',
          },
          message: 'this is line1\nline2\nline2 {"var":1,"var2":2}',
        },
      ]);
    });

    it('should log properly when message contains \\"', async () => {
      await printLogWithBackSlashCharacter(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger:Instance',
          source: {
            caller: 'printLogWithBackSlashCharacter',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '44',
            column: '10',
          },
          message: 'this is line1 \\" {"var":1,"var2":2}',
        },
      ]);
    });

    it('should log properly when message contains \t', async () => {
      await printLogWithSpecialTabCharacter(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger:Instance',
          source: {
            caller: 'printLogWithSpecialTabCharacter',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '49',
            column: '10',
          },
          message: 'this is line1 \t',
        },
      ]);
    });

    it('should log properly when message contains new line character with \n', async () => {
      await printLogWithNewLineAndSlashNCharacter(loggerInstance);
      expect(callbackSpy.callCount).toBe(1);
      expect(typeof JSON.parse(callbackSpy.getCall(0).args[0] as string)).toBe('object');
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });

  describe('github link logging', () => {
    let logger: Logger4Node;
    let callbackSpy: SinonSpy;
    let loggerInstance: Logger;

    beforeAll(() => {
      const currentPathSplit = __dirname.split('/');
      logger = new Logger4Node('Logger', {
        github: {
          basePath: currentPathSplit.slice(0, currentPathSplit.length - 1).join('/'),
          commitHash: 'fd4a2de07ed9e31d890370e05fb4b8a416f27224',
          org: 'yog27ray',
          repo: 'logger4node',
        },
      });
      loggerInstance = logger.instance('Instance');
      logger.setJsonLogging(true);
    });

    beforeEach(() => {
      logger.setLogPattern('Logger:*');
      logger.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = spy(console, 'log');
    });

    it('should log github detail', async () => {
      await printLogSingleLine(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          level: 'error',
          time: 0,
          extra: {},
          stack: '',
          className: 'Logger:Instance',
          source: {
            caller: 'printLogSingleLine',
            fileName: 'test-logs.ts',
            path: currentFolder,
            line: '54',
            column: '10',
            github: 'https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224/spec/test-logs.ts#L54',
          },
          message: 'this is string',
        },
      ]);
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });
});
