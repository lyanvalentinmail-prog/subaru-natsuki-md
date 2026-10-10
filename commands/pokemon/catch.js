import { randomPokemon } from '../../lib/pokedex.js'
import { MAX_COLLECTION, collectionOf } from '../../lib/pokemon-collection.js'
import { loadSprite } from '../../lib/sprites.js'

export default {
  name: 'catch',
  alias: ['capturar'],
  limit: true,
  description: 'Captura un Pokémon aleatorio (Gen 1–4) y envía su imagen',
  async run({ sock, chat, m, user, reply }) {
    const list = collectionOf(user)
    if (list.length >= MAX_COLLECTION) {
      return reply(`Tu colección está llena (${MAX_COLLECTION}). Usa .pelea para ganar experiencia.`)
    }
    const p = randomPokemon()
    const level = Math.floor(Math.random() * 10) + 5 // nivel 5 a 14
    list.push({ id: p.id, level, xp: 0 })

    const caption = [
      `🎉 ¡Capturaste a *${p.name}* (Nv ${level})!`,
      `┊ ✿ Tipo: ${p.types.join(' / ')}`,
      '┊ ✿ Usa .pokedex para ver tu colección.',
    ].join('\n')

    const sprite = loadSprite(p.id)
    if (sprite) await sock.sendMessage(chat, { image: sprite, caption }, { quoted: m })
    else await reply(caption)
  },
}
