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

    if (StringUtils.text_includes(text, ['winx'])) {
      const { username, reply_to_username, reply_to_text } = ContextUtils.get_context(ctx)
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')
      const response = await IA.complete(input, username)
      if (!response.data.choices[0].text) return next()

      const output = response.data.choices[0].text
      const history = HistoryUtils.build_gpt_history(input, output, username)
      HistoryUtils.write_history(history)

      return ctx.reply(response.data.choices[0].text + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    if (ctx.message.reply_to_message?.from?.id === ctx.me.id) {
      const { username, reply_to_username, reply_to_text } = ContextUtils.get_context(ctx)
      const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

      await ctx.api.sendChatAction(ctx.chat!.id, 'typing')
      const response = await IA.complete(input, username)
      if (!response.data.choices[0].text) return next()

      const output = response.data.choices[0].text
      const history = HistoryUtils.build_reply_gpt_history(input, output, username)
      HistoryUtils.write_history(history)

      return ctx.reply(response.data.choices[0].text + '\n', {
        reply_to_message_id: ctx.message.message_id,
      })
    }
  } catch (error) {
    Logger.error(error, 'MIDDLEWARE/GPT')
  }
}
