import { Composer, InputFile } from 'grammy'
import { StringUtils } from '@/helpers/string.utils'

import { IA } from '@/bot/plugins/gpt.plugin'
import { MyContext } from '@/bot/core/context'
import { Logger } from '@/logger'

const composer = new Composer<MyContext>()

composer.command('imagine', async (ctx) => {
  try {
    const text = ctx.message?.text
      ?.replace('/imagine', '')
      .replace('/imagine@winx_ia_bot', '')
      .trim()
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

    return ctx.replyWithPhoto(new InputFile({ url: response.data.data[0].url }), {
      reply_to_message_id: ctx.message?.message_id,
    })
  } catch (_) {
    return ctx.reply('Desculpa! 🥺 Não vai rolar.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

composer.command('variation', async (ctx) => {
  // only reply to photo
  if (!ctx.message?.reply_to_message?.photo) return

  try {
    const file_id = ctx.message?.reply_to_message?.photo?.pop()?.file_id
    if (!file_id) return

    // get file path from file id
    const file = await ctx.api.getFile(file_id)
    if (!file) return

    const file_path = await file.download()
    const response = await IA.variation(file_path)

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
  } catch (e) {
    Logger.error(e, 'VARIATION')
    return ctx.reply('Desculpa! 🥺 Não vai rolar.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

export default composer
