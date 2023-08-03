import * as process from 'process'

import { Composer, Context, InputFile } from 'grammy'

import { StartMarkup } from '@/bot/markups/start.markup'
import { ContextUtils } from '@/helpers/context.utils'
import { Logger } from '@/helpers/logger.utils'

const composer = new Composer<Context>()

composer.use(StartMarkup)

composer.command('start', async (ctx) => {
  if (!ctx.chat?.id) return ctx.reply('❌ erro ao iniciar o bot!')
  if (ctx.chat.type === 'supergroup') return

  Logger.debug(`bot has been started by: ${ContextUtils.get_username(ctx)}`, 'start.command')

  await ctx.api.sendChatAction(ctx.chat.id, 'typing', {
    message_thread_id: ctx.message?.message_id,
  })

  const file = new InputFile(process.cwd() + '/src/assets/winx.gif')
  return ctx.replyWithAnimation(file, {
    caption:
      'Olá! Sou a <b>Winx</b> 🧚‍♀️ e estou aqui para te ajudar a encontrar o que você precisa! 🤗\n',
    reply_markup: StartMarkup,
    parse_mode: 'HTML',
  })
})

export default composer
