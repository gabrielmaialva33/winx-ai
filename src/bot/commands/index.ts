import { Composer, Context } from 'grammy'

import start from '@/bot/commands/start.command'
import gpt from '@/bot/commands/gpt.command'

const composer = new Composer<Context>()

composer.use(start)
composer.use(gpt)

export default composer
