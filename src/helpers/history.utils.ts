import * as process from 'process'
import * as fs from 'fs'

import { User } from '@/main'
import { ContextArgs } from '@/helpers/context.utils'
import { Logger } from '@/logger'
import { StringUtils } from '@/helpers/string.utils'

export const HistoryUtils = {
  build_gpt_history: (input: string, output: string, reply_username: string) => {
    const io = input.replace(`\nWinx(${reply_username}): |`, '')
    return `${io}Winx(${reply_username}): |${output}|\n`
  },

  build_reply_gpt_history: (input: string, output: string, reply_username: string) => {
    const io = input.replace(`\nWinx(${reply_username}): |`, '')
    return `${io}Winx(${reply_username}): |${output}|\n`
  },

  build_chat_history: ({ text, username, reply_to_username }: ContextArgs) => {
    if (reply_to_username) return `${username}(${reply_to_username}): |${text}|\n`
    return `${username}: |${text}|\n`
  },

  write_history: (history: string) => {
    HistoryUtils.slice_lines(2)
    fs.createWriteStream(process.cwd() + '/tmp/history.gpt.txt', { flags: 'a' }).write(history)
  },

  slice_lines: (n: number) => {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    if (!fs.existsSync(process.cwd() + '/tmp/history.gpt.txt')) return
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')
    if (StringUtils.count_tokens((main + history) as string) < 2000) return
    const lines = fs.readFileSync(history, 'utf8').split('\n')
    fs.writeFileSync(history, lines.slice(n).join('\n'))
  },

  reset_history: () => {
    const isExists = fs.existsSync(process.cwd() + '/tmp/history.gpt.txt')
    if (isExists) fs.unlinkSync(process.cwd() + '/tmp/history.gpt.txt')
  },

  populate_history: async () =>
    User.getHistory().finally(() => Logger.info('History resetded', 'HISTORY')),
}
