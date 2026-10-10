import { pixelate } from '../../lib/image.js'
import { NEED_IMAGE, getImageBuffer, sendImage } from '../../lib/media.js'

export default {
  name: 'imgpix',
  alias: ['pixelar'],
  usage: '[tamaño 2-60]',
  limit: true,
  description: 'Pixela una imagen',
  async run({ sock, chat, m, args, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    await sendImage(sock, chat, m, await pixelate(buf, parseInt(args[0], 10) || 12))
  },
}
