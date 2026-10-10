import { byId, power } from '../../lib/pokedex.js'
import { getUser } from '../../lib/db.js'
import { collectionOf, describe, strongest } from '../../lib/pokemon-collection.js'
import { resolveTargetNumber } from '../../lib/utils.js'

const XP_WIN = 10

/** Sube de nivel si la experiencia alcanza el nivel × 10 */
function gainXp(entry, amount) {
  entry.xp = (entry.xp || 0) + amount
  while (entry.xp >= entry.level * 10) {
    entry.xp -= entry.level * 10
    entry.level++
  }
}

export default {
  name: 'pelea',
  alias: ['battle'],
  usage: '<@usuario>',
  description: 'Pelea tu Pokémon más fuerte contra el de otro usuario',
  async run({ m, args, number, reply }) {
    const target = resolveTargetNumber(m, args)
    if (!target) return reply('Menciona a quien quieres retar.')
    if (target === number) return reply('No puedes pelear contra ti mismo.')

    const mine = strongest(collectionOf(getUser(number)))
    const theirs = strongest(collectionOf(getUser(target)))
    if (!mine) return reply('No tienes Pokémon. Usa .pokemon para capturar uno.')
    if (!theirs) return reply('Ese usuario no tiene Pokémon.')

    // El azar mueve el resultado un poco (±15 %), para que no siempre gane el más fuerte
    const scoreMine = power(byId(mine.id), mine.level) * (0.85 + Math.random() * 0.3)
    const scoreTheirs = power(byId(theirs.id), theirs.level) * (0.85 + Math.random() * 0.3)

    const iWin = scoreMine >= scoreTheirs
    const winner = iWin ? mine : theirs
    gainXp(winner, XP_WIN)
    await reply(
      [
        '⚔️ *Batalla Pokémon*',
        `┊ ✿ Tú: ${describe(mine)}`,
        `┊ ✿ Rival: ${describe(theirs)}`,
        `🏆 Ganó ${iWin ? 'tu Pokémon' : 'el Pokémon del rival'} (+${XP_WIN} XP)`,
      ].join('\n'),
    )
  },
}
