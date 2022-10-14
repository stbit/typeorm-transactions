import { AsyncLocalStorage } from "node:async_hooks";
import { DataSource, EntityManager } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { addStoreToHooks, emitTransactionCommit, emitTransactionComplete, emitTransactionRollback } from "./hooks";
import { StoreTransaction } from "./store";
import { wrapDataSource } from "./wrap-data-source";

export interface TransactionalOptions {
  isolationLevel?: IsolationLevel
}

export const factoryTransactionDecorator = (dataSource: DataSource) => {
  const context = new AsyncLocalStorage<StoreTransaction | undefined>()

  wrapDataSource(dataSource, context)
  addStoreToHooks(context)

  return function Transactional(options: TransactionalOptions = {}): MethodDecorator {
    const isolationLevel = options.isolationLevel ?? 'READ COMMITTED'

    return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
        if (context.getStore()) {
          return await originalMethod.apply(this, args)
        }

        const store = new StoreTransaction()

        return await context.run(store, async () => {
          try {
            const resultTransaction = await dataSource.transaction(isolationLevel , async (manager) => {
              store.manager = manager

              return await originalMethod.apply(this, args)
            })

            emitTransactionCommit()
            emitTransactionComplete()

            return resultTransaction
          } catch (e) {
            emitTransactionRollback()
            emitTransactionComplete()

            throw e
          }
        })
      }

      Reflect.getMetadataKeys(originalMethod).forEach(previousMetadataKey => {
        const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod)
        Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value)
      })

      Object.defineProperty(descriptor.value, 'name', { value: originalMethod.name, writable: false })
    }
  }
}