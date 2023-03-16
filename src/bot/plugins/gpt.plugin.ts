import * as fs from 'fs'

import jimp from 'jimp'
import env from '@/env'

import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { Logger } from '@/logger'

import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { CreateCompletionRequest } from 'openai/api'

class OpenAI extends OpenAIApi {
  constructor() {
    super(new Configuration({ apiKey: env.OPENAI_TOKEN }))
  }

  private RandonCompletionRequest = {
    model: 'text-davinci-003',
    temperature: Math.random() * (1.0 - 0.5) + 0.5,
    max_tokens: 500,
    frequency_penalty: Math.random() * (1.0 - 0.2) + 0.2,
    presence_penalty: Math.random() * (1.0 - 0.2) + 0.2,
    n: 10,
  } as CreateCompletionRequest

  public async complete(text: string, username: string) {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    Logger.info(
      `CONTEXT: ${JSON.stringify(StringUtils.info_text(main + history + text))}`,
      'IA/COMPLETE'
    )
    Logger.info(`CONFIG: ${JSON.stringify(this.RandonCompletionRequest)}`, 'IA/COMPLETE')

    const prompt = StringUtils.remove_breaklines(main + history + text + `Winx(${username}):|`)

    if (StringUtils.count_tokens(prompt) > 4000) {
      Logger.error('Tokens limit exceeded!', 'IA/COMPLETE')

      await HistoryUtils.populate_history()

      // text-curie-001 text-davinci-003
      return this.createCompletion({
        prompt,
        ...this.RandonCompletionRequest,
        stop: ['|'],
      })
    }

    return this.createCompletion({
      prompt,
      ...this.RandonCompletionRequest,
      stop: ['|'],
    })
  }

  public async imagine(text: string, n?: number) {
    Logger.info(`Imagining text: ${text}`, 'IA')
    return this.createImage({
      prompt: text,
      n: n || 1,
      size: '512x512',
      response_format: 'url',
    })
  }

  public async variation(path: string) {
    // change the file extension to png
    const file = await fs.readFileSync(path)
    await jimp.read(file).then((image) => image.writeAsync(`${path}.png`))

    // redimension the image
    const image = await jimp.read(`${path}.png`)
    await image.resize(512, 512).writeAsync(`${path}.png`)

    Logger.info(`Variating image: ${path}.png`, 'IA')

    return this.createImageVariation(fs.createReadStream(`${path}.png`) as any, 1, '512x512', 'url')
  }

  public async chat(text: string, username: string) {
    const system = fs.readFileSync(process.cwd() + '/tmp/system.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    // split the text in lines
    const lines_history: string[] = history.split('\n') as unknown as string[]
    lines_history.pop()

    const messages_history = lines_history.map((line) => {
      const [user, message] = line.split(':')

      const reply_to_user = user.includes('(') ? user.split('(')[1].split(')')[0] : user
      const new_user = user.includes('(') ? user.split('(')[0] : user

      const modified_message = reply_to_user
        ? message.slice(0, 1) + `(reply: ${reply_to_user}) ` + message.slice(1)
        : message

      return {
        role:
          user.includes('Winx') && !user.includes('(')
            ? ChatCompletionRequestMessageRoleEnum.Assistant
            : ChatCompletionRequestMessageRoleEnum.User,
        name: new_user ? new_user : user,
        content: modified_message,
      }
    })

    const line_text = text.split(':')
    const [user, message] = line_text
    const reply_to_user = user.includes('(') ? user.split('(')[1].split(')')[0] : user
    const new_user = user.includes('(') ? user.split('(')[0] : user

    const modified_message = reply_to_user
      ? message.slice(0, 1) + `(reply: ${reply_to_user}) ` + message.slice(1)
      : message

    const messages_text = {
      role:
        user.includes('Winx') && !user.includes('(')
          ? ChatCompletionRequestMessageRoleEnum.Assistant
          : ChatCompletionRequestMessageRoleEnum.User,
      name: new_user ? new_user : user,
      content: modified_message.split('\n')[0],
    }

    messages_history.push(messages_text)

    const messages: Array<ChatCompletionRequestMessage> = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: system,
      },
      ...messages_history,
    ]

    console.log({ messages })

    return this.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stop: ['|'],
      max_tokens: 500,
      temperature: 0.5,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
      messages: messages,
      n: 1,
    })
  }
}

export const IA = new OpenAI()
