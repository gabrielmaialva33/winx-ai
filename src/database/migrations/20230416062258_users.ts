import { Knex } from 'knex'
import { UserModel } from '@/common/models/user.model'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(UserModel.tableName, (table) => {
    table.increments('id').primary()

    table.bigint('telegram_id').notNullable().unique()
    table.string('first_name', 40).notNullable()
    table.string('username', 50).unique()

    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(UserModel.tableName)
}
