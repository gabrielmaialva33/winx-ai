import { Model, ModelOptions, QueryContext } from 'objection'

/**
 * Base model class.
 * @class BaseModel
 * @extends {Model}
 * @see https://vincit.github.io/objection.js/api/model/static-properties.html#static-model
 * @description This class is used to extend the Objection.js Model class.
 */
export class BaseModel extends Model {
  static idColumn = 'id'
  static useLimitInFirst = true
  static modelPaths = [__dirname]

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  readonly id!: number
  created_at!: string
  updated_at!: string

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  async $beforeInsert(query: QueryContext) {
    super.$beforeInsert(query)
  }

  async $beforeUpdate(opt: ModelOptions, query: QueryContext) {
    super.$beforeUpdate(opt, query)
  }

  async $afterInsert(query: QueryContext) {
    super.$afterInsert(query)
  }

  async $afterUpdate(opt: ModelOptions, query: QueryContext) {
    super.$afterUpdate(opt, query)
  }

  /**
   * ------------------------------------------------------
   * Serializer
   * ------------------------------------------------------
   */
  $formatJson(json: any) {
    json = super.$formatJson(json)
    return json
  }
}
