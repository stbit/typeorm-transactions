import { Repository, DataSource, EntityManager, EntityTarget } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import { StoreTransaction } from './store'

export const wrapDataSource = (dataSource: DataSource, context: AsyncLocalStorage<StoreTransaction | undefined>) => {
  const repositories = (dataSource.manager as any).repositories as any[]
  const getRepositoryOriginal = dataSource.getRepository
  const hookRepositoryManager = <T>(repository: Repository<T>): void => {
    let originalManager = repository.manager

    Object.defineProperty(repository, 'manager', {
      get() {
        return context.getStore()?.manager || originalManager
      },
      set(manager: EntityManager) {
        originalManager = manager
      }
    })
  }

  repositories.forEach(hookRepositoryManager)

  dataSource.getRepository = <Entity>(target: EntityTarget<Entity>) => {
    const repository = getRepositoryOriginal.call(dataSource, target) as Repository<Entity>

    hookRepositoryManager(repository)

    return repository
  }
}