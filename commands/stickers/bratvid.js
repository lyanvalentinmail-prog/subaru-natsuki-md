import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'bratvid',
  usage: '<texto>',
  limit: true,
  description: 'Crea un video estilo Brat (texto)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .bratvid hola')
    await sendMakerSticker(sock, chat, m, '/maker/bratvid', { text }, { asVideo: true })
  },
}
