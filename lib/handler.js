import config from '../config.js'
import { commands } from './loader.js'
import { getUser, saveDb } from './db.js'
import { getMessageText, jidToNumber } from './utils.js'
import { log } from './logger.js'

/** Revisa si un participante de grupo es admin */
const isAdminParticipant = (participants = [], jid) => {
  const number = jidToNumber(jid)
  return participants.some(p => {
    const isAdm = p.admin === 'admin' || p.admin === 'superadmin'
    return isAdm && (jidToNumber(p.id) === number || jidToNumber(p.phoneNumber || '') === number)
  })
}

export async function handleMessages(sock, { messages, type }) {
  if (type !== 'notify') return
  for (const m of messages) {
    try {
      await processMessage(sock, m)
    } catch (err) {
      log.error('Error procesando mensaje:', err)
    }
  }
}

async function processMessage(sock, m) {
  if (!m?.message || !m.key) return

  const chat = m.key.remoteJid
  if (!chat || chat === 'status@broadcast') return

  const body = getMessageText(m.message).trim()
  const prefix = config.prefixes.find(p => body.startsWith(p))
  if (!prefix) return

  const [rawName = '', ...args] = body.slice(prefix.length).trim().split(/\s+/)
  const cmd = commands.get(rawName.toLowerCase())
  if (!cmd) return

  const isGroup = chat.endsWith('@g.us')
  const senderJid = isGroup ? m.key.participant || m.participant : chat
  const number = jidToNumber(senderJid)
  const fromMe = !!m.key.fromMe
  const isOwner = fromMe || config.owners.includes(number)

  const user = getUser(number)
  saveDb() // guarda usuarios nuevos y cambios de datos
  const reply = text => sock.sendMessage(chat, { text }, { quoted: m })

  if (user.banned && !isOwner) return reply(config.msg.banned)

  // ---- Permisos (Ⓞ Ⓐ Ⓟ Ⓛ) ----
  if (cmd.owner && !isOwner) return reply(config.msg.owner)
  if (cmd.group && !isGroup) return reply(config.msg.group)
  if (cmd.private && isGroup) return reply(config.msg.private)

  let isAdmin = false
  let isBotAdmin = false
  let groupMetadata = null
  if (cmd.admin || cmd.botAdmin) {
    if (!isGroup) return reply(config.msg.group)
    groupMetadata = await sock.groupMetadata(chat)
    isAdmin = isOwner || isAdminParticipant(groupMetadata.participants, senderJid)
    const botJid = sock.user?.lid || sock.user?.id
    isBotAdmin = isAdminParticipant(groupMetadata.participants, botJid)
    if (cmd.admin && !isAdmin) return reply(config.msg.admin)
    if (cmd.botAdmin && !isBotAdmin) return reply(config.msg.botAdmin)
  }

  const isPremium = isOwner || !!user.premium
  if (cmd.premium && !isPremium) return reply(config.msg.premium)

  if (cmd.limit && !isPremium) {
    if (user.limit < 1) return reply(config.msg.limit)
    user.limit -= 1
    saveDb()
  }

  log.info(`Comando ${prefix}${cmd.name} de ${number}${isGroup ? ' (grupo)' : ''}`)

  try {
    await cmd.run({
      sock,
      m,
      chat,
      sender: senderJid,
      number,
      args,
      text: args.join(' '),
      command: rawName.toLowerCase(),
      prefix,
      isGroup,
      isOwner,
      isAdmin,
      isBotAdmin,
      isPremium,
      groupMetadata,
      user,
      reply,
    })
    saveDb() // guarda los cambios que hizo el comando (colección, límites, etc.)
  } catch (err) {
    log.error(`Error en el comando ${cmd.name}:`, err)
    await reply(config.msg.error)
  }
}
