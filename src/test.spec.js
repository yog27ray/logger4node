"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = require("./logger");
const logger4_node_1 = require("./logger4-node");
function printLogsInDifferentLevel(logger) {
    logger.verbose('Verbose log');
    logger.info('Info log');
    logger.warn('Warn log');
    logger.debug('Debug log');
    logger.error('Error log');
}
function printLogsInDifferentType(logger) {
    logger.error('this is ', 1, true, { key1: 1, value: 2 });
}
describe('Logger4node', () => {
    context('logging in different level', () => {
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
            printLogsInDifferentLevel(logger1Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Verbose Logger1:Instance1 Verbose log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Info Logger1:Instance1 Info log');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to.equal('Warn Logger1:Instance1 Warn log');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to.equal('Debug Logger1:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to.equal('Error Logger1:Instance1 Error log');
        });
        it('should not print logger2 logs', () => {
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(0);
        });
        it('should allow print logger2 logs', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,Logger2:*');
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Verbose Logger2:Instance1 Verbose log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Info Logger2:Instance1 Info log');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to.equal('Warn Logger2:Instance1 Warn log');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to.equal('Debug Logger2:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to.equal('Error Logger2:Instance1 Error log');
        });
        it('should print only Logger1 Debug  and above logs', () => {
            logger4_node_1.Logger4Node.setLogLevel("debug" /* LogSeverity.DEBUG */);
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(2);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Debug Logger1:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Error Logger1:Instance1 Error log');
        });
        it('should print only Logger1 Debug  and above logs and logger2 only Debug ', () => {
            logger4_node_1.Logger4Node.setLogLevel("debug" /* LogSeverity.DEBUG */);
            logger4_node_1.Logger4Node.setLogSeverityPattern("debug" /* LogSeverity.DEBUG */, 'Logger2:*');
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(3);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Debug Logger1:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Error Logger1:Instance1 Error log');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to.equal('Debug Logger2:Instance1 Debug log');
        });
        it('should print both instance of Logger1', () => {
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(10);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Verbose Logger1:Instance1 Verbose log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Info Logger1:Instance1 Info log');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to.equal('Warn Logger1:Instance1 Warn log');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to.equal('Debug Logger1:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to.equal('Error Logger1:Instance1 Error log');
            (0, chai_1.expect)(callbackSpy.getCall(5).args.join(' ')).to.equal('Verbose Logger1:Instance2 Verbose log');
            (0, chai_1.expect)(callbackSpy.getCall(6).args.join(' ')).to.equal('Info Logger1:Instance2 Info log');
            (0, chai_1.expect)(callbackSpy.getCall(7).args.join(' ')).to.equal('Warn Logger1:Instance2 Warn log');
            (0, chai_1.expect)(callbackSpy.getCall(8).args.join(' ')).to.equal('Debug Logger1:Instance2 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(9).args.join(' ')).to.equal('Error Logger1:Instance2 Error log');
        });
        it('should print only instance1 of Logger1', () => {
            logger4_node_1.Logger4Node.setLogPattern('Logger1:*,-Logger1:Instance2*');
            printLogsInDifferentLevel(logger1Instance1);
            printLogsInDifferentLevel(logger1Instance2);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(5);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to.equal('Verbose Logger1:Instance1 Verbose log');
            (0, chai_1.expect)(callbackSpy.getCall(1).args.join(' ')).to.equal('Info Logger1:Instance1 Info log');
            (0, chai_1.expect)(callbackSpy.getCall(2).args.join(' ')).to.equal('Warn Logger1:Instance1 Warn log');
            (0, chai_1.expect)(callbackSpy.getCall(3).args.join(' ')).to.equal('Debug Logger1:Instance1 Debug log');
            (0, chai_1.expect)(callbackSpy.getCall(4).args.join(' ')).to.equal('Error Logger1:Instance1 Error log');
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
            logger1Instance1 = logger1.instance('Instance1');
            logger2 = new logger4_node_1.Logger4Node('Logger2');
            logger2.setOnlyStringLogging(true);
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
                .equal('Error Logger1:Instance1 this is  1 true { key1: 1, value: 2 }');
        });
        it('should print logs only in string', () => {
            printLogsInDifferentType(logger2Instance1);
            (0, chai_1.expect)(callbackSpy.callCount).to.equal(1);
            (0, chai_1.expect)(callbackSpy.getCall(0).args.join(' ')).to
                .equal('Error Logger2:Instance1 this is  1 true {"key1":1,"value":2}');
        });
        afterEach(() => {
            callbackSpy.restore();
        });
    });
});
//# sourceMappingURL=test.spec.js.map