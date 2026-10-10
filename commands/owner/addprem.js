import { getUser } from '../../lib/db.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'addprem',
  alias: ['addpremium'],
  usage: '<@usuario o número>',
  owner: true,
  description: 'Da Premium (Ⓟ) a un usuario',
  async run({ m, args, reply }) {
    const n = resolveTargetNumber(m, args)
    if (!n) return reply('Menciona a un usuario o escribe su número.')
    getUser(n).premium = true
    await reply(`✅ @${n} ahora es Premium.`)
  },
}
