import { Context } from 'grammy'
import { ContextArgs, ContextUtils } from '@/helpers/context.utils'

export const GptUtils = {
  build_input: ({ text, username }: ContextArgs) => `${username}(Winx):||${text}||\n`,

  build_input_from_context: (ctx: Context) => {
    const username = ContextUtils.get_username(ctx)
    const text = ContextUtils.get_text(ctx)
    const reply_to_username = ContextUtils.get_reply_to_username(ctx)
    const reply_to_text = ContextUtils.get_reply_to_text(ctx)

    if (!username || !text) return

    return GptUtils.build_input({ text, username, reply_to_username, reply_to_text })
  },
}
