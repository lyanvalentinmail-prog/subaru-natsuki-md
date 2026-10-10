import config from '../../config.js'
import { findParticipant, isAdminNumber } from '../../lib/group.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'kick',
  alias: ['ban_grupo', 'sacar'],
  usage: '<@usuario>',
  group: true,
  admin: true,
  botAdmin: true,
  description: 'Saca a un miembro del grupo',
  async run({ sock, chat, m, args, reply, groupMetadata, number }) {
    const target = resolveTargetNumber(m, args)
    if (!target) return reply('Menciona a quien quieres sacar del grupo.')
    if (target === number || config.owners.includes(target)) return reply('No puedo sacar a ese usuario.')
    if (isAdminNumber(groupMetadata, target)) return reply('No puedo sacar a un admin del grupo.')
    const jid = findParticipant(groupMetadata, target)
    if (!jid) return reply('Ese usuario no está en el grupo.')
    await sock.groupParticipantsUpdate(chat, [jid], 'remove')
    await reply(`✅ @${target} fue sacado del grupo.`)
  },
}
