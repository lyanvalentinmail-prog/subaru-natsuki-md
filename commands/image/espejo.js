import { mirror } from '../../lib/image.js'
import { NEED_IMAGE, getImageBuffer, sendImage } from '../../lib/media.js'

export default {
  name: 'espejo',
  alias: ['mirror'],
  limit: true,
  description: 'Voltea una imagen en horizontal',
  async run({ sock, chat, m, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    await sendImage(sock, chat, m, await mirror(buf))
  },
}
