import { Composer, Context } from 'grammy'

import start from '@/bot/commands/start.command'

const composer = new Composer<Context>()

composer.use(start)

export default composer
