import * as process from 'process'

import { Composer, Context, InputFile } from 'grammy'

import { ContextUtils } from '@/helpers/context.utils'
import { Logger } from '@/helpers/logger.utils'
import { HistoryUtils } from '@/helpers/history.utils'

const composer = new Composer<Context>()

composer.command('reset', async (ctx) => {
  if (!ctx.chat?.id) return ctx.reply('❌ Erro ao iniciar o bot!')
  if (ctx.chat.type === 'supergroup') return

  HistoryUtils.reset_history()

  Logger.debug(`Bot has been reset by: ${ContextUtils.get_username(ctx)}`, 'RESET')
})

export default composer
