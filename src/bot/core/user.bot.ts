import env from '@/env'

import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

import { Logger } from '@/logger'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'

export class UserBot {
  public user: TelegramClient

  constructor() {
    this.user = new TelegramClient(
      new StringSession(env.STRING_SESSION),
      env.API_ID,
      env.API_HASH,
      { connectionRetries: 5 }
    )
  }

  public async start() {
    await this.user
      .start({ botAuthToken: env.BOT_TOKEN })
      .then(() => Logger.info('UserBot started', 'USERBOT'))
    await this.user.getDialogs()
  }

  public async getHistory() {
    HistoryUtils.reset_history()

    const group = env.GROUP_ID.split(',').map((id: string) => id.trim())
    const chatMessages = await this.user.getMessages(group[0], {
      filter: new Api.InputMessagesFilterEmpty(),
      reverse: false,
      limit: 70,
    })
    const messages = chatMessages.reverse()
    let context = ''

    for (let i = 0; i < messages.length; i++) {
      const message = chatMessages[i]
      const sender: any = await message.getSender()
      if (!sender) continue

      const parse_text = StringUtils.normalize_text(message.text)
      const user = sender.toJSON()
      if (
        user.firstName &&
        user.bot === false &&
        parse_text &&
        parse_text !== ' ' &&
        parse_text !== '  ' &&
        parse_text.length > 2 &&
        !StringUtils.text_includes(parse_text, ['winx', '/'])
      ) {
        const username = StringUtils.normalize_username(user.firstName, user.lastName)

        const reply = await message.getReplyMessage()
        if (reply) {
          const replySender: any = await reply.getSender()
          if (replySender) {
            if (replySender.firstName) {
              const reply_to_username = StringUtils.normalize_username(
                replySender.firstName,
                replySender.lastName
              )

              if (username && reply_to_username)
                context += HistoryUtils.build_chat_history({
                  username,
                  reply_to_username,
                  text: parse_text,
                })
            }
          }
        } else if (username) context += `${username}: |${parse_text}|\n`
      }
    }

    HistoryUtils.write_history(context)

    return context
  }

  public async sendMessage(chatId: number, text: string, reply_to?: number) {
    return this.user
      .invoke(
        new Api.messages.SetTyping({
          action: new Api.SendMessageTypingAction(),
          peer: chatId,
        })
      )
      .then(async () =>
        this.user.invoke(
          new Api.messages.SendMessage({
            peer: chatId,
            replyToMsgId: reply_to,
            message: text,
          })
        )
      )
  }
}
