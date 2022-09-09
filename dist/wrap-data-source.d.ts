import { DataSource } from 'typeorm';
import { AsyncLocalStorage } from 'node:async_hooks';
import { StoreTransaction } from './store';
export declare const wrapDataSource: (dataSource: DataSource, context: AsyncLocalStorage<StoreTransaction | undefined>) => void;
