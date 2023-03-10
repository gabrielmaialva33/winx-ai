import { MiddlewareFn } from 'grammy'
import { Logger } from '@/logger'

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
      StringUtils.text_includes(text, ['winx']) &&
      !StringUtils.text_includes(text, ['/imagine', '/variation', '/'])
    ) {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (!response.data.choices[0].text) return next()

      const output = response.data.choices[0].text
      const history = HistoryUtils.build_gpt_history(input, output, username)
      HistoryUtils.write_history(history)

      //random choices for reply
      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text

      return ctx.reply(random_choice + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    // if bot is mentioned
    if (ctx.message.reply_to_message?.from?.id === ctx.me.id) {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (!response.data.choices[0].text) return next()

      const output = response.data.choices[0].text
      const history = HistoryUtils.build_reply_gpt_history(input, output, username)
      HistoryUtils.write_history(history)

      //random choices for reply
      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text

      return ctx.reply(random_choice + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    // random reply
    if (Math.random() < 0.05 && !StringUtils.text_includes(text, ['/imagine', '/variation', '/'])) {
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      Logger.info(input, 'MIDDLEWARE/GPT/RANDOM')
      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')

      const response = await IA.complete(input, username)
      if (!response.data.choices[0].text) return next()

      const output = response.data.choices[0].text
      const history = HistoryUtils.build_reply_gpt_history(input, output, username)
      HistoryUtils.write_history(history)

      //random choices for reply
      const choices = response.data.choices
      const random = Math.floor(Math.random() * choices.length)
      const random_choice = choices[random].text

      return ctx.reply(random_choice + '\n', { reply_to_message_id: ctx.message.message_id })
    }

    return next()
  } catch (error) {
    Logger.error(error, 'MIDDLEWARE/GPT')
  }
}
