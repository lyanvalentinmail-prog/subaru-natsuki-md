import { logo } from '../../lib/image.js'
import { sendImage } from '../../lib/media.js'

export default {
  name: 'logo',
  usage: '<texto>',
  limit: true,
  description: 'Crea un logo sencillo con texto',
  async run({ sock, chat, m, text, reply }) {
    if (!text) return reply('Escribe el texto del logo. Ejemplo: .logo Subaru')
    await sendImage(sock, chat, m, await logo(text.slice(0, 40)))
  },
}
