import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { Jimp } from 'jimp'
import encode, { init } from '@jsquash/webp/encode.js'

// Conversión local a WebP (sin API ni programas externos; funciona en Termux)
const STICKER_SIZE = 512
const MAX_STICKER_BYTES = 500 * 1024

let ready = null
function ensureEncoder() {
  if (!ready) {
    ready = (async () => {
      const require = createRequire(import.meta.url)
      const dir = path.dirname(require.resolve('@jsquash/webp/package.json'))
      const wasm = await WebAssembly.compile(fs.readFileSync(path.join(dir, 'codec/enc/webp_enc.wasm')))
      await init(wasm)
    })()
  }
  return ready
}

/** Detecta el tipo de archivo por sus primeros bytes */
export function sniffType(buf) {
  const head = buf.toString('latin1', 0, 12)
  if (head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP') return 'webp'
  if (buf[0] === 0x89 && head.slice(1, 4) === 'PNG') return 'png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg'
  if (head.startsWith('GIF8')) return 'gif'
  if (head.slice(4, 8) === 'ftyp') return 'mp4'
  return 'unknown'
}

/** Convierte una imagen a sticker WebP de 512x512 (fondo transparente, sin deformar) */
export async function toStickerWebp(buffer) {
  await ensureEncoder()
  const img = await Jimp.read(buffer) // en GIF toma el primer cuadro
  img.contain({ w: STICKER_SIZE, h: STICKER_SIZE })
  const pixels = { data: new Uint8ClampedArray(img.bitmap.data), width: STICKER_SIZE, height: STICKER_SIZE }
  let out = Buffer.from(await encode(pixels, { quality: 80 }))
  if (out.length > MAX_STICKER_BYTES) out = Buffer.from(await encode(pixels, { quality: 50 }))
  return out
}
