import { expect } from 'chai';
import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'node:fs';
import sinon, { SinonSpy } from 'sinon';
import { Tail } from 'tail';
import { Logger, LogLevel, LogSeverity } from '../src/logger/logger';
import { Logger4Node } from '../src/logger/logger4-node';
import {
  printFatalLogsInDifferentType,
  printLogsInDifferentLevel,
  printLogsInDifferentType, printLogSingleLine,
  printLogsWithExtraFields,
  printLogWithBackSlashCharacter,
  printLogWithMultipleEndCharacters,
  printLogWithNewLineAndSlashNCharacter,
  printLogWithSpecialTabCharacter, wait,
} from './test-logs';

const currentFolder = __dirname;

const spyConsoleLog: Array<string> = [];

const loggerSpy = {
  log(_data: string): void {
    let data = _data;
    const json = JSON.parse(data);
    json.time = spyConsoleLog.length;
    json.pid = 1;
    json.hostname = 'hostname';
    data = JSON.stringify(json);
    console.log(JSON.stringify(json));
    spyConsoleLog.push(data);
  },
  reset(): void {
    spyConsoleLog.splice(0, spyConsoleLog.length);
  },
};

fs.writeFileSync('./spec/test.logs', '', 'utf-8');
new Tail('./spec/test.logs')
  .on('line', (data: string) => loggerSpy.log(data))
  .on('error', (error: Error) => console.log(error))
  .watch();

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

    it('should print all logs', async () => {
      await printLogsInDifferentLevel(logger1Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
    });

    it('should not print logger2 logs', async () => {
      await printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(0);
    });

    it('should allow print logger2 logs', async () => {
      Logger4Node.setLogPattern('Logger1:*,Logger2:*');
      await printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
    });

    it('should print only Logger1 Debug  and above logs', async () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(2);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"warn","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"error","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
    });

    it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', async () => {
      Logger4Node.setLogLevel(LogSeverity.WARN);
      Logger4Node.setLogSeverityPattern(LogSeverity.WARN, 'Logger2:*');
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(3);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"warn","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"error","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"level":"warn","time":2,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
    });

    it('should print both instance of Logger1', async () => {
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(10);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
      expect(callbackSpy.getCall(3).args.join(' '))
        .to.equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
        + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
        + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"14","column":"10"},"message":"error log"}');
      expect(callbackSpy.getCall(5).args.join(' ')).to
        .equal('{"level":"verbose","time":5,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"10","column":"10"},"message":"verbose log"}');
      expect(callbackSpy.getCall(6).args.join(' ')).to
        .equal('{"level":"debug","time":6,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"11","column":"10"},"message":"debug log"}');
      expect(callbackSpy.getCall(7).args.join(' ')).to
        .equal('{"level":"info","time":7,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"12","column":"10"},"message":"info log"}');
      expect(callbackSpy.getCall(8).args.join(' ')).to
        .equal('{"level":"warn","time":8,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"13","column":"10"},"message":"warn log"}');
      expect(callbackSpy.getCall(9).args.join(' ')).to
        .equal('{"level":"error","time":9,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"14","column":"10"},"message":"error log"}');
    });

    it('should print only instance1 of Logger1', async () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      await printLogsInDifferentLevel(logger1Instance1);
      await printLogsInDifferentLevel(logger1Instance2);
      expect(callbackSpy.callCount).to.equal(5);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"10","column":"10"},"message":"verbose log"}');
      expect(callbackSpy.getCall(1).args.join(' ')).to
        .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
          + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"11","column":"10"},"message":"debug log"}');
      expect(callbackSpy.getCall(2).args.join(' ')).to
        .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
          + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"12","column":"10"},"message":"info log"}');
      expect(callbackSpy.getCall(3).args.join(' ')).to
        .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
          + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"13","column":"10"},"message":"warn log"}');
      expect(callbackSpy.getCall(4).args.join(' ')).to
        .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
          + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"14","column":"10"},"message":"error log"}');
    });

    it('should print session information', async () => {
      Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
      Logger4Node.Trace.requestHandler((): Record<string, string> => ({ key1: 'value1', key2: 'value2' }))(
        {} as IncomingMessage,
        {} as ServerResponse,
        async () => {
          await printLogsInDifferentLevel(logger1Instance1);
          await printLogsWithExtraFields(logger1Instance1);
        });
      await wait(400);
      expect(callbackSpy.callCount).to.equal(6);
      const calls = new Array(6)
        .fill(0)
        .map((zero, index) => callbackSpy.getCall(index).args.join(' '))
        .map((each): { request: { id: string } } => JSON.parse(each) as { request: { id: string } });
      calls.forEach((each_: { request: { id: string } }) => {
        const each = each_;
        expect(each.request.id).to.exist;
        delete each.request.id;
      });
      expect(calls).to.deep.equal([{
        level: 'verbose',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '10',
          column: '10',
        },
        message: 'verbose log',
      }, {
        level: 'debug',
        time: 1,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '11',
          column: '10',
        },
        message: 'debug log',
      }, {
        level: 'info',
        time: 2,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '12',
          column: '10',
        },
        message: 'info log',
      },
      {
        level: 'warn',
        time: 3,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '13',
          column: '10',
        },
        message: 'warn log',
      },
      {
        level: 'error',
        time: 4,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        source: {
          caller: 'printLogsInDifferentLevel',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '14',
          column: '10',
        },
        message: 'error log',
      },
      {
        level: 'error',
        time: 5,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger1:Instance1',
        request: { key1: 'value1', key2: 'value2' },
        extra: { extraField: 'extraValue' },
        source: {
          caller: 'printLogsWithExtraFields',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '19',
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

    it('should print logs not only in string', async () => {
      await printLogsInDifferentType(logger1Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
          + ':{"caller":"printLogsInDifferentType","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"24","column":"10"},"message":"this is  1 true {\\\\\\"key1\\\\\\":1,\\\\\\"value\\\\\\":2}"}');
    });

    it('should print logs only in string', async () => {
      await printLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source"'
          + ':{"caller":"printLogsInDifferentType","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"24","column":"10"},"message":"this is  1 true {\\\\\\"key1\\\\\\":1,\\\\\\"value\\\\\\":2}"}');
    });

    it('should print logs only in string for fatal', async () => {
      await printFatalLogsInDifferentType(logger2Instance1);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args.join(' ')).to
        .equal('{"level":"fatal","time":0,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source"'
          + ':{"caller":"printFatalLogsInDifferentType","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"29","column":"10"},"message":"this is  1 true {\\\\\\"key1\\\\\\":1,\\\\\\"value\\\\\\":2}"}');
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
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

    it('should log object with string in proper json format', async () => {
      loggerInstance.error('this is string', { var: 1, var2: 2 });
      await wait();
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
          + ':{"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"'
          + `${currentFolder}`
          + '","line":"447","column":"22"},"message":"this is string {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'Context.<anonymous>',
          fileName: 'test-json.spec.ts',
          path: currentFolder,
          line: '447',
          column: '22',
        },
        message: 'this is string {\\"var\\":1,\\"var2\\":2}',
      });
    });

    it('should log multi line string in one line', async () => {
      await printLogWithMultipleEndCharacters(loggerInstance);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
          + ':{"caller":"printLogWithMultipleEndCharacters","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"34","column":"10"},"message":"this is line1\\\\nline2\\\\nline2 {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'printLogWithMultipleEndCharacters',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '34',
          column: '10',
        },
        message: 'this is line1\\nline2\\nline2 {\\"var\\":1,\\"var2\\":2}',
      });
    });

    it('should log properly when message contains \\"', async () => {
      await printLogWithBackSlashCharacter(loggerInstance);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
          + ':{"caller":"printLogWithBackSlashCharacter","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"39","column":"10"},"message":"this is line1 \\\\\\\\\\\\\\" {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'printLogWithBackSlashCharacter',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '39',
          column: '10',
        },
        message: 'this is line1 \\\\\\" {\\"var\\":1,\\"var2\\":2}',
      });
    });

    it('should log properly when message contains \t', async () => {
      await printLogWithSpecialTabCharacter(loggerInstance);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
          + ':{"caller":"printLogWithSpecialTabCharacter","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"44","column":"10"},"message":"this is line1 \\\\t"}');
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'printLogWithSpecialTabCharacter',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '44',
          column: '10',
        },
        message: 'this is line1 \\t',
      });
    });

    it('should log properly when message contains new line character with \n', async () => {
      await printLogWithNewLineAndSlashNCharacter(loggerInstance);
      expect(callbackSpy.callCount).to.equal(1);
      expect(typeof JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.equal('object');
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });

  context('github link logging', () => {
    let callbackSpy: SinonSpy;
    let loggerInstance: Logger;

    before(() => {
      const currentPathSplit = __dirname.split('/');
      const logger = new Logger4Node('Logger', {
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
      Logger4Node.setLogPattern('Logger:*');
      Logger4Node.setLogLevel(LogSeverity.VERBOSE);
      Object.keys(LogLevel).forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, undefined));
      callbackSpy = sinon.spy(console, 'log');
    });

    it('should log github detail', async () => {
      await printLogSingleLine(loggerInstance);
      expect(callbackSpy.callCount).to.equal(1);
      expect(callbackSpy.getCall(0).args[0]).to
        .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
          + ':{"caller":"printLogSingleLine","fileName":"test-logs.ts","path":"'
          + `${currentFolder}`
          + '","line":"49","column":"10","github":"https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224'
          + '/spec/test-logs.ts#L49"},"message":"this is string"}');
      expect(JSON.parse(callbackSpy.getCall(0).args[0] as string)).to.deep.equal({
        level: 'error',
        time: 0,
        pid: 1,
        hostname: 'hostname',
        className: 'Logger:Instance',
        source: {
          caller: 'printLogSingleLine',
          fileName: 'test-logs.ts',
          path: currentFolder,
          line: '49',
          column: '10',
          github: 'https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224/spec/test-logs.ts#L49',
        },
        message: 'this is string',
      });
    });

    afterEach(() => {
      callbackSpy.restore();
      loggerSpy.reset();
    });
  });
});