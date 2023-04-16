import knex from 'knex'
import { Model } from 'objection'

import { DatabaseConfig } from '@/config/database.config'

const Knex = knex(DatabaseConfig)

Model.knex(Knex)

export { Knex }
