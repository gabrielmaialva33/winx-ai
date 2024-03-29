import { Composer, InputFile } from 'grammy'
import { code, fmt } from '@grammyjs/parse-mode'
import { StringUtils } from '@/helpers/string.utils'
import { IA } from '@/bot/plugins/gpt.plugin'

import { MyContext } from '@/bot/core/context'
import { Logger } from '@/helpers/logger.utils'

const composer = new Composer<MyContext>()

composer.command('imagine', async (ctx) => {
  try {
    const text = StringUtils.RemoveIncludes(ctx.message!.text, [
      '/imagine',
      '/imagine@winx_ia_bot',
      'imagine',
      '@winx_ia_bot',
      'winx_ia_bot',
      '/imagine@winx_ia_bot',
    ])
    if (!text) return
    if (!['group', 'supergroup'].includes(ctx.chat.type)) return

    const response = await IA.imagine(StringUtils.RemoveBreakLines(text))

    await ctx.api.sendChatAction(ctx.chat?.id, 'upload_photo')

    if (!response.data.length)
      return ctx.reply('no image found', { reply_to_message_id: ctx.message?.message_id })

    return ctx.replyWithPhoto(new InputFile({ url: response.data[0].url! }), {
      reply_to_message_id: ctx.message?.message_id,
      caption: text,
    })
  } catch (_) {
    return ctx.reply('Desculpa! 🥺 Não posso imaginar isso.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

composer.command('variation', async (ctx) => {
  if (!ctx.message?.reply_to_message?.photo) return
  if (!['group', 'supergroup'].includes(ctx.chat.type)) return

  try {
    const file_id = ctx.message?.reply_to_message?.photo?.pop()?.file_id
    if (!file_id) return

    // get file path from file id
    const file = await ctx.api.getFile(file_id)
    if (!file) return

    const file_path = await file.download()
    const response = await IA.variation(file_path)

    await ctx.api.sendChatAction(ctx.chat?.id, 'upload_photo')

    if (!response.data[0].url)
      return ctx.reply('no image found', { reply_to_message_id: ctx.message?.message_id })

    return ctx.replyWithPhoto(new InputFile({ url: response.data[0].url }), {
      reply_to_message_id: ctx.message?.message_id,
    })
  } catch (e) {
    return ctx.reply('Desculpa! 🥺 Não posso imaginar isso.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

export default composer
