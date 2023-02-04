import { Bot as BotGrammy } from 'grammy'
import { parseMode } from '@grammyjs/parse-mode'

import { Logger } from '@/logger'

import Commands from '@/bot/commands'

import { gpt } from '@/bot/middlewares/gpt.middleware'
import { history } from '@/bot/middlewares/history.middleware'
import { group } from '@/bot/middlewares/group.middleware'

export class Bot extends BotGrammy {
  constructor(token: string) {
    super(token, {
      client: { canUseWebhookReply: () => false },
    })
    this.api.config.use(parseMode('HTML'))

    this.use(Commands)
    this.on('message', group)
    this.on('message:text', history, gpt)

    this.catch((err) => Logger.error(err.message, 'BOT'))
  }

  public async start() {
    await super.start({
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
      onStart: async () => Logger.info('Bot is running!', 'BOT'),
    })

    await super.api.setMyCommands([{ command: 'start', description: 'Iniciar o bot' }])
  }
}
