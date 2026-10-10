import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'brathd',
  usage: '<texto>',
  limit: true,
  description: 'Crea un sticker estilo Brat HD (texto)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .brathd hola')
    await sendMakerSticker(sock, chat, m, '/maker/brathd', { text })
  },
}
