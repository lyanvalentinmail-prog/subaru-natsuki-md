import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'attp',
  usage: '<texto>',
  limit: true,
  description: 'Crea un sticker de texto animado (ATTP)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .attp hola')
    await sendMakerSticker(sock, chat, m, '/maker/attp', { text })
  },
}
