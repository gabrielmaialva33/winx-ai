import env from '@/env'

import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

import { Logger } from '@/logger'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'

export class UserBot {
  public user_1: TelegramClient
  public user_2: TelegramClient
  public user_3: TelegramClient

  constructor() {
    // 𝕄𝕒𝕙𝕚𝕟𝕒
    this.user_1 = new TelegramClient(
      new StringSession(env.STRING_SESSION_1),
      env.API_ID,
      env.API_HASH,
      { connectionRetries: 5 }
    )
    // ｓｅｎｓｉｔｉｖｅ 不同
    this.user_2 = new TelegramClient(
      new StringSession(env.STRING_SESSION_2),
      env.API_ID,
      env.API_HASH,
      { connectionRetries: 5 }
    )
    // Winx
    this.user_3 = new TelegramClient(
      new StringSession(env.STRING_SESSION_3),
      env.API_ID,
      env.API_HASH,
      { connectionRetries: 5 }
    )
  }

  public async start() {
    await this.user_1
      .start({ botAuthToken: env.BOT_TOKEN })
      .then(() => Logger.info('UserBot1 started', 'USERBOT_1'))

    await this.user_2
      .start({ botAuthToken: env.BOT_TOKEN })
      .then(() => Logger.info('UserBot2 started', 'USERBOT_2'))

    await this.user_3
      .start({ botAuthToken: env.BOT_TOKEN })
      .then(() => Logger.info('UserBot3 started', 'USERBOT_3'))

    await this.user_1.getDialogs()
    await this.user_2.getDialogs()
    await this.user_3.getDialogs()
  }

  public async getHistory() {
    HistoryUtils.reset_history()

    const group = env.GROUP_ID.split(',').map((id: string) => id.trim())
    const chatMessages = await this.user_2.getMessages(group[0], {
      filter: new Api.InputMessagesFilterEmpty(),
      reverse: false,
      limit: 150,
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

  public async sendMessage1(chat_id: number, text: string, reply_to?: number) {
    await this.user_1.getParticipants(chat_id)
    await this.user_1.sendMessage(chat_id, {
      message: text,
      replyTo: reply_to,
    })
  }

  public async sendMessage2(chat_id: number, text: string, reply_to?: number) {
    await this.user_2.getParticipants(chat_id)
    await this.user_2.sendMessage(chat_id, {
      message: text,
      replyTo: reply_to,
    })
  }

  public async sendMessage3(chat_id: number, text: string, reply_to?: number) {
    await this.user_3.getParticipants(chat_id)
    await this.user_3.sendMessage(chat_id, {
      message: text,
      replyTo: reply_to,
    })
  }
}
