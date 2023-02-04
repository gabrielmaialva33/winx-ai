import env from '@/env'

import { Bot } from '@/bot/core/bot'
import { UserBot } from '@/bot/core/user.bot'
import { Logger } from '@/logger'

const Winx = new Bot(env.BOT_TOKEN)
const User = new UserBot()

Winx.start().then(() => Logger.info('Bot started', 'BOOT'))
User.start()
  .then(() => Logger.info('UserBot started', 'BOOT'))
  .finally(async () => User.getHistory().finally(() => Logger.info('History saved', 'BOOT')))

export { Winx, User }
