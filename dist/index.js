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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOnTransactionRollback = exports.runOnTransactionComplete = exports.runOnTransactionCommit = exports.isRunInTransaction = void 0;
__exportStar(require("./factory-decorator"), exports);
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "isRunInTransaction", { enumerable: true, get: function () { return hooks_1.isRunInTransaction; } });
Object.defineProperty(exports, "runOnTransactionCommit", { enumerable: true, get: function () { return hooks_1.runOnTransactionCommit; } });
Object.defineProperty(exports, "runOnTransactionComplete", { enumerable: true, get: function () { return hooks_1.runOnTransactionComplete; } });
Object.defineProperty(exports, "runOnTransactionRollback", { enumerable: true, get: function () { return hooks_1.runOnTransactionRollback; } });
//# sourceMappingURL=index.js.map