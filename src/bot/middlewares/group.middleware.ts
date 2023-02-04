import env from '@/env'
import { MiddlewareFn } from 'grammy'

import { Logger } from '@/logger'

export const group: MiddlewareFn = async (ctx, next) => {
  const groups = env.GROUP_ID.split(',').map((id: string) => id.trim())
  if (!ctx.chat) return

  if (ctx.chat.type === 'supergroup')
    if (!groups.includes(ctx.chat.id.toString())) {
      Logger.info(`Leaving chat ${ctx.chat.id}`, 'GROUP')

      const chatMember = await ctx
        .getChatMember(ctx.me.id)
        .catch(() => Logger.error(`Bot is not member of the chat`, 'GROUP'))
      if (chatMember && chatMember.status === 'member') {
        await ctx.reply('Desculpa, mas eu só falo no grupo Club das Winx! 🥺')
        await ctx.leaveChat()
      } else Logger.error(`Bot is not member of the chat ${ctx.chat.id}`, 'GROUP')
    }

  return next()
}
