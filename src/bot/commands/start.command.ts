import { Composer, Context, InputFile } from 'grammy'

import { StartMarkup } from '@/bot/markups/start.markup'
import * as process from 'process'
import { ContextUtils } from '@/helpers/context.utils'
import { Logger } from '@/logger'

const composer = new Composer<Context>()

composer.use(StartMarkup)

composer.command('start', async (ctx) => {
  if (!ctx.chat?.id) return ctx.reply('❌ Erro ao iniciar o bot!')

  Logger.debug(`Bot has been started by: ${ContextUtils.get_username(ctx)}`, 'START')

  await ctx.api.sendChatAction(ctx.chat.id, 'typing')

  const file = new InputFile(process.cwd() + '/src/assets/winx.gif')
  return ctx.replyWithAnimation(file, {
    caption:
      'Olá! Sou a <b>Winx</b> 🧚‍♀️ e estou aqui para te ajudar a encontrar o que você precisa! 🤗\n',
    reply_markup: StartMarkup,
    parse_mode: 'HTML',
  })
})

export default composer
