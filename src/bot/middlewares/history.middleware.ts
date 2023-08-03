import { MiddlewareFn } from 'grammy'
import { Logger } from '@/helpers/logger.utils'
import { StringUtils } from '@/helpers/string.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import Env from '@/config/env'

const ALLOWED_CHAT_TYPES = ['group', 'supergroup']

const BOT_USER_ID = 5635583594 // Replace with an appropriate constant or descriptive identifier.

export const history: MiddlewareFn = async (ctx, next) => {
  if (!ctx.chat || !ctx.message || !ALLOWED_CHAT_TYPES.includes(ctx.chat.type)) return next()

  try {
    const { from, reply_to_message, text } = ctx.message
    const isBotMessage = from?.is_bot || (reply_to_message?.from?.is_bot ?? false)
    const isPrivateChat = ctx.chat.type === 'private'
    const isPermittedChat = Env.GROUP_ID.split(',')
      .map((id: string) => id.trim())
      .includes(ctx.chat.id.toString())

    if (
      from?.id === BOT_USER_ID ||
      isBotMessage ||
      !from?.first_name ||
      StringUtils.TextInclude(text!, ['winx', '/']) ||
      (!isPermittedChat && isPrivateChat)
    ) {
      Logger.debug('ignoring message', 'history.middleware')
      return next()
    }

    const context = ContextUtils.get_context(ctx)
    const history = HistoryUtils.build_chat_history(context)

    Logger.debug(`saving message to history: ${JSON.stringify(history)}`, 'history.middleware')
    HistoryUtils.write_history(history)

    return next()
  } catch (error) {
    Logger.error(error, 'history.middleware')
  }
}
