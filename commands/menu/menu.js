import { commandList } from '../../lib/loader.js'
import { sendListButton } from '../../lib/interactive.js'
import { log } from '../../lib/logger.js'
import { loadBanner } from '../../lib/banner.js'
import {
  MENU_CATEGORIES,
  buildCategoryRows,
  buildCategoryText,
  buildMenu,
  buildPageText,
  menuPages,
} from '../../lib/menu.js'

const BUTTON_TEXT = '📜 Seleccionar menú'

export default {
  name: 'menu',
  alias: ['help', 'ayuda'],
  description: 'Muestra el menú con el botón para elegir categoría',
  async run({ sock, chat, reply, user, isOwner, isPremium, prefix, args }) {
    const first = (args[0] || '').toLowerCase()

    // .menu <categoria>  -> comandos de esa categoría (lo usan las filas del botón)
    const cat = MENU_CATEGORIES.find(c => c.key === first)
    if (cat) return reply(buildCategoryText({ cat, commandList, prefix }))

    // .menu page <n>  -> página siguiente/anterior (lo usan los botones de navegación)
    const pages = menuPages()
    const paging = first === 'page'
    const page = paging ? Math.min(Math.max(parseInt(args[1], 10) || 1, 1), pages) : 1

    // Un solo mensaje: el encabezado del menú con el botón justo debajo
    const body = paging
      ? `ᴄᴀᴛᴇɢᴏʀíᴀs — ᴘᴀɢɪɴᴀ ${page} ᴅᴇ ${pages}`
      : buildMenu({ user, isOwner, isPremium })

    const options = {
      body,
      buttonText: BUTTON_TEXT,
      sectionTitle: `Categorías ${page}/${pages}`,
      rows: buildCategoryRows({ page, commandList, prefix }),
    }
    // El banner se usa en la página 1; si la subida de la imagen falla, se envía sin ella
    const banner = paging ? null : loadBanner()

    try {
      if (banner) {
        try {
          await sendListButton(sock, chat, { ...options, image: banner })
          return
        } catch (err) {
          log.error('No se pudo enviar el banner, se envía sin imagen:', err.message)
        }
      }
      await sendListButton(sock, chat, options)
    } catch (err) {
      // Si WhatsApp no acepta el botón, se envía el mismo contenido como texto
      log.error('No se pudo enviar el botón del menú, se envía como texto:', err.message)
      const fallback = paging ? '' : body + '\n\n'
      await reply(fallback + buildPageText({ page, commandList, prefix }))
    }
  },
}
