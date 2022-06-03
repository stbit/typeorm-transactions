import { DataSource } from 'typeorm';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { Store } from './typings/store';
export declare const wrapDataSource: (dataSource: DataSource, context: AsyncLocalStorage<Store>) => void;
