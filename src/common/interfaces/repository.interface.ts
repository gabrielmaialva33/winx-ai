import { BaseModel } from '@/common/models/base.model'

export interface RepositoryInterface<M extends BaseModel> {
  /**
   * @description Get all entities by search.
   * @param {ModelAttributes<Model>} search
   * @returns {Promise<Model[]>}
   * @memberof RepositoryInterface
   * @example
   * const users = await this.userRepository.listBy({ name: 'John Doe' })
   */
  listBy(search: ModelAttributes<M>): Promise<M[]>

  /**
   * @description Get by key value.
   * @param {ModelAttributes<Model>} search
   * @returns {Promise<Model | null>}
   * @memberof RepositoryInterface
   * @example
   * const user = await this.userRepository.getBy({ name: 'John Doe' })
   */
  getBy(search: ModelAttributes<M>): Promise<M | null>

  /**
   * @description Create a new M.
   * @param {ModelAttributes<Model>} payload
   * @returns {Promise<Model>}
   * @memberof RepositoryInterface
   * @example
   * const user = await this.userRepository.create({ name: 'John Doe' })
   */
  create(payload: ModelAttributes<M>): Promise<M>

  /**
   * @description Create a new M or update an existing one.
   * @param {ModelAttributes<Model>} search
   * @param {ModelAttributes<Model>} payload
   * @returns {Promise<Model>}
   * @memberof RepositoryInterface
   * @example
   * const user = await this.userRepository.createOrUpdate({ name: 'John Doe' }, { name: 'John Doe' })
   */
  findOrCreate(search: Partial<ModelAttributes<M>>, payload: ModelAttributes<M>): Promise<M>

  /**
   * @description Create a new M or update an existing one.
   * @param {ModelAttributes<Model>} payload
   * @returns {Promise<Model>}
   * @memberof RepositoryInterface
   * @example
   * const user = await this.userRepository.upsert({ name: 'John Doe' })
   */
  upsert(payload: ModelAttributes<M>): Promise<M>
}

export type ModelAttributes<M extends BaseModel> = { [P in keyof M]?: M[P] }
