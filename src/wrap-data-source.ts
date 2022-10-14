import { Repository, DataSource, EntityManager, EntityTarget } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import { StoreTransaction } from './store'

export const wrapDataSource = (dataSource: DataSource, context: AsyncLocalStorage<StoreTransaction | undefined>) => {
  const repositories = (dataSource.manager as any).repositories as any[]
  const getRepositoryOriginal = dataSource.getRepository
  const replaceManager = (target: { manager: EntityManager }) => {
    let originalManager = target.manager

    Object.defineProperty(target, 'manager', {
      get() {
        return context.getStore()?.manager || originalManager
      },
      set(manager: EntityManager) {
        originalManager = manager
      },
    })
  }

  replaceManager(dataSource)
  repositories.forEach(replaceManager)

  dataSource.getRepository = <Entity>(target: EntityTarget<Entity>) => {
    const repository = getRepositoryOriginal.call(dataSource, target) as Repository<Entity>

    replaceManager(repository)

    return repository
  }
}