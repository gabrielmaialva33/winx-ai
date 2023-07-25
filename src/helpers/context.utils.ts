import { Context } from 'grammy'

import { StringUtils } from '@/helpers/string.utils'

export const ContextUtils = {
  get_username: (ctx: Context) => {
    if (!ctx.message) return

    const from = ctx.message.from
    if (!from) return 'null'

    return StringUtils.NormalizeName(from.first_name, from.last_name)
  },

  get_name: (ctx: Context) => {
    if (!ctx.message) return

    const from = ctx.message.from
    if (!from) return 'null'

    return StringUtils.NormalizeName(from.first_name, from.last_name)
  },

  get_reply_to_username: (ctx: Context) => {
    if (!ctx.message) return

    const reply_to = ctx.message?.reply_to_message
    if (!reply_to) return

    const reply_to_user = reply_to.from
    if (!reply_to_user) return

    return StringUtils.NormalizeName(reply_to_user.first_name, reply_to_user.last_name)
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
    const username = ContextUtils.get_name(ctx)!
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

  GetUser: (ctx: Context) => {
    const null_user$ = { telegram_id: 0, username: 'null', first_name: 'null', last_name: 'null' }
    if (!ctx.message) return null_user$

    const from = ctx.message.from
    if (!from) return null_user$

    return {
      telegram_id: from.id,
      username: from.username ? from.username : 'no_username',
      first_name: StringUtils.NormalizeName(from.first_name),
      last_name: from.last_name ? StringUtils.NormalizeName(from.last_name) : undefined,
    }
  },

  GetReplyToUser: (ctx: Context) => {
    const null_user$ = { telegram_id: 0, username: 'null', first_name: 'null', last_name: 'null' }
    if (!ctx.message) return null_user$

    const reply_to = ctx.message?.reply_to_message
    if (!reply_to) return null_user$

    const reply_to_user = reply_to.from
    if (!reply_to_user) return null_user$

    return {
      telegram_id: reply_to_user.id,
      username: reply_to_user.username ? reply_to_user.username : 'no_username',
      first_name: StringUtils.NormalizeName(reply_to_user.first_name),
      last_name: reply_to_user.last_name
        ? StringUtils.NormalizeName(reply_to_user.last_name)
        : undefined,
    }
  },

  GetChat: (ctx: Context) => {
    if (!ctx.chat) return

    const chat = ctx.chat
    if (!chat) return

    return {
      telegram_id: chat.id,
      username: 'username' in chat ? chat.username : undefined,
      title: 'title' in chat ? chat.title : undefined,
      type: chat.type,
    }
  },

  GetMessage: (ctx: Context) => {
    if (!ctx.message) return

    const message = ctx.message
    if (!message) return

    return {
      telegram_id: message.message_id,
      text: message.text,
      reply_to_message: message.reply_to_message,
    }
  },

  GetReplyToMessage: (ctx: Context) => {
    if (!ctx.message) return

    const message = ctx.message
    if (!message) return

    const reply_to_message = message.reply_to_message
    if (!reply_to_message) return

    return {
      telegram_id: reply_to_message.message_id,
      text: reply_to_message.text,
    }
  },
}

export interface ContextArgs {
  username: string
  reply_to_username?: string
  text: string
  reply_to_text?: string
}
