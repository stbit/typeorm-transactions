import { Repository, DataSource, EntityManager, EntityTarget } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { Store } from './typings/store'

export const wrapDataSource = (dataSource: DataSource, context: AsyncLocalStorage<Store>) => {
  const repositories = (dataSource.manager as any).repositories as any[]
  const getRepositoryOriginal = dataSource.getRepository
  const hookRepositoryManager = <T>(repository: Repository<T>): void => {
    let originalManager = repository.manager

    Object.defineProperty(repository, 'manager', {
      get() {
        return context.getStore()?.get('manager') || originalManager
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