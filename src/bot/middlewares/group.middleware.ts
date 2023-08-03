import Env from '@/config/env'
import { MiddlewareFn } from 'grammy'
import { Logger } from '@/helpers/logger.utils'

export const group: MiddlewareFn = async (ctx, next) => {
  const groups = Env.GROUP_ID.split(',').map((id: string) => id.trim())
  if (!ctx.chat || ctx.chat.type !== 'supergroup') return next()

  const groupId = ctx.chat.id.toString()
  if (!groups.includes(groupId)) {
    try {
      const member = await ctx.getChatMember(ctx.me.id)
      if (member) {
        await ctx.reply(
          'Desculpa, mas eu só falo no grupo Club das Winx! 🥺 🌸 Fale com o @mrootx para me adicionar em outro grupo.'
        )
        await ctx.leaveChat()
        Logger.info(`Bot left chat ${groupId}`, 'group.middleware')
      } else {
        Logger.error(`Bot is not a member of the chat ${groupId}`, 'group.middleware')
      }
    } catch (error) {
      Logger.error(`Error while processing the chat ${groupId}: ${error}`, 'group.middleware')
    }
  }

  return next()
}
