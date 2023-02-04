import { MiddlewareFn } from 'grammy'
import { Logger } from '@/logger'

import { StringUtils } from '@/helpers/string.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { HistoryUtils } from '@/helpers/history.utils'

export const history: MiddlewareFn = async (ctx, next) => {
  if (!ctx.chat || !ctx.message) return next()

  try {
    if (
      ctx.message.from?.id === 5937441755 ||
      ctx.message.reply_to_message?.from?.id === 5937441755 ||
      ctx.message.from.is_bot ||
      ctx.message.reply_to_message?.from?.is_bot ||
      !ctx.message.from?.first_name ||
      StringUtils.text_includes(ctx.message!.text!, ['winx', '/'])
    ) {
      Logger.debug('Ignoring message', 'MIDDLEWARE/HISTORY')
      return next()
    }

    const context = ContextUtils.get_context(ctx)
    const history = HistoryUtils.build_chat_history(context)

    Logger.debug(`Saving message to history ${JSON.stringify(history)}`, 'MIDDLEWARE/HISTORY')

    HistoryUtils.write_history(history)

    return next()
  } catch (error) {
    Logger.error(error, 'HISTORY')
  }
}
