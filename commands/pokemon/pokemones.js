import { collectionOf, describe } from '../../lib/pokemon-collection.js'

export default {
  name: 'pokemones',
  alias: ['mispokemon'],
  description: 'Lista los Pokémon que tienes',
  async run({ user, reply }) {
    const list = collectionOf(user)
    if (!list.length) return reply('Todavía no tienes Pokémon. Usa .pokemon para capturar uno.')
    const lines = list.slice(0, 50).map((e, i) => `┊ ✿ ${i + 1}. ${describe(e)}`)
    if (list.length > 50) lines.push(`┊ … y ${list.length - 50} más`)
    await reply([`🎒 *Tus Pokémon* (${list.length})`, ...lines].join('\n'))
  },
}
