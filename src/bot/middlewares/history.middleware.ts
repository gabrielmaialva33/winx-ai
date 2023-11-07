import { MiddlewareFn } from 'grammy'
import { Logger } from '@/helpers/logger.utils'
import { StringUtils } from '@/helpers/string.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import Env from '@/config/env'
import { User } from 'grammy/types'

const ALLOWED_CHAT_TYPES = ['group', 'supergroup']
const BOT_USER_ID = Env.BOT_USER_ID // Assumindo que BOT_USER_ID foi movido para o arquivo de configuração de ambiente.

const isAllowedChatType = (chatType: string) => ALLOWED_CHAT_TYPES.includes(chatType)
const isBot = (user: User | undefined) => user?.is_bot
const isUserMessageAllowed = (from: User, text: string | undefined) => {
  return (
    from?.id !== BOT_USER_ID &&
    !isBot(from) &&
    from?.first_name &&
    text &&
    !StringUtils.TextInclude(text, ['winx', '/'])
  )
}

const isChatPermitted = (chatId: string) =>
  Env.GROUP_ID.split(',')
    .map((id) => id.trim())
    .includes(chatId)

export const history: MiddlewareFn = async (ctx, next) => {
  if (!ctx.chat || !ctx.message || !isAllowedChatType(ctx.chat.type)) {
    return next()
  }

  const { from, reply_to_message, text, chat } = ctx.message
  const isReplyFromBot = isBot(reply_to_message?.from)
  const isPrivateChat = chat.type === 'private'
  const isPermittedChat = isChatPermitted(chat.id.toString())

  if (isUserMessageAllowed(from, text) && !isReplyFromBot && (isPermittedChat || !isPrivateChat)) {
    try {
      const context = ContextUtils.get_context(ctx)
      const history = HistoryUtils.build_chat_history(context)

      Logger.debug(`saving message to history: ${JSON.stringify(history)}`, 'history.middleware')
      HistoryUtils.write_history(history)
    } catch (error) {
      Logger.error(error, 'history.middleware')
    }
  } else {
    Logger.debug('ignoring message', 'history.middleware')
  }

  return next()
}
