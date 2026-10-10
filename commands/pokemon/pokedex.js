import { findPokemon, nextOf } from '../../lib/pokedex.js'
import { collectionOf, describe } from '../../lib/pokemon-collection.js'

const STAT_LABELS = { hp: 'HP', atk: 'Ataque', def: 'Defensa', spa: 'Ataque Esp.', spd: 'Defensa Esp.', spe: 'Velocidad' }

/** .pokedex (sin nombre): tu colección de Pokémon */
function showCollection(user, reply) {
  const list = collectionOf(user)
  if (!list.length) return reply('Todavía no tienes Pokémon. Usa .catch para capturar uno.')
  const lines = list.slice(0, 50).map((e, i) => `┊ ✿ ${i + 1}. ${describe(e)}`)
  if (list.length > 50) lines.push(`┊ … y ${list.length - 50} más`)
  return reply([`🎒 *Tu Pokédex* (${list.length})`, ...lines, '', '┊ Para evolucionar: .evolucionar <número>'].join('\n'))
}

/** .pokedex <nombre o número>: ficha de una especie (Gen 1–4) */
function showSpecies(query, reply) {
  const p = findPokemon(query)
  if (!p) return reply('No encontré ese Pokémon. Solo están los de la Gen 1 a la 4.')

  const stats = Object.entries(STAT_LABELS).map(([k, label]) => `${label} ${p.stats[k]}`).join(' | ')
  const next = nextOf(p)
  let evo = 'No evoluciona'
  if (p.evos.length) evo = `${p.evos.join(', ')}${next?.evoLevel ? ` (nivel ${next.evoLevel})` : ' (por otro método)'}`

  return reply(
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
}

export default {
  name: 'pokedex',
  alias: ['pokeinfo'],
  usage: '[nombre o número]',
  description: 'Tu colección de Pokémon, o la ficha de un Pokémon si escribes su nombre',
  async run({ user, text, reply }) {
    return text ? showSpecies(text, reply) : showCollection(user, reply)
  },
}
