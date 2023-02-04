import { Context } from 'grammy'
import { Menu } from '@grammyjs/menu'

export const StartMarkup = new Menu<Context>('start')
  .text('🔎 Comandos', (ctx) =>
    ctx.reply(`<b>Comandos</b>`, {
      parse_mode: 'HTML',
    })
  )
  .row()
  .url('📺 Canal', 'https://t.me/clubdaswinxcanal')
  .url('👥 Grupo', 'https://t.me/polclubdaswinx')
  .row()
  .url('➕ Me adicione em seu grupo', 'https://t.me/winx_ia_bot?startgroup=new')
  .row()
  .url('👔 Dono', 'https://t.me/mrootx')
