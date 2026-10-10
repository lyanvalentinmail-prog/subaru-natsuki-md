import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'bratanime',
  usage: '<texto>',
  limit: true,
  description: 'Crea un sticker estilo Brat Anime (texto)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .bratanime hola')
    await sendMakerSticker(sock, chat, m, '/maker/bratanime', { text })
  },
}
