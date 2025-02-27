import sinon, { spy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from '../src/logger/logger';
import { Logger4Node } from '../src/logger/logger4-node';

type SinonSpy = sinon.SinonSpy;

function printLogsInDifferentLevel(logger: Logger): void {
  logger.verbose('verbose log');
  logger.debug('debug log');
  logger.info('info log');
  logger.warn('warn log');
  logger.error('error log');
}

function printLogsInDifferentType(logger: Logger): void {
  logger.error('this is ', 1, true, { key1: 1, value: 2 });
}

describe('Logger4nodeString', () => {
  describe('logging in different level', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger1Instance2: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    beforeAll(() => {
      logger1 = new Logger4Node('Logger1');
      logger1Instance1 = logger1.instance('Instance1');
      logger1Instance2 = logger1.instance('Instance2');
      logger2 = new Logger4Node('Logger2');
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      logger1.setLogPattern('Logger1:*');
      logger1.setLogLevel(LogSeverity.VERBOSE);
      logger2.setLogPattern('Logger1:*');
      logger2.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger1.setLogSeverityPattern(logSeverity, undefined));
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => logger2.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = spy(console, 'log');
    });

    it('should print all logs', () => {
      printLogsInDifferentLevel(logger1Instance1);
      expect(callbackSpy.callCount).toBe(5);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Verbose: Logger1:Instance1 verbose log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Debug: Logger1:Instance1 debug log');
      expect(callbackSpy.getCall(2).args.join(' ')).toBe('Info: Logger1:Instance1 info log');
      expect(callbackSpy.getCall(3).args.join(' ')).toBe('Warn: Logger1:Instance1 warn log');
      expect(callbackSpy.getCall(4).args.join(' ')).toBe('Error: Logger1:Instance1 error log');
    });

    it('should not print logger2 logs', () => {
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).toBe(0);
    });

    it('should allow print logger2 logs', () => {
      logger1.setLogPattern('Logger1:*,Logger2:*');
      logger2.setLogPattern('Logger1:*,Logger2:*');
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).toBe(5);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Verbose: Logger2:Instance1 verbose log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Debug: Logger2:Instance1 debug log');
      expect(callbackSpy.getCall(2).args.join(' ')).toBe('Info: Logger2:Instance1 info log');
      expect(callbackSpy.getCall(3).args.join(' ')).toBe('Warn: Logger2:Instance1 warn log');
      expect(callbackSpy.getCall(4).args.join(' ')).toBe('Error: Logger2:Instance1 error log');
    });

    it('should print only Logger1 Debug  and above logs', () => {
      logger1.setLogLevel(LogSeverity.WARN);
      logger2.setLogLevel(LogSeverity.WARN);
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).toBe(2);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Warn: Logger1:Instance1 warn log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Error: Logger1:Instance1 error log');
    });

    it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', () => {
      logger1.setLogLevel(LogSeverity.WARN);
      logger2.setLogLevel(LogSeverity.WARN);
      logger1.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      logger2.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).toBe(3);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Warn: Logger1:Instance1 warn log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Error: Logger1:Instance1 error log');
      expect(callbackSpy.getCall(2).args.join(' ')).toBe('Warn: Logger2:Instance1 warn log');
    });

    it('should print both instance of Logger1', () => {
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).toBe(10);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Verbose: Logger1:Instance1 verbose log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Debug: Logger1:Instance1 debug log');
      expect(callbackSpy.getCall(2).args.join(' ')).toBe('Info: Logger1:Instance1 info log');
      expect(callbackSpy.getCall(3).args.join(' ')).toBe('Warn: Logger1:Instance1 warn log');
      expect(callbackSpy.getCall(4).args.join(' ')).toBe('Error: Logger1:Instance1 error log');
      expect(callbackSpy.getCall(5).args.join(' ')).toBe('Verbose: Logger1:Instance2 verbose log');
      expect(callbackSpy.getCall(6).args.join(' ')).toBe('Debug: Logger1:Instance2 debug log');
      expect(callbackSpy.getCall(7).args.join(' ')).toBe('Info: Logger1:Instance2 info log');
      expect(callbackSpy.getCall(8).args.join(' ')).toBe('Warn: Logger1:Instance2 warn log');
      expect(callbackSpy.getCall(9).args.join(' ')).toBe('Error: Logger1:Instance2 error log');
    });

    it('should print only instance1 of Logger1', () => {
      logger1.setLogPattern('Logger1:*,-Logger1:Instance2*');
      logger2.setLogPattern('Logger1:*,-Logger1:Instance2*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).toBe(5);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Verbose: Logger1:Instance1 verbose log');
      expect(callbackSpy.getCall(1).args.join(' ')).toBe('Debug: Logger1:Instance1 debug log');
      expect(callbackSpy.getCall(2).args.join(' ')).toBe('Info: Logger1:Instance1 info log');
      expect(callbackSpy.getCall(3).args.join(' ')).toBe('Warn: Logger1:Instance1 warn log');
      expect(callbackSpy.getCall(4).args.join(' ')).toBe('Error: Logger1:Instance1 error log');
    });

    afterEach(() => {
      callbackSpy.restore();
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
      logger1Instance1 = logger1.instance('Instance1');
      logger2 = new Logger4Node('Logger2');
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

    it('should print logs only in string', () => {
      printLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).toBe(1);
      expect(callbackSpy.getCall(0).args.join(' ')).toBe('Error: Logger2:Instance1 this is  1 true {"key1":1,"value":2}');
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });
});
