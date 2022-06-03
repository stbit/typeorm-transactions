import { AsyncLocalStorage } from "node:async_hooks";
import { DataSource, EntityManager } from "typeorm";
import type { Store } from "./typings/store";
import { wrapDataSource } from "./wrap-data-source";

export const factoryTransactionDecorator = (dataSource: DataSource) => {
  const context = new AsyncLocalStorage<Store | undefined>()

  wrapDataSource(dataSource, context)

  return function Transactional(): MethodDecorator {
    return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
        if (context.getStore()) {
          return await originalMethod.apply(this, args)
        }

        const store = new Map<string, EntityManager>()

        return await context.run(store, () => {
          return dataSource.transaction(async (manager) => {
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