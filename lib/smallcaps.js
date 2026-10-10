// Conversión entre texto normal y letras pequeñas (small caps) para mostrar comandos y estados.
const MAP = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
  k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ',
  u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
}
const REVERSE = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]))

/** "ping" -> "ᴘɪɴɢ" */
export const toSmallCaps = text => [...String(text).toLowerCase()].map(ch => MAP[ch] ?? ch).join('')

/** "ᴘɪɴɢ" -> "ping" (para que un comando escrito en small caps también funcione) */
export const fromSmallCaps = text => [...String(text)].map(ch => REVERSE[ch] ?? ch).join('').toLowerCase()
