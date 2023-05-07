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
      Logger.error(error, 'base.repository')
      throw error
    }
  }

  getBy(search: ModelAttributes<M>): Promise<M | null> {
    try {
      return this.model.transaction<M | null>(async (trx) => {
        return this.model.query(trx).findOne(search) as unknown as Promise<M | null>
      })
    } catch (error) {
      Logger.error(error, 'base.repository')
      throw error
    }
  }

  create(payload: ModelAttributes<M>): Promise<M> {
    console.log('payload', payload)
    try {
      return this.model.transaction(async (trx) => {
        return this.model.query(trx).insert(payload) as unknown as Promise<M>
      }) as unknown as Promise<M>
    } catch (error) {
      Logger.error(error, 'base.repository')
      throw error
    }
  }

  findOrCreate(search: Partial<ModelAttributes<M>>, payload: ModelAttributes<M>): Promise<M> {
    try {
      return this.model.transaction(async (trx) => {
        const model = await this.model.query().where(search).first()
        if (!model) return this.model.query(trx).insert(payload) as unknown as Promise<M>

        return model as unknown as Promise<M>
      })
    } catch (error) {
      Logger.error(error, 'base.repository')
      throw error
    }
  }

  upsert(payload: ModelAttributes<M>): Promise<M> {
    try {
      // @ts-ignore
      return this.model.transaction<M>(async (trx) => {
        const model = await this.model.query(trx).findOne(payload)
        if (model) return model
        return this.model.query(trx).insert(payload) as unknown as Promise<M>
      })
    } catch (error) {
      Logger.error(error, 'base.repository')
      throw error
    }
  }
}
