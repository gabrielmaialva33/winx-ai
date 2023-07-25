import { Composer, Context } from 'grammy'

import { ContextUtils } from '@/helpers/context.utils'
import { Logger } from '@/helpers/logger.utils'
import { HistoryUtils } from '@/helpers/history.utils'

const composer = new Composer<Context>()

composer.command('reset', async (ctx) => {
  if (!ctx.chat?.id) return ctx.reply('❌ Erro ao iniciar o bot!')
  if (ctx.chat.type === 'supergroup') return

  HistoryUtils.reset_history()

  Logger.debug(`bot has been reset by: ${ContextUtils.get_username(ctx)}`, 'reset.command')

  return ctx.reply('✅ Bot resetado com sucesso!', { reply_to_message_id: ctx.message?.message_id })
})

export default composer
