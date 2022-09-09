"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreTransaction = void 0;
class StoreTransaction {
    constructor() {
        this.onCommit = [];
        this.onRollback = [];
        this.onComplete = [];
    }
}
exports.StoreTransaction = StoreTransaction;
//# sourceMappingURL=store.js.map