"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trace = void 0;
const async_hooks_1 = require("async_hooks");
const uuid_1 = require("uuid");
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
class Trace {
    static requestHandler(callback) {
        return (req, res, next) => {
            Trace.startNewRequest(next, (callback ? callback(req) : undefined));
        };
    }
    static startNewRequest(callback, track = {}) {
        asyncLocalStorage.run({ ...track, id: (0, uuid_1.v4)() }, () => callback());
    }
    static getRequestInfo() {
        return asyncLocalStorage.getStore();
    }
}
exports.Trace = Trace;
//# sourceMappingURL=trace.js.map