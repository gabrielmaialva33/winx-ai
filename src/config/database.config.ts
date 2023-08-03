import { Knex } from 'knex'
import * as process from 'process'

import { LogKnex } from '@/helpers/logger.utils'
import { Env } from '@/config/env'

export const DatabaseConfig: Knex.Config<Knex.Sqlite3ConnectionConfig> = {
  client: 'better-sqlite3',
  connection: { filename: `${process.cwd()}/src/database/database.sqlite` },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: `${process.cwd()}/src/database/migrations`,
  },
  seeds: { directory: `${process.cwd()}/src/database/seeds` },
  log: { ...LogKnex },
  debug: Env.DB_DEBUG,
}
