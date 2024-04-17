import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from './logger';
import { Logger4Node } from './logger4-node';

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


function printFatalLogsInDifferentType(logger: Logger): void {
  logger.fatal('this is ', 1, true, { key1: 1, value: 2 });
}

describe('Logger4nodeJSON', () => {
  context('logging in different level', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger1Instance2: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    before(() => {
      logger1 = new Logger4Node('Logger1');
      logger1.setJsonLogging(true);
      logger1Instance1 = logger1.instance('Instance1');
      logger1Instance2 = logger1.instance('Instance2');
      logger2 = new Logger4Node('Logger2');
      logger2.setJsonLogging(true);
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      Logger4Node.setLogPattern('Logger1:*');
      Logger4Node.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should print all logs', () => {
      printLogsInDifferentLevel(logger1Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":""}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":""}');
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":""}');
    });

    it('should not print logger2 logs', () => {
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(0);
    });

    it('should allow print logger2 logs', () => {
      Logger4Node.setLogPattern('Logger1:*,Logger2:*');
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"verbose","message":"verbose log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"debug","message":"debug log","stack":""}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"info","message":"info log","stack":""}');
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"error","message":"error log","stack":""}');
    });

    it('should print only Logger1 Debug  and above logs', () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(2);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":""}');
    });

    it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      Logger4Node.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(3);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":""}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":""}');
    });

    it('should print both instance of Logger1', () => {
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(10);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":""}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":""}');
      expect(callbackSpy.getCall(3).args.join(' '))
        .to.equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":""}');
      expect(callbackSpy.getCall(5).args.join(' ')).to
        .equal('{"className":"Logger1:Instance2","level":"verbose","message":"verbose log","stack":""}');
      expect(callbackSpy.getCall(6).args.join(' ')).to
        .equal('{"className":"Logger1:Instance2","level":"debug","message":"debug log","stack":""}');
      expect(callbackSpy.getCall(7).args.join(' ')).to
        .equal('{"className":"Logger1:Instance2","level":"info","message":"info log","stack":""}');
      expect(callbackSpy.getCall(8).args.join(' ')).to
        .equal('{"className":"Logger1:Instance2","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(9).args.join(' ')).to
        .equal('{"className":"Logger1:Instance2","level":"error","message":"error log","stack":""}');
    });

    it('should print only instance1 of Logger1', () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":""}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":""}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":""}');
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":""}');
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":""}');
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });

  context('logging in different type', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    before(() => {
      logger1 = new Logger4Node('Logger1');
      logger1.setJsonLogging(true);
      logger1Instance1 = logger1.instance('Instance1');
      logger2 = new Logger4Node('Logger2');
      logger2.setJsonLogging(true);
      logger2.setStringLogging(true);
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      Logger4Node.setLogPattern('Logger1:*,Logger2:*');
      Logger4Node.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should print logs not only in string', () => {
      printLogsInDifferentType(logger1Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger1:Instance1","level":"error","message":"this is  1 true {"key1":1,"value":2}","stack":""}');
    });

    it('should print logs only in string', () => {
      printLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"error","message":"this is  1 true {"key1":1,"value":2}","stack":""}');
    });

    it('should print logs only in string for fatal', () => {
      printFatalLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"className":"Logger2:Instance1","level":"fatal","message":"this is  1 true {"key1":1,"value":2}","stack":""}');
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });
});
