import { MiddlewareFn } from 'grammy'
import { Logger } from '@/helpers/logger.utils'

import { ContextUtils } from '@/helpers/context.utils'
import { StringUtils } from '@/helpers/string.utils'
import { GptUtils } from '@/helpers/gpt.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { IA } from '@/bot/plugins/gpt.plugin'

export const gpt: MiddlewareFn = async (ctx, next) => {
  try {
    if (!ctx.chat || !ctx.message || !ctx.message.text) return next()

    const text = ContextUtils.get_text(ctx)
    if (!text) return next()

    const { username, reply_to_username, reply_to_text } = ContextUtils.get_context(ctx)

    // if text contains winx and not contains /imagine or /variation
    if (
      StringUtils.TextInclude(text, ['winx']) &&
      !StringUtils.TextInclude(text, ['/imagine', '/variation', '/'])
    ) {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (response.data.choices.length === 0) return next()

      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text
      if (!random_choice) return next()

      const history = HistoryUtils.build_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      return ctx.reply(random_choice + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    // if bot is mentioned
    if (ctx.message.reply_to_message?.from?.id === ctx.me.id) {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (response.data.choices.length === 0) return next()

      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text
      if (!random_choice) return next()

      const history = HistoryUtils.build_reply_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      return ctx.reply(random_choice + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    // random reply
    // if (Math.random() < 0.009 && !StringUtils.TextInclude(text, ['/imagine', '/variation', '/'])) {
    //   const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

    //   Logger.info(input, 'random.gpt.middleware')
    //   await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

    //   const response = await IA.complete(input, username)
    //   if (response.data.choices.length === 0) return next()

    //   const choices = response.data.choices
    //   const random = Math.floor(Math.random() * choices.length)
    //   const random_choice = choices[random].text
    //   if (!random_choice) return next()

    //   const history = HistoryUtils.build_gpt_history(input, random_choice, username)
    //   HistoryUtils.write_history(history)

    //   return ctx.reply(random_choice + '\n', { reply_to_message_id: ctx.message.message_id })
    // }

    // if user send message on direct to bot
    if (ctx.chat.type === 'private') {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      Logger.info(input, 'private.gpt.middleware')
      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (response.data.choices.length === 0) return next()

      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text
      if (!random_choice) return next()

      const history = HistoryUtils.build_reply_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      return ctx.reply(random_choice + '\n', { reply_to_message_id: ctx.message.message_id })
    }

    return next()
  } catch (error) {
    Logger.error(error, 'gpt.middleware')
  }
}
