import axios from 'axios'
import fs from 'fs'
import process from 'process'
import { DateTime } from 'luxon'
import { StringUtils } from '@/helpers/string.utils'

class LlamaPlugin {
  private readonly url = 'http://0.0.0.0:11434/api/generate'
  private readonly headers = { 'Content-Type': 'application/json' }

  public async generate(text: string, username: string) {
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

    const prompt = StringUtils.RemoveBreakLines(main + text + `Winx(${username}):||`)
    const data = { prompt, model: 'llama2-uncensored' }
    try {
      const response = await axios.post(this.url, data, { headers: this.headers })

      // {
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.499729Z",
      // 	"response": "B",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.580257Z",
      // 	"response": "em",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.69005Z",
      // 	"response": "-",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.797788Z",
      // 	"response": "v",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.894356Z",
      // 	"response": "indo",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:57.976969Z",
      // 	"response": "!",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.063597Z",
      // 	"response": " Como",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.150143Z",
      // 	"response": " voc",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.234388Z",
      // 	"response": "ê",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.317719Z",
      // 	"response": " se",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.408923Z",
      // 	"response": " ch",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.495761Z",
      // 	"response": "ama",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.581676Z",
      // 	"response": "?",
      // 	"done": false
      // }{
      // 	"model": "llama2-uncensored",
      // 	"created_at": "2023-09-13T01:04:58.68882Z",
      // 	"done": true,
      // 	"context": [
      // 		2277,
      // 		29937,
      // 		379,
      // 		29965,
      // 		27616,
      // 		29901,
      // 		13,
      // 		29949,
      // 		29902,
      // 		1986,
      // 		325,
      // 		1794,
      // 		325,
      // 		29883,
      // 		13,
      // 		13,
      // 		2277,
      // 		29937,
      // 		390,
      // 		2890,
      // 		29925,
      // 		1164,
      // 		1660,
      // 		29901,
      // 		13,
      // 		29933,
      // 		331,
      // 		29899,
      // 		29894,
      // 		15036,
      // 		29991,
      // 		17295,
      // 		7931,
      // 		30037,
      // 		409,
      // 		521,
      // 		3304,
      // 		29973
      // 	],
      // 	"total_duration": 3886188292,
      // 	"load_duration": 17941625,
      // 	"prompt_eval_count": 18,
      // 	"prompt_eval_duration": 2637475000,
      // 	"eval_count": 13,
      // 	"eval_duration": 1148667000
      // }

      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default new LlamaPlugin()
