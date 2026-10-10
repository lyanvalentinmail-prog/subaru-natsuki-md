import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'brat',
  usage: '<texto>',
  limit: true,
  description: 'Crea un sticker estilo Brat (texto)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .brat hola')
    await sendMakerSticker(sock, chat, m, '/maker/brat', { text })
  },
}
