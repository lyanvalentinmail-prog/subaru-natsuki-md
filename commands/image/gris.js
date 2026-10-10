import { greyscale } from '../../lib/image.js'
import { NEED_IMAGE, getImageBuffer, sendImage } from '../../lib/media.js'

export default {
  name: 'gris',
  alias: ['grey', 'blanconegro'],
  limit: true,
  description: 'Convierte una imagen a escala de grises',
  async run({ sock, chat, m, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    await sendImage(sock, chat, m, await greyscale(buf))
  },
}
