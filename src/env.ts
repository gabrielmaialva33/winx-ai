import 'dotenv/config'

import { cleanEnv, num, str } from 'envalid'

export type Env = typeof env
export const env = cleanEnv(process.env, {
  API_ID: num({}),
  API_HASH: str({}),
  BOT_TOKEN: str({}),
  STRING_SESSION_1: str({}),
  STRING_SESSION_2: str({}),
  STRING_SESSION_3: str({}),
  OPENAI_TOKEN: str({}),
  GROUP_ID: str({}),
})

export default env
