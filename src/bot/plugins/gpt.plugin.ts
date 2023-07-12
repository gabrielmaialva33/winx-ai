import * as fs from 'fs'

import jimp from 'jimp'
import Env from '@/config/env'

import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import { Logger } from '@/helpers/logger.utils'
import { DateTime } from 'luxon'

import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { CreateCompletionRequest } from 'openai/api'

class OpenAI extends OpenAIApi {
  constructor() {
    super(new Configuration({ apiKey: Env.OPENAI_TOKEN }))
  }

  private models = {
    'text-davinci-003': 'davinci',
    'text-davinci-002': 'davinci',
  }

  private temperatures = {
    'text-davinci-003': [0.7, 0.8, 0.9, 1.0],
    'text-davinci-002': [0.9, 1.0],
  }

  private frequencies = {
    'text-davinci-003': [1.0, 1.3, 1.5, 1.7, 2.0],
    'text-davinci-002': [1.0, 1.5, 2.0],
  }

  private presences = {
    'text-davinci-003': [1.0, 1.3, 1.5, 1.7, 2.0],
    'text-davinci-002': [1.0, 1.5, 2.0],
  }

  private n = {
    'text-davinci-003': [1],
    'text-davinci-002': [1, 2],
  }

  private GetRandomCompletionRequest() {
    const model = Object.keys(this.models)[
      Math.floor(Math.random() * Object.keys(this.models).length)
    ]

    const temperature =
      // @ts-ignore
      this.temperatures[model][Math.floor(Math.random() * this.temperatures[model].length)]
    const frequency =
      // @ts-ignore
      this.frequencies[model][Math.floor(Math.random() * this.frequencies[model].length)]
    // @ts-ignore
    const presence = this.presences[model][Math.floor(Math.random() * this.presences[model].length)]
    // @ts-ignore
    const n = this.n[model][Math.floor(Math.random() * this.n[model].length)]

    return {
      model,
      temperature: 1,
      frequency_penalty: 1.5,
      presence_penalty: 1.0,
      n: 1,
      max_tokens: 500,
    } as CreateCompletionRequest
  }

  public async complete(text: string, username: string) {
    const temp_main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    const main = temp_main
      .replace(
        '$date',
        DateTime.local({ zone: 'America/Sao_Paulo' }).toLocaleString(DateTime.DATE_FULL)
      )
      .replace(
        '$time',
        DateTime.local({ zone: 'America/Sao_Paulo' }).toLocaleString(DateTime.TIME_SIMPLE)
      )

    Logger.info(
      `context: ${JSON.stringify(StringUtils.InfoText(main + history + text))}`,
      'ai.complete'
    )
    Logger.info(`CONFIG: ${JSON.stringify(this.GetRandomCompletionRequest())}`, 'ai.complete')

    const prompt = StringUtils.RemoveBreakLines(main + history + text + `Winx(${username}):||`)

    if (StringUtils.CountTokens(prompt) > 4096) {
      Logger.error('tokens limit exceeded!', 'ai.complete')

      await HistoryUtils.populate_history()

      // text-curie-001 text-davinci-003
      return this.createCompletion(
        {
          prompt,
          ...this.GetRandomCompletionRequest(),
          stop: ['||'],
        },
        { timeout: 30000 }
      )
    }

    return this.createCompletion(
      {
        prompt,
        ...this.GetRandomCompletionRequest(),
        stop: ['||'],
      },
      { timeout: 30000 }
    )
  }

  public async opinion(text: string) {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    Logger.info(`CONTEXT: ${JSON.stringify(StringUtils.InfoText(main + history))}`, 'IA/COMPLETE')
    Logger.info(`CONFIG: ${JSON.stringify(this.GetRandomCompletionRequest())}`, 'IA/COMPLETE')

    const prompt = StringUtils.RemoveBreakLines(main + history + text + `Winx:||`)

    if (StringUtils.CountTokens(prompt) > 4000) {
      Logger.error('Tokens limit exceeded!', 'IA/COMPLETE')

      await HistoryUtils.populate_history()

      // text-curie-001 text-davinci-003
      return this.createCompletion({
        prompt,
        ...this.GetRandomCompletionRequest(),
        stop: ['||'],
      })
    }

    return this.createCompletion({
      prompt,
      ...this.GetRandomCompletionRequest(),
      stop: ['||'],
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
    if (!fs.existsSync(process.cwd() + '/tmp/system.gpt.txt'))
      fs.writeFileSync(process.cwd() + '/tmp/system.gpt.txt', '')

    if (!fs.existsSync(process.cwd() + '/tmp/history.gpt.txt'))
      fs.writeFileSync(process.cwd() + '/tmp/history.gpt.txt', '')

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
      stop: ['||'],
      max_tokens: 100,
      temperature: 0.5,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
      messages: messages,
      n: 1,
    })
  }
}

export const IA = new OpenAI()
