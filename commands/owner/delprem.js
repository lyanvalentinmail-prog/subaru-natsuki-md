import { getUser } from '../../lib/db.js'
import { resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'delprem',
  alias: ['delpremium'],
  usage: '<@usuario o número>',
  owner: true,
  description: 'Quita Premium (Ⓟ) a un usuario',
  async run({ m, args, reply }) {
    const n = resolveTargetNumber(m, args)
    if (!n) return reply('Menciona a un usuario o escribe su número.')
    getUser(n).premium = false
    await reply(`✅ @${n} ya no es Premium.`)
  },
}
