import { Context } from 'grammy'

import { ContextArgs, ContextUtils } from '@/helpers/context.utils'

export const GptUtils = {
  build_input: ({ text, username }: ContextArgs) => {
    return `${username}(Winx):||${text}||\n`
  },

  build_input_from_context: (ctx: Context) => {
    const username = ContextUtils.get_username(ctx)
    if (!username) return

    const text = ContextUtils.get_text(ctx)
    if (!text) return

    const reply_to_username = ContextUtils.get_reply_to_username(ctx)
    const reply_to_text = ContextUtils.get_reply_to_text(ctx)

    return GptUtils.build_input({ text, username, reply_to_username, reply_to_text })
  },
}
