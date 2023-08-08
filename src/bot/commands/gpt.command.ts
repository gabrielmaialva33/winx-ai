import { Composer, InputFile } from 'grammy'
import { fmt, italic, code } from '@grammyjs/parse-mode'
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
    if (response.status !== 200)
      return ctx.reply('cannot generate image', { reply_to_message_id: ctx.message?.message_id })

    await ctx.api.sendChatAction(ctx.chat?.id, 'upload_photo')

    if (!response.data.data[0].url)
      return ctx.reply('no image found', { reply_to_message_id: ctx.message?.message_id })

    return ctx.replyWithPhoto(new InputFile({ url: response.data.data[0].url }), {
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

    if (response.status !== 200)
      return ctx.reply('cannot generate image', { reply_to_message_id: ctx.message?.message_id })

    await ctx.api.sendChatAction(ctx.chat?.id, 'upload_photo')

    if (!response.data.data[0].url)
      return ctx.reply('no image found', { reply_to_message_id: ctx.message?.message_id })

    return ctx.replyWithPhoto(new InputFile({ url: response.data.data[0].url }), {
      reply_to_message_id: ctx.message?.message_id,
    })
  } catch (e) {
    return ctx.reply('Desculpa! 🥺 Não posso imaginar isso.', {
      reply_to_message_id: ctx.message?.message_id,
    })
  }
})

composer.command('gpt', async (ctx) => {
  const text = StringUtils.RemoveIncludes(ctx.message!.text, [
    '/gpt',
    '/gpt@winx_ia_bot',
    'gpt',
    '@winx_ia_bot',
    'winx_ia_bot',
    '/gpt@winx_ia_bot',
  ])
  if (!text) return
  if (!['group', 'supergroup'].includes(ctx.chat.type)) return

  await ctx.api.sendChatAction(ctx.chat?.id, 'typing')

  const response = await IA.gpt3(StringUtils.RemoveBreakLines(text))
  if (response.status !== 200)
    return ctx.reply('cannot generate text', { reply_to_message_id: ctx.message?.message_id })

  if (!response.data.choices[0].message || !response.data.choices[0].message.content)
    return ctx.reply('no text found', { reply_to_message_id: ctx.message?.message_id })

  if (response.data.choices[0].message.content.includes('```')) {
    Logger.info('sending code', 'gpt.command')

    const beforeContent = response.data.choices[0].message.content.split('```')[0]
    const codeContent = response.data.choices[0].message.content.split('```')[1]
    const afterContent = response.data.choices[0].message.content.split('```')[2]

    return ctx.replyFmt(fmt`${beforeContent}${code(codeContent)}${afterContent}`, {
      reply_to_message_id: ctx.message?.message_id,
    })
  } else
    return ctx.reply(response.data.choices[0].message.content, {
      reply_to_message_id: ctx.message?.message_id,
    })
})

export default composer
