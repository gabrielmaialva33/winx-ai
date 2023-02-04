import { Winx } from '@/bot/core/bot'
import { UserBot } from '@/bot/core/user.bot'
import { Logger } from '@/logger'

const User = new UserBot()

Winx.start().then(() => Logger.info('Bot started', 'BOOT'))
User.start()
  .then(() => Logger.info('UserBot started', 'BOOT'))
  .finally(async () => User.getHistory().finally(() => Logger.info('History saved', 'BOOT')))

export { User }
