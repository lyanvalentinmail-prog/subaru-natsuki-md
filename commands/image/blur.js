import { blur } from '../../lib/image.js'
import { NEED_IMAGE, getImageBuffer, sendImage } from '../../lib/media.js'

export default {
  name: 'blur',
  usage: '[intensidad 1-30]',
  limit: true,
  description: 'Desenfoca una imagen (responde a una imagen o envíala con el comando)',
  async run({ sock, chat, m, args, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    await sendImage(sock, chat, m, await blur(buf, parseInt(args[0], 10) || 8))
  },
}
