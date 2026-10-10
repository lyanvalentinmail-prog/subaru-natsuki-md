import { HorizontalAlign, Jimp, loadFont, measureTextHeight } from 'jimp'
import { SANS_64_WHITE } from '@jimp/plugin-print/fonts'

// Imágenes más grandes se reducen para que el bot vaya rápido en Termux
const MAX_WIDTH = 1024

async function read(buffer) {
  const img = await Jimp.read(buffer)
  if (img.width > MAX_WIDTH) img.resize({ w: MAX_WIDTH })
  return img
}

const encode = img => img.getBuffer('image/jpeg')

/** Escala de grises */
export async function greyscale(buffer) {
  const img = await read(buffer)
  img.greyscale()
  return encode(img)
}

/** Espejo horizontal */
export async function mirror(buffer) {
  const img = await read(buffer)
  img.flip({ horizontal: true, vertical: false })
  return encode(img)
}

/** Desenfoque (radio 1–30) */
export async function blur(buffer, radius = 8) {
  const img = await read(buffer)
  img.blur(Math.min(Math.max(radius, 1), 30))
  return encode(img)
}

/** Pixelado (tamaño de bloque 2–60) */
export async function pixelate(buffer, size = 12) {
  const img = await read(buffer)
  img.pixelate(Math.min(Math.max(size, 2), 60))
  return encode(img)
}

/** Texto arriba y abajo, estilo meme */
export async function meme(buffer, top, bottom) {
  const img = await read(buffer)
  const font = await loadFont(SANS_64_WHITE)
  const margin = 12
  if (top) {
    img.print({
      font,
      x: 0,
      y: margin,
      text: { text: top.toUpperCase(), alignmentX: HorizontalAlign.CENTER },
      maxWidth: img.width,
    })
  }
  if (bottom) {
    const h = measureTextHeight(font, bottom.toUpperCase(), img.width)
    img.print({
      font,
      x: 0,
      y: Math.max(img.height - h - margin, 0),
      text: { text: bottom.toUpperCase(), alignmentX: HorizontalAlign.CENTER },
      maxWidth: img.width,
    })
  }
  return encode(img)
}

/** Logo sencillo: texto centrado sobre un fondo de color */
export async function logo(text, color = 0x6d28d9ff) {
  const font = await loadFont(SANS_64_WHITE)
  const img = new Jimp({ width: 800, height: 400, color })
  const h = measureTextHeight(font, text, 760)
  img.print({
    font,
    x: 20,
    y: Math.max((img.height - h) / 2, 0),
    text: { text, alignmentX: HorizontalAlign.CENTER },
    maxWidth: 760,
  })
  return encode(img)
}
