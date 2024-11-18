"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = require("../src/logger/logger");
const logger4_node_1 = require("../src/logger/logger4-node");
const test_logs_1 = require("./test-logs");
const currentFolder = __dirname;
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
            logger1.setLogPattern('Logger1:*');
            logger2.setLogPattern('Logger1:*');
            logger1.setLogLevel(logger_1.LogSeverity.VERBOSE);
            logger2.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger1.setLogSeverityPattern(logSeverity, undefined));
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger2.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print all logs', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
                        column: '10',
                    },
                    message: 'error log',
                },
            ]);
        });
        it('should not print logger2 logs', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(0);
        });
        it('should allow print logger2 logs', async () => {
            logger2.setLogPattern('Logger1:*,Logger2:*');
            logger2.setLogPattern('Logger1:*,Logger2:*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
                        column: '10',
                    },
                    message: 'error log',
                },
            ]);
        });
        it('should print only Logger1 Debug  and above logs', async () => {
            logger1.setLogLevel(logger_1.LogSeverity.WARN);
            logger2.setLogLevel(logger_1.LogSeverity.WARN);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '16',
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
                        line: '17',
                        column: '10',
                    },
                    message: 'error log',
                },
            ]);
        });
        it('should print only Logger1 Debug  and above logs and logger2 only Debug: ', async () => {
            logger1.setLogLevel(logger_1.LogSeverity.WARN);
            logger2.setLogLevel(logger_1.LogSeverity.WARN);
            logger1.setLogSeverityPattern(logger_1.LogSeverity.WARN, 'Logger2:*');
            logger2.setLogSeverityPattern(logger_1.LogSeverity.WARN, 'Logger2:*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger2Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '16',
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
                        line: '17',
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
                        line: '16',
                        column: '10',
                    },
                    message: 'warn log',
                },
            ]);
        });
        it('should print both instance of Logger1', async () => {
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance2);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
                        column: '10',
                    },
                    message: 'error log',
                },
            ]);
        });
        it('should print only instance1 of Logger1', async () => {
            logger1.setLogPattern('Logger1:*,-Logger1:Instance2*');
            logger2.setLogPattern('Logger1:*,-Logger1:Instance2*');
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
            await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance2);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
                        column: '10',
                    },
                    message: 'error log',
                },
            ]);
        });
        it('should print session information', async () => {
            logger1.setLogPattern('Logger1:*,-Logger1:Instance2*');
            logger2.setLogPattern('Logger1:*,-Logger1:Instance2*');
            logger4_node_1.Logger4Node.Trace.requestHandler(() => ({ key1: 'value1', key2: 'value2' }))({}, {}, async () => {
                await (0, test_logs_1.printLogsInDifferentLevel)(logger1Instance1);
                await (0, test_logs_1.printLogsWithExtraFields)(logger1Instance1);
            });
            await (0, test_logs_1.wait)(400);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(6);
            const calls = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            calls.forEach((each_) => {
                const each = each_;
                (0, chai_1.expect)(each.request.id).to.exist;
                delete each.request.id;
            });
            (0, chai_1.expect)(calls).to.deep.equal([{
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
                        line: '13',
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
                        line: '14',
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
                        line: '15',
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
                        line: '16',
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
                        line: '17',
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
                        line: '22',
                        column: '10',
                    },
                    message: 'verbose log',
                }]);
        });
        afterEach(() => {
            callbackSpy.restore();
            test_logs_1.loggerSpy.reset();
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
            logger1.setLogPattern('Logger1:*,Logger2:*');
            logger2.setLogPattern('Logger1:*,Logger2:*');
            logger1.setLogLevel(logger_1.LogSeverity.VERBOSE);
            logger2.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger1.setLogSeverityPattern(logSeverity, undefined));
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger2.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print logs not only in string', async () => {
            await (0, test_logs_1.printLogsInDifferentType)(logger1Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '27',
                        column: '10',
                    },
                    message: 'this is  1 true {"key1":1,"value":2}',
                },
            ]);
        });
        it('should print logs only in string', async () => {
            await (0, test_logs_1.printLogsInDifferentType)(logger2Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '27',
                        column: '10',
                    },
                    message: 'this is  1 true {"key1":1,"value":2}',
                },
            ]);
        });
        it('should print logs only in string for fatal', async () => {
            await (0, test_logs_1.printFatalLogsInDifferentType)(logger2Instance1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '32',
                        column: '10',
                    },
                    message: 'this is  1 true {"key1":1,"value":2}',
                },
            ]);
        });
        afterEach(() => {
            callbackSpy.restore();
            test_logs_1.loggerSpy.reset();
        });
    });
    context('logging string, object, array in one log', () => {
        let logger;
        let callbackSpy;
        let loggerInstance;
        before(() => {
            logger = new logger4_node_1.Logger4Node('Logger');
            loggerInstance = logger.instance('Instance');
            logger.setJsonLogging(true);
        });
        beforeEach(() => {
            logger.setLogPattern('Logger:*');
            logger.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log multi line string in one line', async () => {
            await (0, test_logs_1.printLogWithMultipleEndCharacters)(loggerInstance);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '37',
                        column: '10',
                    },
                    message: 'this is line1\nline2\nline2 {"var":1,"var2":2}',
                },
            ]);
        });
        it('should log properly when message contains \\"', async () => {
            await (0, test_logs_1.printLogWithBackSlashCharacter)(loggerInstance);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '42',
                        column: '10',
                    },
                    message: 'this is line1 \\" {"var":1,"var2":2}',
                },
            ]);
        });
        it('should log properly when message contains \t', async () => {
            await (0, test_logs_1.printLogWithSpecialTabCharacter)(loggerInstance);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '47',
                        column: '10',
                    },
                    message: 'this is line1 \t',
                },
            ]);
        });
        it('should log properly when message contains new line character with \n', async () => {
            await (0, test_logs_1.printLogWithNewLineAndSlashNCharacter)(loggerInstance);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(typeof JSON.parse(callbackSpy.getCall(0).args[0])).to.equal('object');
        });
        afterEach(() => {
            callbackSpy.restore();
            test_logs_1.loggerSpy.reset();
        });
    });
    context('github link logging', () => {
        let logger;
        let callbackSpy;
        let loggerInstance;
        before(() => {
            const currentPathSplit = __dirname.split('/');
            logger = new logger4_node_1.Logger4Node('Logger', {
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
            logger.setLogLevel(logger_1.LogSeverity.VERBOSE);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log github detail', async () => {
            await (0, test_logs_1.printLogSingleLine)(loggerInstance);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([
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
                        line: '52',
                        column: '10',
                        github: 'https://github.com/yog27ray/logger4node/blob/fd4a2de07ed9e31d890370e05fb4b8a416f27224/spec/test-logs.ts#L52',
                    },
                    message: 'this is string',
                },
            ]);
        });
        afterEach(() => {
            callbackSpy.restore();
            test_logs_1.loggerSpy.reset();
        });
    });
});
//# sourceMappingURL=test-json.spec.js.map