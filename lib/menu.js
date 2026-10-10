import config from '../config.js'
import { toSmallCaps } from './smallcaps.js'

/**
 * Categorías del menú (en el mismo orden que la lista de tu diseño).
 * "key" es el nombre de la carpeta donde vivirán los comandos dentro de /commands.
 * Nota: "info" está dentro de "menu" (commands/menu/info/).
 */
export const MENU_CATEGORIES = [
  { key: 'menu', label: 'ᴍᴇɴᴜ' },
  { key: 'info', label: 'ɪɴғᴏ' },
  { key: 'owner', label: 'ᴏᴡɴᴇʀ' },
  { key: 'panel', label: 'ᴘᴀɴᴇʟ' },
  { key: 'group', label: 'ɢʀᴏᴜᴘ' },
  { key: 'tools', label: 'ᴛᴏᴏʟs' },
  { key: 'search', label: 'sᴇᴀʀᴄʜ' },
  { key: 'ai', label: 'ᴀɪ' },
  { key: 'downloads', label: 'ᴅᴏᴡɴʟᴏᴀᴅs' },
  { key: 'stickers', label: 'sᴛɪᴄᴋᴇʀs' },
  { key: 'image', label: 'ɪᴍᴀɢᴇ' },
  { key: 'audio', label: 'ᴀᴜᴅɪᴏ' },
  { key: 'anime', label: 'ᴀɴɪᴍᴇ' },
  { key: 'fun', label: 'ғᴜɴ' },
  { key: 'games', label: 'ɢᴀᴍᴇs' },
  { key: 'economy', label: 'ᴇᴄᴏɴᴏᴍʏ' },
  { key: 'rpg', label: 'ʀᴘɢ' },
  { key: 'pokemon', label: 'ᴘᴏᴋᴇᴍᴏɴ' },
]

/** Límite de WhatsApp para el cuerpo de un mensaje con botones */
export const BODY_MAX = 1024

/** Filas por página de la lista (WhatsApp permite 10 en total; 1 se usa para navegar) */
export const PAGE_SIZE = 9

/** Número de páginas de la lista de categorías (con 18 categorías son 2) */
export const menuPages = () => Math.max(1, Math.ceil(MENU_CATEGORIES.length / PAGE_SIZE))

/** Categorías que van en una página (sin contar los botones de navegación) */
export const pageCategories = (page = 1) => {
  const start = (page - 1) * PAGE_SIZE
  return MENU_CATEGORIES.slice(start, start + PAGE_SIZE)
}

/** Símbolos de permisos mostrados junto a cada comando */
const flagsOf = cmd =>
  [cmd.premium && 'Ⓟ', cmd.limit && 'Ⓛ', cmd.owner && 'Ⓞ', cmd.admin && 'Ⓐ']
    .filter(Boolean)
    .join(' ')

/** Línea de un comando: ┊ ✿ .nombre <uso> Ⓟ Ⓛ */
const commandLine = (c, prefix) => {
  const usage = c.usage ? ` ${c.usage}` : ''
  const flags = flagsOf(c)
  return `┊ ✿ ${prefix}${toSmallCaps(c.name)}${usage}${flags ? ' ' + flags : ''}`
}

/**
 * Texto principal del menú: saludo, estadísticas del usuario y leyenda de símbolos.
 * Las categorías van en el botón "Seleccionar menú", no en este texto.
 * @param {object} opts
 * @param {object} opts.user      registro del usuario (db)
 * @param {boolean} opts.isOwner
 * @param {boolean} opts.isPremium
 */
