import { Composer } from 'grammy'

import { MyContext } from '@/bot/core/context'

import start from '@/bot/commands/start.command'
import gpt from '@/bot/commands/gpt.command'

const composer = new Composer<MyContext>()

composer.use(start)
composer.use(gpt)

export default composer
