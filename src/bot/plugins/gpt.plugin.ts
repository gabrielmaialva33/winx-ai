import * as fs from 'fs'
import * as process from 'process'
import jimp from 'jimp'
import { DateTime } from 'luxon'

import { OpenAI } from 'openai'

import Env from '@/config/env'

import { Logger } from '@/helpers/logger.utils'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { CompletionCreateParamsBase } from 'openai/src/resources/completions'

export class AI extends OpenAI {
  private config = {
    model: 'gpt-3.5-turbo-instruct',
    //model: 'text-davinci-002',
    temperature: 0.8,
    max_tokens: 256,
    frequency_penalty: 0.5,
    presence_penalty: 0.7,
    n: 1,
    stop: ['||'],
  } as CompletionCreateParamsBase

  constructor() {
    super({ apiKey: Env.OPENAI_TOKEN })
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
    Logger.info(`config: ${JSON.stringify(this.config)}`, 'ai.complete')

    const prompt = StringUtils.RemoveBreakLines(main + history + text + `Winx(${username}):||`)

    if (StringUtils.CountTokens(prompt) > 4096) {
      Logger.error('tokens limit exceeded!', 'ai.complete')

      await HistoryUtils.populate_history()

      return this.completions.create({ ...this.config, prompt }, { timeout: 30000 })
    }

    return this.completions.create({ ...this.config, prompt }, { timeout: 30000 })
  }

  public async imagine(text: string, n?: number) {
    Logger.info(`imagining text: ${text}`, 'ai.imagine')

    return this.images.generate({
      prompt: text,
      n: n || 1,
      size: '1024x1024',
      response_format: 'url',
      model: 'dall-e-3',
    })
  }

  //
  public async variation(path: string) {
    const file = await fs.promises.readFile(path)
    await jimp.read(file).then((image) => image.writeAsync(`${path}.png`))

    const image = await jimp.read(`${path}.png`)
    await image.resize(512, 512).writeAsync(`${path}.png`)

    Logger.info(`variation image: ${path}.png`, 'ai.variation')

    return this.images.createVariation({
      image: fs.createReadStream(`${path}.png`),
      size: '512x512',
      n: 1,
      response_format: 'url',
    })
  }

  public async gpt4(text: string) {
    Logger.info(`gpt3 text: ${text}`, 'ai.gpt3')

    return this.chat.completions.create({
      model: 'gpt-4',
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: 'system',
          content: 'Você é a Winx AI 🤖 que responde os usuários do grupo Club das Winx 🧚‍♀️',
        },
        { role: 'user', content: text },
      ],
    })
  }
}

export const IA = new AI()