export function buildMenu({ user, isOwner, isPremium }) {
  const status = toSmallCaps(isOwner ? 'owner' : isPremium ? 'premium' : 'free')
  const limit = isPremium ? '∞' : String(user.limit)

  return [
    'ʜᴏʟᴀ, sᴏʏ sᴜʙᴀʀᴜ ɴᴀᴛsᴜᴋɪ - ᴍᴅ,',
    '',
    'ɢʀᴀᴄɪᴀs ᴘᴏʀ ɪɴᴠɪᴛᴀʀᴍᴇ ᴀʟ ɢʀᴜᴘᴏ — sᴇʟᴇᴄᴄɪᴏɴᴀ ᴇʟ ᴍᴇɴᴜ́ ǫᴜᴇ ɴᴇᴄᴇsɪᴛᴇs ᴀʙᴀᴊᴏ.',
    '',
    '',
    '୨୧ ESTADÍSTICAS ୨୧',
    '',
    '୨୧ ᴜꜱᴇʀ ɪɴꜰᴏ',
    `┊ sᴛᴀᴛᴜs : ${status}`,
    `┊ ʟɪᴍɪᴛ : ${limit}`,
    `┊ XP : ${user.xp}`,
    '୨୧',
    '',
    '',
    '୨୧ ɪɴғᴏʀᴍᴀᴄɪᴏɴ ᴅᴇʟ ʙᴏᴛ',
    '┊ Ⓟ = ᴘʀᴇᴍɪᴜᴍ',
    '┊ Ⓛ = ʟɪᴍɪᴛ',
    '┊ Ⓞ = ᴏᴡɴᴇʀ',
    '┊ Ⓐ = ᴀᴅᴍɪɴ',
    '୨୧',
    '',
    'sᴜʙᴀʀᴜ ɴᴀᴛsᴜᴋɪ - ᴍᴅ',
  ].join('\n')
}

/**
 * Filas de la lista desplegable para una página.
 * Cada categoría abre su listado con ".menu <categoria>".
 * La página 1 termina con "sɪɢᴜɪᴇɴᴛᴇ ᴘᴀɢɪɴᴀ" y la última con "ᴀɴᴛᴇʀɪᴏʀ ᴘᴀɢɪɴᴀ".
 */
export function buildCategoryRows({ page = 1, commandList = [], prefix = config.prefixes[0] }) {
  const pages = menuPages()
  const rows = pageCategories(page).map(cat => {
    const count = commandList.filter(c => c.category === cat.key).length
    return {
      id: `${prefix}menu ${cat.key}`,
      title: `❏ ${cat.label}`,
      description: count ? `${count} comando${count === 1 ? '' : 's'}` : 'Próximamente',
    }
  })
  if (page < pages) {
    rows.push({
      id: `${prefix}menu page ${page + 1}`,
      title: '❏ sɪɢᴜɪᴇɴᴛᴇ ᴘᴀɢɪɴᴀ',
      description: `Página ${page + 1} de ${pages}`,
    })
  }
  if (page > 1) {
    rows.push({
      id: `${prefix}menu page ${page - 1}`,
      title: '❏ ᴀɴᴛᴇʀɪᴏʀ ᴘᴀɢɪɴᴀ',
      description: `Página ${page - 1} de ${pages}`,
    })
  }
  return rows
}

/** Texto de respaldo de una página de categorías (si el botón no se puede enviar) */
export function buildPageText({ page = 1, commandList = [], prefix = config.prefixes[0] }) {
  const pages = menuPages()
  const lines = [`୨୧ ᴄᴀᴛᴇɢᴏʀíᴀs ${page}/${pages} ୨୧`, '']
  for (const cat of pageCategories(page)) {
    const count = commandList.filter(c => c.category === cat.key).length
    lines.push(`❏ ${cat.label} — ${prefix}menu ${cat.key} (${count} comando${count === 1 ? '' : 's'})`)
  }
  return lines.join('\n')
}

/** Texto del listado de una categoría (.menu <categoria>) */
export function buildCategoryText({ cat, commandList = [], prefix = config.prefixes[0] }) {
  const cmds = commandList.filter(c => c.category === cat.key)
  const lines = [`୨୧ ❏ *${cat.label}*`]
  if (!cmds.length) lines.push('┊ Aún no hay comandos en esta categoría.')
  else for (const c of cmds) lines.push(commandLine(c, prefix))
  lines.push('୨୧')
  return lines.join('\n')
}
