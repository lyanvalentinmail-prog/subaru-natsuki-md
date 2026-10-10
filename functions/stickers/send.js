import { nexrayFile } from '../api/nexray.js'
import { sniffType, toStickerWebp } from './webp.js'

/**
 * Pide un archivo a Nexray y lo envía como sticker.
 * Si la API devuelve un video (mp4) y `asVideo` es true, se envía como video.
 */
export async function sendMakerSticker(sock, chat, m, endpoint, params, { asVideo = false } = {}) {
  const buf = await nexrayFile(endpoint, params)
  const type = sniffType(buf)
  if (asVideo && type === 'mp4') {
    return sock.sendMessage(chat, { video: buf, mimetype: 'video/mp4' }, { quoted: m })
  }
  // WebP (incluido animado) se envía tal cual; imágenes, GIF y otros se convierten
  const webp = type === 'webp' ? buf : await toStickerWebp(buf)
  return sock.sendMessage(chat, { sticker: webp }, { quoted: m })
}
