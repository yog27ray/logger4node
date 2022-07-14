"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = require("./logger");
const logger4_node_1 = require("./logger4-node");
function printLogs(logger) {
    logger.verbose('Verbose log');
    logger.info('Info log');
    logger.warn('Warn log');
    logger.debug('Debug log');
    logger.error('Error log');
}
describe('Logger4node', () => {
    context('logging in different scenario', () => {
        let callbackSpy;
        let logger1;
        let logger1Instance1;
        let logger1Instance2;
        let logger2;
        let logger2Instance1;
        before(() => {
            logger1 = new logger4_node_1.Logger4Node('Logger1');
            logger1Instance1 = logger1.instance('Instance1');
            logger1Instance2 = logger1.instance('Instance2');
            logger2 = new logger4_node_1.Logger4Node('Logger2');
            logger2Instance1 = logger2.instance('Instance1');
        });
        beforeEach(() => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*');
            logger4_node_1.Logger4Node.setLogLevel("verbose" /* LogSeverity.VERBOSE */);
            Object.keys(logger_1.LogLevel).forEach((logSeverity) => logger4_node_1.Logger4Node.setLogSeverityPattern(logSeverity, undefined));
            callbackSpy = sinon_1.default.spy(console, 'log');
        });
        it('should print all logs', () => {
            printLogs(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
        });
        it('should not print logger2 logs', () => {
            printLogs(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(0);
        });
        it('should allow print logger2 logs', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,Logger2:*');
            printLogs(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger2:Instance1\x1B[37mVerbose log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger2:Instance1\x1B[35mInfo log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger2:Instance1\x1B[33mWarn log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger2:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger2:Instance1\x1B[31mError log\x1B[0m');
        });
        it('should print only Logger1 debug and above logs', () => {
            logger4_node_1.Logger4Node.setLogLevel("debug" /* LogSeverity.DEBUG */);
            printLogs(logger1Instance1);
            printLogs(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(2);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
        });
        it('should print only Logger1 debug and above logs and logger2 only debug', () => {
            logger4_node_1.Logger4Node.setLogLevel("debug" /* LogSeverity.DEBUG */);
            logger4_node_1.Logger4Node.setLogSeverityPattern("debug" /* LogSeverity.DEBUG */, 'Logger2:*');
            printLogs(logger1Instance1);
            printLogs(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(3);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger2:Instance1\x1B[34mDebug log\x1B[0m');
        });
        it('should print both instance of Logger1', () => {
            printLogs(logger1Instance1);
            printLogs(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(10);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(5).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance2\x1B[37mVerbose log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(6).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance2\x1B[35mInfo log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(7).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance2\x1B[33mWarn log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(8).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance2\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(9).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance2\x1B[31mError log\x1B[0m');
        });
        it('should print only instance1 of Logger1', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            printLogs(logger1Instance1);
            printLogs(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join('')).to.equal('\x1B[33mverbose\x1B[36mLogger1:Instance1\x1B[37mVerbose log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join('')).to.equal('\x1B[33minfo\x1B[36mLogger1:Instance1\x1B[35mInfo log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join('')).to.equal('\x1B[33mwarn\x1B[36mLogger1:Instance1\x1B[33mWarn log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join('')).to.equal('\x1B[33mdebug\x1B[36mLogger1:Instance1\x1B[34mDebug log\x1B[0m');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join('')).to.equal('\x1B[33merror\x1B[36mLogger1:Instance1\x1B[31mError log\x1B[0m');
        });
        afterEach(() => {
            callbackSpy.restore();
        });
    });
});
//# sourceMappingURL=test.spec.js.map