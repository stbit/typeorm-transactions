import { AsyncLocalStorage } from "node:async_hooks";
import { DataSource, EntityManager } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import type { Store } from "./typings/store";
import { wrapDataSource } from "./wrap-data-source";

export interface TransactionalOptions {
  isolationLevel?: IsolationLevel
}

export const factoryTransactionDecorator = (dataSource: DataSource) => {
  const context = new AsyncLocalStorage<Store | undefined>()

  wrapDataSource(dataSource, context)

  return function Transactional(options: TransactionalOptions = {}): MethodDecorator {
    const isolationLevel = options.isolationLevel ?? 'READ COMMITTED'

    return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
        if (context.getStore()) {
          return await originalMethod.apply(this, args)
        }

        const store = new Map<string, EntityManager>()

        return await context.run(store, () => {
          return dataSource.transaction(isolationLevel , async (manager) => {
            store.set('manager', manager)

            return await originalMethod.apply(this, args)
          })
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