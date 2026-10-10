import { findParticipant } from '../../lib/group.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'demote',
  alias: ['quitaradmin'],
  usage: '<@usuario>',
  group: true,
  admin: true,
  botAdmin: true,
  description: 'Quita admin a un miembro del grupo',
  async run({ sock, chat, m, args, reply, groupMetadata }) {
    const target = resolveTargetNumber(m, args)
    const jid = target && findParticipant(groupMetadata, target)
    if (!jid) return reply('Menciona a un miembro del grupo.')
    await sock.groupParticipantsUpdate(chat, [jid], 'demote')
    await reply(`✅ @${target} ya no es admin.`)
  },
}
