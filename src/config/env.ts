import 'dotenv/config'

import { bool, cleanEnv, num, str } from 'envalid'

export const Env = cleanEnv(process.env, {
  API_ID: num({
    desc: 'Telegram API ID',
    example: '1234567',
  }),
  API_HASH: str({
    desc: 'Telegram API Hash',
    example: '0123456789abcdef0123456789abcdef',
  }),
  BOT_TOKEN: str({
    desc: 'Telegram Bot Token',
    example: '1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  }),
  STRING_SESSION: str({
    desc: 'Telegram String Session',
  }),
  OPENAI_TOKEN: str({
    desc: 'OpenAI Token',
    example: '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',
    docs: 'https://beta.openai.com/docs/api-reference/authentication',
  }),
  GROUP_ID: str({
    desc: 'Telegram Groups ID (separated by comma)',
    example: '-1001234567890,-1000987654321',
  }),
  DB_DEBUG: bool({
    desc: 'Enable Knex Debug',
    default: false,
    docs: 'https://knexjs.org/#Installation-debug',
    example: 'true',
  }),
})

export default Env
