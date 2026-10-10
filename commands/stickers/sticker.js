import { toStickerWebp } from '../../functions/stickers/webp.js'
import { NEED_IMAGE, getImageBuffer } from '../../lib/media.js'

export default {
  name: 'sticker',
  alias: ['stiker'],
  limit: true,
  description: 'Convierte una imagen en sticker (responde a una imagen o envíala con el comando)',
  async run({ sock, chat, m, reply }) {
    const buf = await getImageBuffer(sock, m)
    if (!buf) return reply(NEED_IMAGE)
    const webp = await toStickerWebp(buf)
    await sock.sendMessage(chat, { sticker: webp }, { quoted: m })
  },
}
