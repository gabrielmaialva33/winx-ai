import Env from '@/config/env'

import { Bot as BotGrammy } from 'grammy'
import { hydrateReply } from '@grammyjs/parse-mode'
import { hydrateFiles } from '@grammyjs/files'
import { hydrate } from '@grammyjs/hydrate'
import { Logger } from '@/helpers/logger.utils'

import { MyContext } from '@/bot/core/context'
import Commands from '@/bot/commands'
import { history } from '@/bot/middlewares/history.middleware'
import { group } from '@/bot/middlewares/group.middleware'
import { data } from '@/bot/middlewares/data.middleware'
import { gpt } from '@/bot/middlewares/gpt.middleware'

export class Bot extends BotGrammy<MyContext> {
  constructor() {
    super(Env.BOT_TOKEN, { client: { canUseWebhookReply: () => false } })
    this.api.config.use(hydrateFiles(Env.BOT_TOKEN))

    this.use(hydrate())
    this.use(hydrateReply)
    this.use(Commands)

    //this.on('message', group)
    this.on('message:text', history, gpt, data)

    this.catch((err) => Logger.error(err.message, 'bot.catch'))
  }

  async start() {
    await this.api.setMyCommands([
      { command: 'start', description: 'Start bot' },
      { command: 'imagine', description: 'Generate image' },
      { command: 'variation', description: 'Generate image variation' },
    ])

    await super.start({
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
      onStart: async () => Logger.info('bot is running!', 'bot.start'),
    })
  }
}

export const Winx = new Bot()
