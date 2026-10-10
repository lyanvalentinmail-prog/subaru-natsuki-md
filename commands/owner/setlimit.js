import { getUser } from '../../lib/db.js'
import { onlyDigits, resolveTargetNumber } from '../../lib/utils.js'

export default {
  name: 'setlimit',
  alias: ['setlimite'],
  usage: '<@usuario o número> <cantidad>',
  owner: true,
  description: 'Cambia el límite (Ⓛ) de un usuario',
  async run({ m, args, reply }) {
    const n = resolveTargetNumber(m, args)
    const amount = parseInt(onlyDigits(args[args.length - 1] || ''), 10)
    if (!n || Number.isNaN(amount)) return reply('Uso: .setlimit <@usuario o número> <cantidad>')
    getUser(n).limit = amount
    await reply(`✅ Límite de @${n}: ${amount}`)
  },
}
