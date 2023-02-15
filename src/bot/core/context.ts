import { AsyncLocalStorage } from 'async_hooks'
import { Context as DefaultContext } from 'grammy'

import { ParseModeFlavor } from '@grammyjs/parse-mode'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { FileFlavor } from '@grammyjs/files'

export interface LocalContext {}

export const context = new AsyncLocalStorage<LocalContext>()

export type MyContext = FileFlavor<DefaultContext> &
  ParseModeFlavor<HydrateFlavor<DefaultContext & LocalContext>>
