import { expect } from 'chai';
import { IncomingMessage, ServerResponse } from 'http';
import sinon, { SinonSpy } from 'sinon';
import { Logger, LogLevel, LogSeverity } from '../src/logger';
import { Logger4Node } from '../src/logger4-node';

const currentFolder = __dirname;

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
        .equal(`{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"10","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"11","column":"10"}}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"12","column":"10"}}`);
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
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
        .equal(`{"className":"Logger2:Instance1","level":"verbose","message":"verbose log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"10","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"debug","message":"debug log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"11","column":"10"}}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"info","message":"info log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"12","column":"10"}}`);
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
    });

    it('should print only Logger1 Debug  and above logs', () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(2);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
    });

    it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      Logger4Node.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(3);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
    });

    it('should print both instance of Logger1', () => {
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(10);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"10","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"11","column":"10"}}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"12","column":"10"}}`);
      expect(callbackSpy.getCall(3).args.join(' '))
        .to.equal(`{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
      expect(callbackSpy.getCall(5).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance2","level":"verbose","message":"verbose log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"10","column":"10"}}`);
      expect(callbackSpy.getCall(6).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance2","level":"debug","message":"debug log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"11","column":"10"}}`);
      expect(callbackSpy.getCall(7).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance2","level":"info","message":"info log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"12","column":"10"}}`);
      expect(callbackSpy.getCall(8).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance2","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(9).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance2","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
    });

    it('should print only instance1 of Logger1', () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      printLogsInDifferentLevel(logger1Instance1);
      printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"10","column":"10"}}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"11","column":"10"}}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"12","column":"10"}}`);
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"13","column":"10"}}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"14","column":"10"}}`);
    });

    it('should print session information', () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      Logger4Node.Trace.requestHandler(function testName(): Record<string, string> {
        return ({ key1: 'value1', key2: 'value2' });
      })({} as IncomingMessage, {} as ServerResponse, () => {
        printLogsInDifferentLevel(logger1Instance1);
        logger1Instance1.log(LogSeverity.ERROR, { extraField: 'extraValue' }, 'verbose log');
      });
      expect(callbackSpy.callCount).to.equal(6);
      const calls = new Array(6)
          .fill(0)
          .map((zero, index) => callbackSpy.getCall(index).args.join(' '))
          .map(each => JSON.parse(each));
      calls.forEach(each => {
        expect(each.session.sessionId).to.exist;
        delete each.session.sessionId;
      });
      expect(calls).to.deep.equal([{
        className: 'Logger1:Instance1',
        level: 'verbose',
        message: 'verbose log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '10',
          column: '10',
        },
      }, {
        className: 'Logger1:Instance1',
        level: 'debug',
        message: 'debug log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '11',
          column: '10',
        },
      }, {
        className: 'Logger1:Instance1',
        level: 'info',
        message: 'info log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '12',
          column: '10',
        },
      }, {
        className: 'Logger1:Instance1',
        level: 'warn',
        message: 'warn log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '13',
          column: '10'
        },
      }, {
        className: 'Logger1:Instance1',
        level: 'error',
        message: 'error log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '14',
          column: '10',
        },
      }, {
        className: 'Logger1:Instance1',
        level: 'error',
        message: 'verbose log',
        stack: '',
        session: { key1: 'value1', key2: 'value2' },
        extraData: { extraField: 'extraValue' },
        source: {
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '161',
          column: '26',
        },
      }]);
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
        .equal(`{"className":"Logger1:Instance1","level":"error","message":"this is  1 true {\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printLogsInDifferentType","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"18","column":"10"}}`);
    });

    it('should print logs only in string', () => {
      printLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"error","message":"this is  1 true {\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printLogsInDifferentType","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"18","column":"10"}}`);
    });

    it('should print logs only in string for fatal', () => {
      printFatalLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal(`{"className":"Logger2:Instance1","level":"fatal","message":"this is  1 true {\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printFatalLogsInDifferentType","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"22","column":"10"}}`);
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });

  context('logging string, object, array in one log', () => {
    let callbackSpy: SinonSpy;
    let loggerInstance: Logger;

    before(() => {
      const logger = new Logger4Node('Logger');
      loggerInstance = logger.instance('Instance');
      logger.setJsonLogging(true);
    });

    beforeEach(() => {
      Logger4Node.setLogPattern('Logger:*');
      Logger4Node.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should log object with string in proper json format', () => {
      loggerInstance.error('this is string', { var: 1, var2: 2 });
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal(`{"className":"Logger:Instance","level":"error","message":"this is string {\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"326","column":"22"}}`);
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        className: 'Logger:Instance',
        level: 'error',
        message: 'this is string {"var":1,"var2":2}',
        stack: '',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '326',
          column: '22',
        },
      });
    });

    it('should log multi line string in one line', () => {
      loggerInstance.error('this is line1\nline2\nline2', { var: 1, var2: 2 });
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"className":"Logger:Instance","level":"error","message":"this is line1\\nline2\\nline2'
            + ` {\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"346","column":"22"}}`);
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        className: 'Logger:Instance',
        level: 'error',
        message: 'this is line1\nline2\nline2 {"var":1,"var2":2}',
        stack: '',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '346',
          column: '22',
        },
      });
    });

    it('should log properly when message contains \\"', () => {
      loggerInstance.error('this is line1 \\"', { var: 1, var2: 2 });
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal(`{"className":"Logger:Instance","level":"error","message":"this is line1 \\\\\\" {\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"367","column":"22"}}`);
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        className: 'Logger:Instance',
        level: 'error',
        message: 'this is line1 \\" {"var":1,"var2":2}',
        stack: '',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '367',
          column: '22',
        },
      });
    });

    it('should log properly when message contains \t', () => {
      loggerInstance.error('this is line1 \t');
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal(`{"className":"Logger:Instance","level":"error","message":"this is line1 \\t","stack":"", "source": {"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"${currentFolder}","line":"387","column":"22"}}`);
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        className: 'Logger:Instance',
        level: 'error',
        message: 'this is line1 \t',
        stack: '',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '387',
          column: '22',
        },
      });
    });

    it('should log properly when message contains string as well as json"', () => {
      try {
        throw new class TestError extends Error {
          code: 400;
          type: 'ERROR_SERVER_NOT_START';
          constructor() {
            super();
            this.message = 'Received an error with invalid JSON from Parse: <html>\r\n<head><title>503 Service Temporarily Unavailable</title></head>\r\n<body>\r\n<center><h1>503 Service Temporarily Unavailable</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>';
          }
        }();
      } catch (error) {
        loggerInstance.error(error);
      }
      expect(callbackSpy.callCount).to.equal(1);
      expect(typeof JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.equal('object');
    });

    afterEach(() => {
      callbackSpy.restore();
    });
  });
});
