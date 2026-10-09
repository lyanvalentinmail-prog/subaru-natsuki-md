import config from '../config.js'

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

/** Símbolos de permisos mostrados junto a cada comando */
const flagsOf = cmd =>
  [cmd.premium && 'Ⓟ', cmd.limit && 'Ⓛ', cmd.owner && 'Ⓞ', cmd.admin && 'Ⓐ']
    .filter(Boolean)
    .join(' ')

/**
 * Construye el texto del menú.
 * @param {object} opts
 * @param {object} opts.user      registro del usuario (db)
 * @param {boolean} opts.isOwner
 * @param {boolean} opts.isPremium
 * @param {string} opts.prefix    prefijo principal, ej. "."
 * @param {Array} opts.commandList lista de comandos cargados
 */
export function buildMenu({ user, isOwner, isPremium, prefix = config.prefixes[0], commandList = [] }) {
  const status = isOwner ? 'Owner' : isPremium ? 'Premium' : 'Free'
  const limit = isPremium ? '∞' : String(user.limit)

  const lines = [
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
    '',
    ...MENU_CATEGORIES.map(c => `❏ ${c.label}`),
  ]

  // Comandos agrupados por categoría (solo se muestran las categorías que tengan comandos)
  for (const cat of MENU_CATEGORIES) {
    const cmds = commandList.filter(c => c.category === cat.key)
    if (!cmds.length) continue
    lines.push('', `୨୧ ❏ *${cat.label}*`)
    for (const c of cmds) {
      const usage = c.usage ? ` ${c.usage}` : ''
      const flags = flagsOf(c)
      lines.push(`┊ ✿ ${prefix}${c.name}${usage}${flags ? ' ' + flags : ''}`)
    }
    lines.push('୨୧')
  }

  return lines.join('\n')
}
