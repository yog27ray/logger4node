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
describe('Logger4nodeAnonymous', () => {
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
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger.setLogSeverityPattern(logSeverity));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should log object with string in proper json format', async () => {
            loggerInstance.error('this is string', { var: 1, var2: 2 });
            await (0, test_logs_1.wait)();
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            const logs = (0, test_logs_1.stringLogsToJSON)(callbackSpy);
            (0, chai_1.expect)(logs).to.deep.equal([{
                    level: 'error',
                    time: 0,
                    extra: {},
                    stack: '',
                    className: 'Logger:Instance',
                    source: {
                        caller: 'Context.<anonymous>',
                        fileName: 'test-json-annonomous.spec.ts',
                        path: currentFolder,
                        line: '29',
                        column: '22',
                    },
                    message: 'this is string {"var":1,"var2":2}',
                }]);
        });
        afterEach(() => {
            callbackSpy.restore();
            test_logs_1.loggerSpy.reset();
        });
    });
});
//# sourceMappingURL=test-json-annonomous.spec.js.map