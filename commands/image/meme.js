import { meme } from '../../lib/image.js'
import { NEED_IMAGE, getImageBuffer, sendImage } from '../../lib/media.js'

export default {
  name: 'meme',
  usage: '<texto arriba> | <texto abajo>',
  limit: true,
  description: 'Pone texto arriba y abajo de una imagen',
  async run({ sock, chat, m, text, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    const [top = '', bottom = ''] = text.split('|').map(s => s.trim())
    if (!top && !bottom) return reply('Escribe el texto. Ejemplo: .meme arriba | abajo')
    await sendImage(sock, chat, m, await meme(buf, top, bottom))
  },
}
