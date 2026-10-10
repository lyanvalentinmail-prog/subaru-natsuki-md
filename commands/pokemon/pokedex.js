import { findPokemon, nextOf } from '../../lib/pokedex.js'

const STAT_LABELS = { hp: 'HP', atk: 'Ataque', def: 'Defensa', spa: 'Ataque Esp.', spd: 'Defensa Esp.', spe: 'Velocidad' }

export default {
  name: 'pokedex',
  alias: ['pokeinfo'],
  usage: '<nombre o número>',
  description: 'Información de un Pokémon (Gen 1–4)',
  async run({ text, reply }) {
    if (!text) return reply('Escribe el nombre o número. Ejemplo: .pokedex pikachu')
    const p = findPokemon(text)
    if (!p) return reply('No encontré ese Pokémon. Solo están los de la Gen 1 a la 4.')

    const stats = Object.entries(STAT_LABELS).map(([k, label]) => `${label} ${p.stats[k]}`).join(' | ')
    let evo = 'No evoluciona'
    const next = nextOf(p)
    if (p.evos.length) evo = `${p.evos.join(', ')}${next?.evoLevel ? ` (nivel ${next.evoLevel})` : ' (por otro método)'}`

    await reply(
      [
        `📖 *#${p.id} ${p.name}*`,
        `┊ ✿ Tipo: ${p.types.join(' / ')}`,
        `┊ ✿ ${stats}`,
        p.prevo ? `┊ ✿ Evoluciona de: ${p.prevo}` : null,
        `┊ ✿ Evolución: ${evo}`,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  },
}
