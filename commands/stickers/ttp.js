import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'ttp',
  usage: '<texto>',
  limit: true,
  description: 'Crea un sticker de texto (TTP)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .ttp hola')
    await sendMakerSticker(sock, chat, m, '/maker/ttp', { text })
  },
}
