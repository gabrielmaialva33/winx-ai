import { Context } from 'grammy'

import { StringUtils } from '@/helpers/string.utils'

export const ContextUtils = {
  get_username: (ctx: Context) => {
    if (!ctx.message) return

    const from = ctx.message.from
    if (!from) return

    return StringUtils.NormalizeUsername(from.first_name, from.last_name)
  },

  get_reply_to_username: (ctx: Context) => {
    if (!ctx.message) return

    const reply_to = ctx.message?.reply_to_message
    if (!reply_to) return

    const reply_to_user = reply_to.from
    if (!reply_to_user) return

    return StringUtils.NormalizeUsername(reply_to_user.first_name, reply_to_user.last_name)
  },

  get_text: (ctx: Context) => {
    const text = ctx.message?.text
    if (!text) return

    return StringUtils.NormalizeText(text)
  },

  get_reply_to_text: (ctx: Context) => {
    const replyTo = ctx.message?.reply_to_message
    if (!replyTo) return

    const replyToText = replyTo.text
    if (!replyToText) return

    return StringUtils.NormalizeText(replyToText)
  },

  get_context: (ctx: Context): ContextArgs => {
    const username = ContextUtils.get_username(ctx)!
    const text = ContextUtils.get_text(ctx)!

    const reply_to_username = ContextUtils.get_reply_to_username(ctx)
    const reply_to_text = ContextUtils.get_reply_to_text(ctx)

    return {
      username,
      reply_to_username,
      text,
      reply_to_text,
    }
  },
}

export interface ContextArgs {
  username: string
  reply_to_username?: string
  text: string
  reply_to_text?: string
}
