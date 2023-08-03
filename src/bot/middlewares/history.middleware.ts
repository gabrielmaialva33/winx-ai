import { MiddlewareFn } from 'grammy'
import { Logger } from '@/helpers/logger.utils'

import { StringUtils } from '@/helpers/string.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import Env from '@/config/env'

export const history: MiddlewareFn = async (ctx, next) => {
  if (!ctx.chat || !ctx.message) return next()

  const permitted = Env.GROUP_ID.split(',').map((id: string) => id.trim())

  try {
    if (
      ctx.message.from?.id === 5635583594 ||
      ctx.message.reply_to_message?.from?.id === 5635583594 ||
      ctx.message.from.is_bot ||
      ctx.message.reply_to_message?.from?.is_bot ||
      !ctx.message.from?.first_name ||
      StringUtils.TextInclude(ctx.message!.text!, ['winx', '/']) ||
      (!permitted.includes(ctx.chat.id.toString()) && ctx.chat.type === 'private')
    ) {
      Logger.debug('ignoring message', 'history.middleware')
      return next()
    }

    const context = ContextUtils.get_context(ctx)
    const history = HistoryUtils.build_chat_history(context)

    Logger.debug(`saving message to history ${JSON.stringify(history)}`, 'history.middleware')

    HistoryUtils.write_history(history)

    return next()
  } catch (error) {
    Logger.error(error, 'history.middleware')
  }
}
