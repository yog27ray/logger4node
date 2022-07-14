import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from './logger';
import { Logger4Node } from './logger4-node';

function printLogs(logger: Logger): void {
  logger.verbose('Verbose log');
  logger.info('Info log');
  logger.warn('Warn log');
  logger.debug('Debug log');
  logger.error('Error log');
}

describe('Logger4node', () => {
  context('logging in different scenario', () => {
    let callbackSpy: SinonSpy;
    let logger1: Logger4Node;
    let logger1Instance1: Logger;
    let logger1Instance2: Logger;
    let logger2: Logger4Node;
    let logger2Instance1: Logger;

    before(() => {
      logger1 = new Logger4Node('Logger1');
      logger1Instance1 = logger1.instance('Instance1');
      logger1Instance2 = logger1.instance('Instance2');
      logger2 = new Logger4Node('Logger2');
      logger2Instance1 = logger2.instance('Instance1');
    });

    beforeEach(() => {
      Logger4Node.setLogPattern('Logger1:*');
      Logger4Node.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should print all logs', () => {
      printLogs(logger1Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
      expect(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
      expect(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
    });

    it('should not print logger2 logs', () => {
      printLogs(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(0);
    });

    it('should allow print logger2 logs', () => {
      Logger4Node.setLogPattern('Logger1:*,Logger2:*');
      printLogs(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger2:Instance1\x1B[37mVerbose log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger2:Instance1\x1B[35mInfo log\x1B[0m');
      expect(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger2:Instance1\x1B[33mWarn log\x1B[0m');
      expect(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger2:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger2:Instance1\x1B[31mError log\x1B[0m');
    });

    it('should print only Logger1 debug and above logs', () => {
      Logger4Node.setLogLevel(LogSeverity.DEBUG);
      printLogs(logger1Instance1);
      printLogs(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(2);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
    });

    it('should print only Logger1 debug and above logs and logger2 only debug', () => {
      Logger4Node.setLogLevel(LogSeverity.DEBUG);
      Logger4Node.setLogSeverityPattern(LogSeverity.DEBUG, 'Logger2:*');
      printLogs(logger1Instance1);
      printLogs(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(3);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
      expect(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger2:Instance1\x1B[34mDebug log\x1B[0m');
    });

    it('should print both instance of Logger1', () => {
      printLogs(logger1Instance1);
      printLogs(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(10);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
      expect(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
      expect(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
      expect(callbackSpy.getCall(5).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance2\x1B[37mVerbose log\x1B[0m');
      expect(callbackSpy.getCall(6).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance2\x1B[35mInfo log\x1B[0m');
      expect(callbackSpy.getCall(7).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance2\x1B[33mWarn log\x1B[0m');
      expect(callbackSpy.getCall(8).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance2\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(9).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance2\x1B[31mError log\x1B[0m');
    });

    it('should print only instance1 of Logger1', () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      printLogs(logger1Instance1);
      printLogs(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
      expect(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
      expect(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
      expect(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
      expect(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });
});
