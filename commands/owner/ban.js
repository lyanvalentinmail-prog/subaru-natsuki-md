import { getUser } from '../../lib/db.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'ban',
  usage: '<@usuario o número>',
  owner: true,
  description: 'Bloquea a un usuario: el bot deja de responderle',
  async run({ m, args, reply }) {
    const n = resolveTargetNumber(m, args)
    if (!n) return reply('Menciona a un usuario o escribe su número.')
    getUser(n).banned = true
    await reply(`🚫 @${n} fue baneado.`)
  },
}
