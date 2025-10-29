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
          className: 'Logger1:Instance1',
          extra: {},
          level: 'verbose',
          message: 'verbose log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '15',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'debug',
          message: 'debug log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '16',
            path: currentFolder,
          },
          stack: '',
          time: 1,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'info',
          message: 'info log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '17',
            path: currentFolder,
          },
          stack: '',
          time: 2,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 3,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 4,
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
          className: 'Logger2:Instance1',
          extra: {},
          level: 'verbose',
          message: 'verbose log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '15',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'debug',
          message: 'debug log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '16',
            path: currentFolder,
          },
          stack: '',
          time: 1,
        },
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'info',
          message: 'info log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '17',
            path: currentFolder,
          },
          stack: '',
          time: 2,
        },
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 3,
        },
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 4,
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
          className: 'Logger1:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 1,
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
          className: 'Logger1:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 1,
        },
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 2,
        },
      ]);
    });

    it('should print both instance of Logger1', async () => {
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger1Instance2);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'verbose',
          message: 'verbose log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '15',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'debug',
          message: 'debug log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '16',
            path: currentFolder,
          },
          stack: '',
          time: 1,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'info',
          message: 'info log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '17',
            path: currentFolder,
          },
          stack: '',
          time: 2,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 3,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 4,
        },
        {
          className: 'Logger1:Instance2',
          extra: {},
          level: 'verbose',
          message: 'verbose log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '15',
            path: currentFolder,
          },
          stack: '',
          time: 5,
        },
        {
          className: 'Logger1:Instance2',
          extra: {},
          level: 'debug',
          message: 'debug log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '16',
            path: currentFolder,
          },
          stack: '',
          time: 6,
        },
        {
          className: 'Logger1:Instance2',
          extra: {},
          level: 'info',
          message: 'info log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '17',
            path: currentFolder,
          },
          stack: '',
          time: 7,
        },
        {
          className: 'Logger1:Instance2',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 8,
        },
        {
          className: 'Logger1:Instance2',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 9,
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
          className: 'Logger1:Instance1',
          extra: {},
          level: 'verbose',
          message: 'verbose log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '15',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'debug',
          message: 'debug log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '16',
            path: currentFolder,
          },
          stack: '',
          time: 1,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'info',
          message: 'info log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '17',
            path: currentFolder,
          },
          stack: '',
          time: 2,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'warn',
          message: 'warn log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '18',
            path: currentFolder,
          },
          stack: '',
          time: 3,
        },
        {
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'error log',
          source: {
            caller: 'printLogsInDifferentLevel',
            column: '10',
            fileName: 'test-logs.ts',
            line: '19',
            path: currentFolder,
          },
          stack: '',
          time: 4,
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
        className: 'Logger1:Instance1',
        extra: {},
        level: 'verbose',
        message: 'verbose log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          column: '10',
          fileName: 'test-logs.ts',
          line: '15',
          path: currentFolder,
        },
        stack: '',
        time: 0,
      }, {
        className: 'Logger1:Instance1',
        extra: {},
        level: 'debug',
        message: 'debug log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          column: '10',
          fileName: 'test-logs.ts',
          line: '16',
          path: currentFolder,
        },
        stack: '',
        time: 1,
      }, {
        className: 'Logger1:Instance1',
        extra: {},
        level: 'info',
        message: 'info log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          column: '10',
          fileName: 'test-logs.ts',
          line: '17',
          path: currentFolder,
        },
        stack: '',
        time: 2,
      },
      {
        className: 'Logger1:Instance1',
        extra: {},
        level: 'warn',
        message: 'warn log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          column: '10',
          fileName: 'test-logs.ts',
          line: '18',
          path: currentFolder,
        },
        stack: '',
        time: 3,
      },
      {
        className: 'Logger1:Instance1',
        extra: {},
        level: 'error',
        message: 'error log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          column: '10',
          fileName: 'test-logs.ts',
          line: '19',
          path: currentFolder,
        },
        stack: '',
        time: 4,
      },
      {
        className: 'Logger1:Instance1',
        extra: { extraField: 'extraValue' },
        level: 'error',
        message: 'verbose log',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsWithExtraFields',
          column: '10',
          fileName: 'test-logs.ts',
          line: '34',
          path: currentFolder,
        },
        stack: '',
        time: 5,
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
          className: 'Logger1:Instance1',
          extra: {},
          level: 'error',
          message: 'this is  1 true {"key1":1,"value":2}',
          source: {
            caller: 'printLogsInDifferentType',
            column: '10',
            fileName: 'test-logs.ts',
            line: '24',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
      ]);
    });

    it('should print logs only in string', async () => {
      await printLogsInDifferentType(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'error',
          message: 'this is  1 true {"key1":1,"value":2}',
          source: {
            caller: 'printLogsInDifferentType',
            column: '10',
            fileName: 'test-logs.ts',
            line: '24',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
      ]);
    });

    it('should print logs only in string for fatal', async () => {
      await printFatalLogsInDifferentType(logger2Instance1);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          className: 'Logger2:Instance1',
          extra: {},
          level: 'fatal',
          message: 'this is  1 true {"key1":1,"value":2}',
          source: {
            caller: 'printFatalLogsInDifferentType',
            column: '10',
            fileName: 'test-logs.ts',
            line: '10',
            path: currentFolder,
          },
          stack: '',
          time: 0,
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
          className: 'Logger:Instance',
          extra: {},
          level: 'error',
          message: 'this is line1\nline2\nline2 {"var":1,"var2":2}',
          source: {
            caller: 'printLogWithMultipleEndCharacters',
            column: '10',
            fileName: 'test-logs.ts',
            line: '44',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
      ]);
    });

    it('should log properly when message contains \\"', async () => {
      await printLogWithBackSlashCharacter(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          className: 'Logger:Instance',
          extra: {},
          level: 'error',
          message: 'this is line1 \\" {"var":1,"var2":2}',
          source: {
            caller: 'printLogWithBackSlashCharacter',
            column: '10',
            fileName: 'test-logs.ts',
            line: '39',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
      ]);
    });

    it('should log properly when message contains \t', async () => {
      await printLogWithSpecialTabCharacter(loggerInstance);
      const logs = stringLogsToJSON(callbackSpy);
      expect(logs).toEqual([
        {
          className: 'Logger:Instance',
          extra: {},
          level: 'error',
          message: 'this is line1 \t',
          source: {
            caller: 'printLogWithSpecialTabCharacter',
            column: '10',
            fileName: 'test-logs.ts',
            line: '69',
            path: currentFolder,
          },
          stack: '',
          time: 0,
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
          className: 'Logger:Instance',
          extra: {},
          level: 'error',
          message: 'this is string',
          source: {
            caller: 'printLogSingleLine',
            column: '10',
            fileName: 'test-logs.ts',
            github: 'https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224/spec/test-logs.ts#L29',
            line: '29',
            path: currentFolder,
          },
          stack: '',
          time: 0,
        },
      ]);
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });
});
