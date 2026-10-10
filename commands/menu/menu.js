import config from '../../config.js'
import { commandList } from '../../lib/loader.js'
import { sendListButton } from '../../lib/interactive.js'
import { log } from '../../lib/logger.js'
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

    // 1) Texto SIEMPRE visible: el menú completo (o la página de categorías al navegar)
    const text = paging
      ? buildPageText({ page, commandList, prefix })
      : buildMenu({ user, isOwner, isPremium, prefix, commandList })
    await reply(text)

    // 2) Botón debajo, que abre la lista de categorías
    try {
      await sendListButton(sock, chat, {
        body: '📜 Elige una categoría para ver sus comandos 👇',
        footer: config.botName,
        buttonText: BUTTON_TEXT,
        sectionTitle: `Categorías ${page}/${pages}`,
        rows: buildCategoryRows({ page, commandList, prefix }),
      })
    } catch (err) {
      log.error('No se pudo enviar el botón del menú:', err.message)
    }
  },
}
