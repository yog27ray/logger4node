"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = __importStar(require("node:fs"));
const sinon_1 = __importDefault(require("sinon"));
const tail_1 = require("tail");
const logger_1 = require("../src/logger/logger");
const logger4_node_1 = require("../src/logger/logger4-node");
const test_logs_1 = require("./test-logs");
const currentFolder = __dirname;
const spyConsoleLog = [];
const loggerSpy = {
    log(_data) {
        let data = _data;
        const json = JSON.parse(data);
        json.time = spyConsoleLog.length;
        json.pid = 1;
        json.hostname = 'hostname';
        data = JSON.stringify(json);
        console.log(JSON.stringify(json));
        spyConsoleLog.push(data);
    },
    reset() {
        spyConsoleLog.splice(0, spyConsoleLog.length);
    },
};
fs.writeFileSync('./spec/test.logs', '', 'utf-8');
new tail_1.Tail('./spec/test.logs')
    .on('line', (data) => loggerSpy.log(data))
    .on('error', (error) => console.log(error))
    .watch();
describe('Logger4nodeJSON', () => {
    context('logging in different level', () => {
        let callbackSpy;
        let logger1;
        let logger1Instance1;
        let logger1Instance2;
        let logger2;
        let logger2Instance1;
        before(() => {
            logger1 = new logger4_node_1.Logger4Node('Logger1');
            logger1.setJsonLogging(true);
            logger1Instance1 = logger1.instance('Instance1');
            logger1Instance2 = logger1.instance('Instance2');
            logger2 = new logger4_node_1.Logger4Node('Logger2');
            logger2.setJsonLogging(true);
            logger2Instance1 = logger2.instance('Instance1');
        });
        beforeEach(() => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*');
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print all logs', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
        });
        it('should not print logger2 logs', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(0);
        });
        it('should allow print logger2 logs', async () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,Logger2:*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
        });
        it('should print only Logger1 Debug  and above logs', async () => {
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.WARN);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(2);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"warn","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"error","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
        });
        it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', async () => {
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.WARN);
            logger4_node_1.Logger4Node.setLogSeverityPattern(logger_1.LogSeverity.WARN, 'Logger2:*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(3);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"warn","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"error","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"},"message":"error log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"level":"warn","time":2,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
        });
        it('should print both instance of Logger1', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(10);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"},"message":"verbose log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"},"message":"debug log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"},"message":"info log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' '))
                .to.equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"},"message":"warn log"}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"14","column":"10"},"message":"error log"}');
            (0, chai_1.expect)(callbackSpy.getCall(5).args.join(' ')).to
                .equal('{"level":"verbose","time":5,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"10","column":"10"},"message":"verbose log"}');
            (0, chai_1.expect)(callbackSpy.getCall(6).args.join(' ')).to
                .equal('{"level":"debug","time":6,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"11","column":"10"},"message":"debug log"}');
            (0, chai_1.expect)(callbackSpy.getCall(7).args.join(' ')).to
                .equal('{"level":"info","time":7,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"12","column":"10"},"message":"info log"}');
            (0, chai_1.expect)(callbackSpy.getCall(8).args.join(' ')).to
                .equal('{"level":"warn","time":8,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"13","column":"10"},"message":"warn log"}');
            (0, chai_1.expect)(callbackSpy.getCall(9).args.join(' ')).to
                .equal('{"level":"error","time":9,"pid":1,"hostname":"hostname","className":"Logger1:Instance2","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"14","column":"10"},"message":"error log"}');
        });
        it('should print only instance1 of Logger1', async () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"verbose","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"10","column":"10"},"message":"verbose log"}');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"level":"debug","time":1,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source":'
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"11","column":"10"},"message":"debug log"}');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"level":"info","time":2,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
                + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"12","column":"10"},"message":"info log"}');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"level":"warn","time":3,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
                + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"13","column":"10"},"message":"warn log"}');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"level":"error","time":4,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
                + ':{"caller":"printLogsInDifferentLevel","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"14","column":"10"},"message":"error log"}');
        });
        it('should print session information', async () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            logger4_node_1.Logger4Node.Trace.requestHandler(() => ({ key1: 'value1', key2: 'value2' }))({}, {}, async () => {
                await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
                await (0, test_logs_1.printLogsWithExtraFields)(logger1Instance1);
            });
            await (0, test_logs_1.wait)(400);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(6);
            const calls = new Array(6)
                .fill(0)
                .map((zero, index) => callbackSpy.getCall(index).args.join(' '))
                .map((each) => JSON.parse(each));
            calls.forEach((each_) => {
                const each = each_;
                (0, chai_1.expect)(each.request.id).to.exist;
                delete each.request.id;
            });
            (0, chai_1.expect)(calls).to.deep.equal([{
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
        let callbackSpy;
        let logger1;
        let logger1Instance1;
        let logger2;
        let logger2Instance1;
        before(() => {
            logger1 = new logger4_node_1.Logger4Node('Logger1');
            logger1.setJsonLogging(true);
            logger1Instance1 = logger1.instance('Instance1');
            logger2 = new logger4_node_1.Logger4Node('Logger2');
            logger2.setJsonLogging(true);
            logger2.setStringLogging(true);
            logger2Instance1 = logger2.instance('Instance1');
        });
        beforeEach(() => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,Logger2:*');
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print logs not only in string', async () => {
            await (0, test_logs_1.printLogsInDifferentType)(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger1:Instance1","source"'
                + ':{"caller":"printLogsInDifferentType","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"24","column":"10"},"message":"this is  1 true {\\\\\\"key1\\\\\\":1,\\\\\\"value\\\\\\":2}"}');
        });
        it('should print logs only in string', async () => {
            await (0, test_logs_1.printLogsInDifferentType)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger2:Instance1","source"'
                + ':{"caller":"printLogsInDifferentType","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"24","column":"10"},"message":"this is  1 true {\\\\\\"key1\\\\\\":1,\\\\\\"value\\\\\\":2}"}');
        });
        it('should print logs only in string for fatal', async () => {
            await (0, test_logs_1.printFatalLogsInDifferentType)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
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
        let callbackSpy;
        let loggerInstance;
        before(() => {
            const logger = new logger4_node_1.Logger4Node('Logger');
            loggerInstance = logger.instance('Instance');
            logger.setJsonLogging(true);
        });
        beforeEach(() => {
            logger4_node_1.Logger4Node.setLogPattern('Logger:*');
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log object with string in proper json format', async () => {
            loggerInstance.error('this is string', { var: 1, var2: 2 });
            await (0, test_logs_1.wait)();
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
                + ':{"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}`
                + '","line":"447","column":"22"},"message":"this is string {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
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
            await (0, test_logs_1.printLogWithMultipleEndCharacters)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
                + ':{"caller":"printLogWithMultipleEndCharacters","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"34","column":"10"},"message":"this is line1\\\\nline2\\\\nline2 {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
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
            await (0, test_logs_1.printLogWithBackSlashCharacter)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
                + ':{"caller":"printLogWithBackSlashCharacter","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"39","column":"10"},"message":"this is line1 \\\\\\\\\\\\\\" {\\\\\\"var\\\\\\":1,\\\\\\"var2\\\\\\":2}"}');
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
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
            await (0, test_logs_1.printLogWithSpecialTabCharacter)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
                + ':{"caller":"printLogWithSpecialTabCharacter","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"44","column":"10"},"message":"this is line1 \\\\t"}');
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
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
            await (0, test_logs_1.printLogWithNewLineAndSlashNCharacter)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(typeof JSON.parse(callbackSpy.getCall(0).args[0])).to.equal('object');
        });
        afterEach(() => {
            callbackSpy.restore();
            loggerSpy.reset();
        });
    });
    context('github link logging', () => {
        let callbackSpy;
        let loggerInstance;
        before(() => {
            const currentPathSplit = __dirname.split('/');
            const logger = new logger4_node_1.Logger4Node('Logger', {
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
            logger4_node_1.Logger4Node.setLogPattern('Logger:*');
            logger4_node_1.Logger4Node.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log github detail', async () => {
            await (0, test_logs_1.printLogSingleLine)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"level":"error","time":0,"pid":1,"hostname":"hostname","className":"Logger:Instance","source"'
                + ':{"caller":"printLogSingleLine","fileName":"test-logs.ts","path":"'
                + `${currentFolder}`
                + '","line":"49","column":"10","github":"https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224'
                + '/spec/test-logs.ts#L49"},"message":"this is string"}');
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
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
//# sourceMappingURL=test-json.spec.js.map