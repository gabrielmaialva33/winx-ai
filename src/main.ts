import { Winx } from '@/bot/core/bot'
import { UserBot } from '@/bot/core/user.bot'
import { Logger } from '@/helpers/logger.utils'
import { Knex } from '@/lib/objection'

const User = new UserBot()

Knex.migrate.latest().then(() => Logger.info('database migrated', 'knex.migrate'))
Winx.start().then(() => Logger.info('bot started', 'start.bot'))
User.start()
  .then(() => Logger.info('user bot started', 'start.user'))
  .finally(async () =>
    User.getHistory().finally(() => Logger.info('history saved', 'history.user'))
  )

export { User }
