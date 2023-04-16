import { Logger } from '@/helpers/logger.utils'

import { BaseModel } from '@/common/models/base.model'
import { ModelAttributes, RepositoryInterface } from '@/common/interfaces/repository.interface'

export class BaseRepository<M extends BaseModel> implements RepositoryInterface<M> {
  constructor(protected readonly model: typeof BaseModel) {}

  listBy(search: ModelAttributes<M>): Promise<M[]> {
    try {
      return this.model.transaction<M[]>(async (trx) => {
        return this.model.query(trx).where(search) as unknown as Promise<M[]>
      })
    } catch (error) {
      Logger.error(error, 'BaseRepository')
      throw error
    }
  }

  getBy(search: ModelAttributes<M>): Promise<M | null> {
    try {
      return this.model.transaction<M | null>(async (trx) => {
        return this.model.query(trx).findOne(search) as unknown as Promise<M | null>
      })
    } catch (error) {
      Logger.error(error, 'BaseRepository')
      throw error
    }
  }

  create(payload: ModelAttributes<M>): Promise<M> {
    try {
      return this.model.transaction<M>(async (trx) => {
        return this.model.query(trx).insert(payload) as unknown as Promise<M>
      })
    } catch (error) {
      Logger.error(error, 'BaseRepository')
      throw error
    }
  }

  createOrUpdate(search: Partial<ModelAttributes<M>>, payload: ModelAttributes<M>): Promise<M> {
    try {
      return this.model.transaction<M>(async (trx) => {
        const model = await this.model.query(trx).findOne(search)
        if (model)
          return this.model
            .query(trx)
            .patchAndFetchById(model.$id(), payload) as unknown as Promise<M>
        return this.model.query(trx).insert(payload) as unknown as Promise<M>
      })
    } catch (error) {
      Logger.error(error, 'BaseRepository')
      throw error
    }
  }
}
