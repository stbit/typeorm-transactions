"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTransactionComplete = exports.emitTransactionRollback = exports.emitTransactionCommit = exports.runOnTransactionComplete = exports.runOnTransactionRollback = exports.runOnTransactionCommit = exports.addStoreToHooks = void 0;
const stores = [];
const addStoreToHooks = (store) => {
    stores.push(store);
};
exports.addStoreToHooks = addStoreToHooks;
const runOnTransactionCommit = (callback) => {
    stores.forEach((store) => { var _a; return (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onCommit.push(callback); });
};
exports.runOnTransactionCommit = runOnTransactionCommit;
const runOnTransactionRollback = (callback) => {
    stores.forEach((store) => { var _a; return (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onRollback.push(callback); });
};
exports.runOnTransactionRollback = runOnTransactionRollback;
const runOnTransactionComplete = (callback) => {
    stores.forEach((store) => { var _a; return (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onComplete.push(callback); });
};
exports.runOnTransactionComplete = runOnTransactionComplete;
const emitTransactionCommit = () => {
    stores.forEach((store) => {
        var _a;
        (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onCommit.forEach((callback) => { callback(); });
    });
};
exports.emitTransactionCommit = emitTransactionCommit;
const emitTransactionRollback = () => {
    stores.forEach((store) => {
        var _a;
        (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onRollback.forEach((callback) => { callback(); });
    });
};
exports.emitTransactionRollback = emitTransactionRollback;
const emitTransactionComplete = () => {
    stores.forEach((store) => {
        var _a;
        (_a = store.getStore()) === null || _a === void 0 ? void 0 : _a.onComplete.forEach((callback) => { callback(); });
    });
};
exports.emitTransactionComplete = emitTransactionComplete;
//# sourceMappingURL=hooks.js.map