import * as fs from 'fs'
import jimp from 'jimp'
import env from '@/env'

import { Configuration, OpenAIApi } from 'openai'
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
    max_tokens: 50,
    temperature: Math.random() * (8.0 - 0.5) + 0.5,
    // randomize the text by using a small number as the top_p parameter
    top_p: Math.random() * (0.9 - 0.1) + 0.1,
    // randomize
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    n: 3,
  } as CreateCompletionRequest

  public async complete(text: string, username: string) {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    Logger.info(`CONFIG: ${JSON.stringify(this.RandonCompletionRequest)}`, 'IA/COMPLETE')
    Logger.info(
      `CONTEXT: ${JSON.stringify(StringUtils.info_text(main + history + text))}`,
      'IA/COMPLETE'
    )
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
}

export const IA = new OpenAI()
