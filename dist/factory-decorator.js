"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factoryTransactionDecorator = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const wrap_data_source_1 = require("./wrap-data-source");
const factoryTransactionDecorator = (dataSource) => {
    const context = new node_async_hooks_1.AsyncLocalStorage();
    (0, wrap_data_source_1.wrapDataSource)(dataSource, context);
    return function Transactional() {
        return (target, methodName, descriptor) => {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                const store = new Map();
                return context.run(store, () => {
                    return dataSource.transaction(async (manager) => {
                        store.set('manager', manager);
                        return await originalMethod.apply(this, args);
                    });
                });
            };
            Reflect.getMetadataKeys(originalMethod).forEach(previousMetadataKey => {
                const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod);
                Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value);
            });
            Object.defineProperty(descriptor.value, 'name', { value: originalMethod.name, writable: false });
        };
    };
};
exports.factoryTransactionDecorator = factoryTransactionDecorator;
//# sourceMappingURL=factory-decorator.js.map