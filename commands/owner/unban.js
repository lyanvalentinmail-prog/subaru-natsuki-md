import { getUser } from '../../lib/db.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'unban',
  usage: '<@usuario o número>',
  owner: true,
  description: 'Quita el baneo a un usuario',
  async run({ m, args, reply }) {
    const n = resolveTargetNumber(m, args)
    if (!n) return reply('Menciona a un usuario o escribe su número.')
    getUser(n).banned = false
    await reply(`✅ @${n} ya no está baneado.`)
  },
}
