import Env from '@/config/env'
import { MiddlewareFn } from 'grammy'

import { Logger } from '@/helpers/logger.utils'

export const group: MiddlewareFn = async (ctx, next) => {
  const groups = Env.GROUP_ID.split(',').map((id: string) => id.trim())
  if (!ctx.chat) return

  if (ctx.chat.type === 'supergroup')
    if (!groups.includes(ctx.chat.id.toString())) {
      Logger.info(`Leaving chat ${ctx.chat.id}`, 'GROUP')

      const member = await ctx
        .getChatMember(ctx.me.id)
        .catch(() => Logger.error(`Bot is not member of the chat`, 'GROUP'))
      if (member)
        await ctx
          .reply(
            'Desculpa, mas eu só falo no grupo Club das Winx! 🥺 🌸 Fale com o @mrootx para me adicionar em outro grupo.'
          )
          .then(() =>
            ctx.leaveChat().catch(() => Logger.error(`Bot is not member of the chat`, 'GROUP'))
          )
      else
        await ctx
          .reply(
            'Desculpa, mas eu só falo no grupo Club das Winx! 🥺 🌸 Fale com o @mrootx para me adicionar em outro grupo.'
          )
          .catch(() => Logger.error(`Bot is not member of the chat`, 'GROUP'))
    }

  return next()
}
