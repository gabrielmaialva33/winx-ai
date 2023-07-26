import * as fs from 'fs'
import jimp from 'jimp'
import Env from '@/config/env'
import { Configuration, OpenAIApi } from 'openai'
import { Logger } from '@/helpers/logger.utils'
import { DateTime } from 'luxon'
import { StringUtils } from '@/helpers/string.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { CreateCompletionRequest } from 'openai/api'

class OpenAI extends OpenAIApi {
  constructor() {
    super(new Configuration({ apiKey: Env.OPENAI_TOKEN }))
  }

  private CompletionRequest(): CreateCompletionRequest {
    return {
      model: 'text-davinci-003',
      temperature: 0.7,
      max_tokens: 60,
      frequency_penalty: 1.5,
      presence_penalty: 1.0,
      n: 1,
    }
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
    Logger.info(`config: ${JSON.stringify(this.CompletionRequest())}`, 'ai.complete')

    const prompt = StringUtils.RemoveBreakLines(main + history + text + `Winx(${username}):||`)

    if (StringUtils.CountTokens(prompt) > 4096) {
      Logger.error('tokens limit exceeded!', 'ai.complete')

      await HistoryUtils.populate_history()

      return this.createCompletion(
        {
          prompt,
          ...this.CompletionRequest(),
          stop: ['||'],
        },
        { timeout: 30000 }
      )
    }

    return this.createCompletion(
      {
        prompt,
        ...this.CompletionRequest(),
        stop: ['||'],
      },
      { timeout: 30000 }
    )
  }

  public async opinion(text: string) {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    Logger.info(`context: ${JSON.stringify(StringUtils.InfoText(main + history))}`, 'ai.opinion')
    Logger.info(`config: ${JSON.stringify(this.CompletionRequest())}`, 'ai.complete')

    const prompt = StringUtils.RemoveBreakLines(main + history + text + `Winx:||`)

    if (StringUtils.CountTokens(prompt) > 4096) {
      Logger.error('tokens limit exceeded!', 'ai.complete')

      await HistoryUtils.populate_history()

      return this.createCompletion({
        prompt,
        stop: ['||'],
        ...this.CompletionRequest(),
      })
    }

    return this.createCompletion({
      prompt,
      stop: ['||'],
      ...this.CompletionRequest(),
    })
  }

  public async imagine(text: string, n?: number) {
    Logger.info(`imagining text: ${text}`, 'ai.imagine')
    return this.createImage({
      prompt: text,
      n: n || 1,
      size: '512x512',
      response_format: 'url',
    })
  }

  public async variation(path: string) {
    const file = await fs.promises.readFile(path)
    await jimp.read(file).then((image) => image.writeAsync(`${path}.png`))

    const image = await jimp.read(`${path}.png`)
    await image.resize(512, 512).writeAsync(`${path}.png`)

    Logger.info(`variating image: ${path}.png`, 'ai.variation')

    return this.createImageVariation(fs.createReadStream(`${path}.png`) as any, 1, '512x512', 'url')
  }
}

export const IA = new OpenAI()
