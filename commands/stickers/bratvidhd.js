import { sendMakerSticker } from '../../functions/stickers/send.js'

export default {
  name: 'bratvidhd',
  usage: '<texto>',
  limit: true,
  description: 'Crea un video estilo Brat HD (texto)',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto. Ejemplo: .bratvidhd hola')
    await sendMakerSticker(sock, chat, m, '/maker/bratvidhd', { text }, { asVideo: true })
  },
}
