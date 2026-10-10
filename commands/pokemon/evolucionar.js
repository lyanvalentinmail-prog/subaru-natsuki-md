import { byId, evolutionFor, levelToEvolve } from '../../lib/pokedex.js'
import { collectionOf } from '../../lib/pokemon-collection.js'

export default {
  name: 'evolucionar',
  alias: ['evolve'],
  usage: '<número de la lista>',
  description: 'Evoluciona un Pokémon de tu colección si ya tiene el nivel necesario',
  async run({ user, args, reply }) {
    const list = collectionOf(user)
    const index = parseInt(args[0], 10) - 1
    const entry = list[index]
    if (!entry) return reply('Escribe el número de tu lista (.pokemones).')

    const p = byId(entry.id)
    const evo = evolutionFor(p, entry.level)
    if (!evo) {
      const need = levelToEvolve(p)
      if (!need) return reply(`${p.name} no evoluciona por nivel.`)
      return reply(`${p.name} necesita nivel ${need} para evolucionar (está en nivel ${entry.level}).`)
    }
    entry.id = evo.id
    await reply(`✨ ¡${p.name} evolucionó a *${evo.name}*!`)
  },
}
