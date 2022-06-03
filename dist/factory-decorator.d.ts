import { DataSource } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
interface TransactionalOptions {
    isolationLevel?: IsolationLevel;
}
export declare const factoryTransactionDecorator: (dataSource: DataSource) => (options?: TransactionalOptions) => MethodDecorator;
export {};
