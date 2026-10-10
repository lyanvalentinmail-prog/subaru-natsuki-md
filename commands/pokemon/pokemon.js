import { randomPokemon } from '../../lib/pokedex.js'
import { MAX_COLLECTION, collectionOf } from '../../lib/pokemon-collection.js'

export default {
  name: 'pokemon',
  alias: ['capturar'],
  limit: true,
  description: 'Captura un Pokémon aleatorio (Gen 1–4)',
  async run({ user, reply }) {
    const list = collectionOf(user)
    if (list.length >= MAX_COLLECTION) return reply(`Tu colección está llena (${MAX_COLLECTION}). Usa .pelea para ganar experiencia.`)
    const p = randomPokemon()
    const level = Math.floor(Math.random() * 10) + 5 // nivel 5 a 14
    list.push({ id: p.id, level, xp: 0 })
    await reply(`🎉 ¡Capturaste a *${p.name}* (Nv ${level})!\n┊ ✿ Tipo: ${p.types.join(' / ')}\n┊ ✿ Usa .pokemones para ver tu colección.`)
  },
}
