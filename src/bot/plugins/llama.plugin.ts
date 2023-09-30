import axios from 'axios'
import fs from 'fs'
import process from 'process'
import { DateTime } from 'luxon'
import { StringUtils } from '@/helpers/string.utils'

class LlamaPlugin {
  //private readonly url = 'http://192.168.10.114:11434/api/generate'
  private readonly url = 'https://ai.winx.mrootx.xyz/completion'
  private readonly headers = {
    'Content-Type': 'application/json',
  }
  private context: any[]

  public async generate(text: string, username: string) {
    const temp_main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    // const main = temp_main
    //   .replace(
    //     '$date',
    //     DateTime.local({ zone: 'America/Sao_Paulo' }).toLocaleString(DateTime.DATE_FULL)
    //   )
    //   .replace(
    //     '$time',
    //     DateTime.local({ zone: 'America/Sao_Paulo' }).toLocaleString(DateTime.TIME_SIMPLE)
    //   )

    const prompt = StringUtils.RemoveBreakLines(temp_main + text + `Winx(${username}):||`)
    const data = { prompt, n_predict: 128, temperature: 1, stop: ['||'] }
    try {
      const response = await axios.post(this.url, data, { headers: this.headers }) // 10 minutes timeout to generate
      return response.data.content

      // // split by line`
      // const lines = response.data.split('\n')
      // const last_line = lines[lines.length - 2]

      // const context = JSON.parse(last_line).context
      // this.context = context

      // // get only responses
      // const responses = lines.map((line: string) => {
      //   try {
      //     return JSON.parse(line).response
      //   } catch {
      //     return null
      //   }
      // })

      // // remove null values
      // const filtered_responses = responses.filter(
      //   (response: string) => response !== null || response !== undefined
      // )
      // // join all responses
      // const concatenated = filtered_responses.filter(Boolean).join('')
      // return concatenated
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default new LlamaPlugin()
