import { MiddlewareFn } from 'grammy'
import { fmt, italic } from '@grammyjs/parse-mode'

import { MyContext } from '@/bot/core/context'

import { Logger } from '@/helpers/logger.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { IA } from '@/bot/plugins/gpt.plugin'
import { GptUtils } from '@/helpers/gpt.utils'
import LlamaPlugin from '@/bot/plugins/llama.plugin'

const response = async (ctx: MyContext, input: any, username: string) => {
  if (!ctx.chat || !ctx.message || !ctx.message.text) return null

  await ctx.api.sendChatAction(ctx.chat.id, 'typing')

  //const response = await IA.complete(input, username)
  const response = await LlamaPlugin.generate(input, username)
  return response
  //console.log(response)
  // // @ts-ignore
  // if (response['choices'].length === 0) return null
  //
  // // @ts-ignore
  // const choices = response['choices']
  // const random = Math.floor(Math.random() * choices.length)
  // return choices[random].text
}

export const gpt: MiddlewareFn<MyContext> = async (ctx, next) => {
  try {
    if (!ctx.chat || !ctx.message || !ctx.message.text) return next()

    const text = ContextUtils.get_text(ctx)
    if (!text) return next()

    const { username, reply_to_username, reply_to_text } = ContextUtils.get_context(ctx)

    const input = GptUtils.build_input({ text, username, reply_to_username, reply_to_text })

    if (StringUtils.TextInclude(text, ['winx']) && !StringUtils.TextInclude(text, ['/'])) {
      Logger.debug(`winx detected: ${ContextUtils.get_username(ctx)}`, 'gpt.middleware')

      const random_choice = await response(ctx, input, username)
      if (!random_choice) return next()

      const history = HistoryUtils.build_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      // reply in italic to the message that was replied to
      return ctx.replyFmt(fmt`${italic(random_choice)}`, {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    if (ctx.message.reply_to_message?.from?.id === ctx.me.id) {
      Logger.debug(`bot replied: ${ContextUtils.get_username(ctx)}`, 'gpt.middleware')

      const random_choice = await response(ctx, input, username)
      if (!random_choice) return next()

      const history = HistoryUtils.build_reply_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      return ctx.replyFmt(fmt`${italic(random_choice)}`, {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    if (Math.random() < 0.009 && !StringUtils.TextInclude(text, ['/'])) {
      Logger.debug(`random: ${ContextUtils.get_username(ctx)}`, 'gpt.middleware')

      const random_choice = await response(ctx, input, username)
      if (!random_choice) return next()

      const history = HistoryUtils.build_gpt_history(input, random_choice, username)
      HistoryUtils.write_history(history)

      return ctx.replyFmt(fmt`${italic(random_choice)}`, {
        reply_to_message_id: ctx.message.message_id,
      })
    }

    if (ctx.chat.type === 'private' && !StringUtils.TextInclude(text, ['/'])) {
      Logger.info(`private: ${ContextUtils.get_username(ctx)}`, 'gpt.middleware')

      return ctx.reply('🤖', { reply_to_message_id: ctx.message.message_id })
    }
  } catch (error) {
    Logger.error(error, 'gpt.middleware')
  }
}
