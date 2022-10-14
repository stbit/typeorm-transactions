"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapDataSource = void 0;
const wrapDataSource = (dataSource, context) => {
    const repositories = dataSource.manager.repositories;
    const getRepositoryOriginal = dataSource.getRepository;
    const replaceManager = (target) => {
        let originalManager = target.manager;
        Object.defineProperty(target, 'manager', {
            get() {
                var _a;
                return ((_a = context.getStore()) === null || _a === void 0 ? void 0 : _a.manager) || originalManager;
            },
            set(manager) {
                originalManager = manager;
            },
        });
    };
    replaceManager(dataSource);
    repositories.forEach(replaceManager);
    dataSource.getRepository = (target) => {
        const repository = getRepositoryOriginal.call(dataSource, target);
        replaceManager(repository);
        return repository;
    };
};
exports.wrapDataSource = wrapDataSource;
//# sourceMappingURL=wrap-data-source.js.map