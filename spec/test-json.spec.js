"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = require("../src/logger");
const logger4_node_1 = require("../src/logger4-node");
const currentFolder = __dirname;
function printLogsInDifferentLevel(logger) {
    logger.verbose('verbose log');
    logger.debug('debug log');
    logger.info('info log');
    logger.warn('warn log');
    logger.error('error log');
}
function printLogsInDifferentType(logger) {
    logger.error('this is ', 1, true, { key1: 1, value: 2 });
}
function printFatalLogsInDifferentType(logger) {
    logger.fatal('this is ', 1, true, { key1: 1, value: 2 });
}
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
            logger4_node_1.Logger4Node.setLogLevel("verbose" /* LogSeverity.VERBOSE */);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print all logs', () => {
            printLogsInDifferentLevel(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"",'
                + ' "source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
        });
        it('should not print logger2 logs', () => {
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(0);
        });
        it('should allow print logger2 logs', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,Logger2:*');
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"verbose","message":"verbose log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"debug","message":"debug log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"info","message":"info log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"error","message":"error log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
        });
        it('should print only Logger1 Debug  and above logs', () => {
            logger4_node_1.Logger4Node.setLogLevel("warn" /* LogSeverity.WARN */);
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(2);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source": '
                + '{"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
        });
        it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', () => {
            logger4_node_1.Logger4Node.setLogLevel("warn" /* LogSeverity.WARN */);
            logger4_node_1.Logger4Node.setLogSeverityPattern("warn" /* LogSeverity.WARN */, 'Logger2:*');
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(3);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"warn","message":"warn log","stack":"", "source":'
                + ' {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
        });
        it('should print both instance of Logger1', () => {
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(10);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' '))
                .to.equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(5).args.join(' ')).to
                .equal('{"className":"Logger1:Instance2","level":"verbose","message":"verbose log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(6).args.join(' ')).to
                .equal('{"className":"Logger1:Instance2","level":"debug","message":"debug log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(7).args.join(' ')).to
                .equal('{"className":"Logger1:Instance2","level":"info","message":"info log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(8).args.join(' ')).to
                .equal('{"className":"Logger1:Instance2","level":"warn","message":"warn log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(9).args.join(' ')).to
                .equal('{"className":"Logger1:Instance2","level":"error","message":"error log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
        });
        it('should print only instance1 of Logger1', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"verbose","message":"verbose log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"10","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"debug","message":"debug log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"11","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"info","message":"info log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"12","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"warn","message":"warn log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"13","column":"10"}}`);
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"error log","stack":"", '
                + '"source": {"caller":"printLogsInDifferentLevel","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"14","column":"10"}}`);
        });
        it('should print session information', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            logger4_node_1.Logger4Node.Trace.requestHandler(() => ({ key1: 'value1', key2: 'value2' }))({}, {}, () => {
                printLogsInDifferentLevel(logger1Instance1);
                logger1Instance1.log("error" /* LogSeverity.ERROR */, { extraField: 'extraValue' }, 'verbose log');
            });
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(6);
            const calls = new Array(6)
                .fill(0)
                .map((zero, index) => callbackSpy.getCall(index).args.join(' '))
                .map((each) => JSON.parse(each));
            calls.forEach((each_) => {
                const each = each_;
                (0, chai_1.expect)(each.session.sessionId).to.exist;
                delete each.session.sessionId;
            });
            (0, chai_1.expect)(calls).to.deep.equal([{
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
                        column: '10',
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
                        line: '222',
                        column: '28',
                    },
                }]);
        });
        afterEach(() => {
            callbackSpy.restore();
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
            logger4_node_1.Logger4Node.setLogLevel("verbose" /* LogSeverity.VERBOSE */);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print logs not only in string', () => {
            printLogsInDifferentType(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger1:Instance1","level":"error","message":"this is  1 true '
                + '{\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printLogsInDifferentType",'
                + `"fileName":"test-json.spec.ts","path":"${currentFolder}","line":"18","column":"10"}}`);
        });
        it('should print logs only in string', () => {
            printLogsInDifferentType(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"error","message":"this is  1 true '
                + '{\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printLogsInDifferentType",'
                + `"fileName":"test-json.spec.ts","path":"${currentFolder}","line":"18","column":"10"}}`);
        });
        it('should print logs only in string for fatal', () => {
            printFatalLogsInDifferentType(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('{"className":"Logger2:Instance1","level":"fatal","message":"this is  1 true '
                + '{\\"key1\\":1,\\"value\\":2}","stack":"", "source": {"caller":"printFatalLogsInDifferentType",'
                + `"fileName":"test-json.spec.ts","path":"${currentFolder}","line":"22","column":"10"}}`);
        });
        afterEach(() => {
            callbackSpy.restore();
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
            logger4_node_1.Logger4Node.setLogLevel("verbose" /* LogSeverity.VERBOSE */);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log object with string in proper json format', () => {
            loggerInstance.error('this is string', { var: 1, var2: 2 });
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"className":"Logger:Instance","level":"error","message":"this is string '
                + '{\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>",'
                + `"fileName":"test-json.spec.ts","path":"${currentFolder}","line":"394","column":"22"}}`);
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
                className: 'Logger:Instance',
                level: 'error',
                message: 'this is string {"var":1,"var2":2}',
                stack: '',
                source: {
                    caller: 'Context.<anonymous>',
                    fileName: 'test-json.spec.ts',
                    path: currentFolder,
                    line: '394',
                    column: '22',
                },
            });
        });
        it('should log multi line string in one line', () => {
            loggerInstance.error('this is line1\nline2\nline2', { var: 1, var2: 2 });
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"className":"Logger:Instance","level":"error","message":"this is line1\\nline2\\nline2'
                + ' {\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>",'
                + `"fileName":"test-json.spec.ts","path":"${currentFolder}","line":"416","column":"22"}}`);
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
                className: 'Logger:Instance',
                level: 'error',
                message: 'this is line1\nline2\nline2 {"var":1,"var2":2}',
                stack: '',
                source: {
                    caller: 'Context.<anonymous>',
                    fileName: 'test-json.spec.ts',
                    path: currentFolder,
                    line: '416',
                    column: '22',
                },
            });
        });
        it('should log properly when message contains \\"', () => {
            loggerInstance.error('this is line1 \\"', { var: 1, var2: 2 });
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"className":"Logger:Instance","level":"error","message":"this is line1 \\\\\\" '
                + '{\\"var\\":1,\\"var2\\":2}","stack":"", "source": {"caller":"Context.<anonymous>",'
                + '"fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"438","column":"22"}}`);
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
                className: 'Logger:Instance',
                level: 'error',
                message: 'this is line1 \\" {"var":1,"var2":2}',
                stack: '',
                source: {
                    caller: 'Context.<anonymous>',
                    fileName: 'test-json.spec.ts',
                    path: currentFolder,
                    line: '438',
                    column: '22',
                },
            });
        });
        it('should log properly when message contains \t', () => {
            loggerInstance.error('this is line1 \t');
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args[0]).to
                .equal('{"className":"Logger:Instance","level":"error","message":"this is line1 \\t","stack":"",'
                + ' "source": {"caller":"Context.<anonymous>","fileName":"test-json.spec.ts","path":"'
                + `${currentFolder}","line":"461","column":"22"}}`);
            (0, chai_1.expect)(JSON.parse(callbackSpy.getCall(0).args[0])).to.deep.equal({
                className: 'Logger:Instance',
                level: 'error',
                message: 'this is line1 \t',
                stack: '',
                source: {
                    caller: 'Context.<anonymous>',
                    fileName: 'test-json.spec.ts',
                    path: currentFolder,
                    line: '461',
                    column: '22',
                },
            });
        });
        it('should log properly when message contains string as well as json"', () => {
            try {
                throw new class TestError extends Error {
                    constructor() {
                        super();
                        this.message = 'Received an error with invalid JSON from Parse: <html>\r\n<head><title>'
                            + '503 Service Temporarily Unavailable</title></head>\r\n<body>\r\n<center><h1>503 Service'
                            + ' Temporarily Unavailable</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>';
                    }
                }();
            }
            catch (error) {
                loggerInstance.error(error);
            }
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(typeof JSON.parse(callbackSpy.getCall(0).args[0])).to.equal('object');
        });
        afterEach(() => {
            callbackSpy.restore();
        });
    });
});
//# sourceMappingURL=test-json.spec.js.map