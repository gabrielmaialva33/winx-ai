import Env from '@/config/env'
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { Logger } from '@/helpers/logger.utils'

export class UserBot {
  public user: TelegramClient

  constructor() {
    this.user = new TelegramClient(
      new StringSession(Env.STRING_SESSION),
      Env.API_ID,
      Env.API_HASH,
      { connectionRetries: 5 }
    )
  }

  async start() {
    await this.user.start({ botAuthToken: Env.BOT_TOKEN })
    Logger.debug('user bot started', 'user.bot')
    await this.user.getDialogs()
  }

  async getHistory() {
    HistoryUtils.reset_history()

    const group = Env.GROUP_ID.split(',').map((id: string) => id.trim())
    const chatMessages = await this.user.getMessages(group[0], {
      filter: new Api.InputMessagesFilterEmpty(),
      reverse: false,
      limit: 20,
    })
    const messages = chatMessages.reverse()
    let context = ''

    for (const message of messages) {
      const sender: any = await message.getSender()
      if (!sender) continue

      const parse_text = StringUtils.NormalizeText(message.text)
      const user = sender.toJSON()
      if (
        user.firstName &&
        user.bot === false &&
        parse_text &&
        parse_text.trim() !== '' &&
        parse_text.length > 2 &&
        !StringUtils.TextInclude(parse_text, ['winx', '/'])
      ) {
        const username = StringUtils.NormalizeName(user.firstName, user.lastName)

        const reply = await message.getReplyMessage()
        if (reply) {
          const replySender: any = await reply.getSender()
          if (replySender && replySender.firstName) {
            const reply_to_username = StringUtils.NormalizeName(
              replySender.firstName,
              replySender.lastName
            )

            if (username && reply_to_username) {
              context += HistoryUtils.build_chat_history({
                username,
                reply_to_username,
                text: parse_text,
              })
            }
          }
        } else if (username) {
          context += `${username}:||${parse_text}||\n`
        }
      }
    }

    HistoryUtils.write_history(context)
  }

  async sendMessage(chatId: number, text: string, reply_to?: number) {
    await this.user.invoke(
      new Api.messages.SetTyping({
        action: new Api.SendMessageTypingAction(),
        peer: chatId,
      })
    )
    await this.user.invoke(
      new Api.messages.SendMessage({
        peer: chatId,
        message: text,
      })
    )
  }
}
