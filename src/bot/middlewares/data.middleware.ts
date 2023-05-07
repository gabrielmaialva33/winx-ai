import { MiddlewareFn } from 'grammy'
import { StringUtils } from '@/helpers/string.utils'
import * as fs from 'fs'
import { HistoryUtils } from '@/helpers/history.utils'

export const data: MiddlewareFn = async (ctx, next) => {
  if (!ctx.chat || !ctx.message) return next()

  const context = {
    chat: {
      id: ctx.chat.id,
      title:
        ctx.chat.type === 'private'
          ? StringUtils.NormalizeName(ctx.chat.first_name)
          : ctx.chat.title,
    },
    user: {
      id: ctx.message.from?.id,
      username: ctx.message.from?.username,
      name: StringUtils.NormalizeName(ctx.message.from?.first_name, ctx.message.from?.last_name),
    },
    message_id: ctx.message.message_id,
    text: ctx.message.text,
    reply_to: {
      message_id: ctx.message.reply_to_message?.message_id,
      user: {
        id: ctx.message.from?.id,
        username: ctx.message.from?.username,
        name: StringUtils.NormalizeName(ctx.message.from?.first_name, ctx.message.from?.last_name),
      },
      text: ctx.message.reply_to_message?.text,
    },
  }

  //console.log({ context, replay: context.reply_to.user })

  HistoryUtils.write_context(JSON.stringify(context, null, 2))

  return next()
}
