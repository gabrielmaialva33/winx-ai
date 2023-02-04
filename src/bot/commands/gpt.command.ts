import { Composer, InputFile } from 'grammy'
import { StringUtils } from '@/helpers/string.utils'

import { IA } from '@/bot/plugins/gpt.plugin'

const composer = new Composer()

composer.command('imagine', async (ctx) => {
  try {
    const text = ctx.message?.text?.replace('/imagine', '').trim()
    if (!text) return

    const response = await IA.imagine(StringUtils.remove_breaklines(text))

    if (response.status !== 200)
      return ctx.reply('Cannot gererate image', {
        reply_to_message_id: ctx.message?.message_id,
      })

    await ctx.api.sendChatAction(ctx.chat?.id, 'upload_photo')

    if (!response.data.data[0].url)
      return ctx.reply('No image found', {
        reply_to_message_id: ctx.message?.message_id,
      })

    return ctx.replyWithPhoto(
      new InputFile({
        url: response.data.data[0].url,
      }),
      {
        reply_to_message_id: ctx.message?.message_id,
      }
    )
  } catch (_) {
    return ctx.reply('Desculpa! 🥺 Não vai rolar.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

export default composer
