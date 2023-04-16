import Env from '@/config/env'

import { Bot as BotGrammy } from 'grammy'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import { hydrateFiles } from '@grammyjs/files'
import { hydrate } from '@grammyjs/hydrate'
import { Logger } from '@/helpers/logger.utils'

import { MyContext } from '@/bot/core/context'
import Commands from '@/bot/commands'

import { gpt } from '@/bot/middlewares/gpt.middleware'
import { history } from '@/bot/middlewares/history.middleware'
import { group } from '@/bot/middlewares/group.middleware'

export class Bot extends BotGrammy<MyContext> {
  constructor() {
    super(Env.BOT_TOKEN, {
      client: { canUseWebhookReply: () => false },
    })
    this.api.config.use(parseMode('HTML'))
    this.api.config.use(hydrateFiles(Env.BOT_TOKEN))

    this.use(hydrateReply)
    this.use(hydrate())
    this.use(Commands)

    this.on('message', group)
    this.on('message:text', history, gpt)

    this.catch((err) => Logger.error(err.message, 'BOT'))
  }

  async start() {
    await this.api.setMyCommands([
      { command: 'imagine', description: 'Gerar imagem com texto' },
      { command: 'variation', description: 'Gerar variação de imagem' },
    ])

    await super.start({
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
      onStart: async () => Logger.info('Bot is running!', 'BOT'),
    })
  }
}

export const Winx = new Bot()
