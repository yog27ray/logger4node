"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger4Node = void 0;
const logger_1 = require("./logger");
class Logger4Node {
    constructor(applicationName) {
        this._applicationName = applicationName;
    }
    instance(name) {
        return new logger_1.Logger(`${this._applicationName}:${name}`);
    }
}
exports.Logger4Node = Logger4Node;
//# sourceMappingURL=logger4-node.js.map