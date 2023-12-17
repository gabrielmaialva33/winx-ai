import { Composer } from 'grammy'

import { MyContext } from '@/bot/core/context'

import start from '@/bot/commands/start.command'
import gpt from '@/bot/commands/gpt.command'
import reset from '@/bot/commands/reset.command'

const composer = new Composer<MyContext>()

composer.use(start)
//composer.use(gpt)
composer.use(reset)

export default composer
