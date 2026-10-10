import config from '../../config.js'
import { commandList } from '../../lib/loader.js'
import { sendListButton } from '../../lib/interactive.js'
import { log } from '../../lib/logger.js'
import {
  BODY_MAX,
  MENU_CATEGORIES,
  buildCategoryRows,
  buildCategoryText,
  buildMenu,
  menuPages,
} from '../../lib/menu.js'

const BUTTON_TEXT = '📜 Seleccionar menú'

export default {
  name: 'menu',
  alias: ['help', 'ayuda'],
  description: 'Muestra el menú con el botón para elegir categoría',
  async run({ sock, chat, reply, user, isOwner, isPremium, prefix, args }) {
    const first = (args[0] || '').toLowerCase()

    // .menu <categoria>  -> lista de comandos de esa categoría (lo usan las filas del botón)
    const cat = MENU_CATEGORIES.find(c => c.key === first)
    if (cat) return reply(buildCategoryText({ cat, commandList, prefix }))

    // .menu page <n>  -> página siguiente/anterior de la lista (texto corto)
    const pages = menuPages()
    const paging = first === 'page'
    const page = paging ? Math.min(Math.max(parseInt(args[1], 10) || 1, 1), pages) : 1

    let body = paging
      ? `ᴄᴀᴛᴇɢᴏʀíᴀs ᴅᴇʟ ᴍᴇɴᴜ́ — ᴘᴀɢɪɴᴀ ${page} de ${pages}`
      : buildMenu({ user, isOwner, isPremium, prefix, commandList })
    if (body.length > BODY_MAX) {
      // Si la lista de comandos es muy larga, se quita la lista de ❏ (ya está en el botón)
      body = buildMenu({ user, isOwner, isPremium, prefix, commandList, withCategories: false })
    }

    try {
      await sendListButton(sock, chat, {
        body,
        footer: config.botName,
        buttonText: BUTTON_TEXT,
        sectionTitle: `Categorías ${page}/${pages}`,
        rows: buildCategoryRows({ page, commandList, prefix }),
      })
    } catch (err) {
      // Si WhatsApp no acepta el mensaje con botón, se envía el menú como texto
      log.error('No se pudo enviar el menú con botón, se envía como texto:', err.message)
      await reply(buildMenu({ user, isOwner, isPremium, prefix, commandList }))
    }
  },
}
