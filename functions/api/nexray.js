// Cliente de la API de Nexray (categoría maker). Requiere internet; no se usa en las funciones sin API.
const BASE = 'https://api.nexray.eu.cc'
const TIMEOUT_MS = 90_000
const FILE_RE = /\.(png|jpe?g|webp|gif|mp4)(\?|$)/i

/** Busca la URL del archivo dentro de una respuesta JSON */
function findUrl(obj, depth = 0) {
  if (!obj || depth > 4) return null
  if (typeof obj === 'string') return /^https?:\/\//.test(obj) ? obj : null
  if (typeof obj !== 'object') return null
  const values = Object.values(obj)
  const withExt = values.find(v => typeof v === 'string' && /^https?:\/\//.test(v) && FILE_RE.test(v))
  if (withExt) return withExt
  for (const v of values) {
    const found = findUrl(v, depth + 1)
    if (found) return found
  }
  return null
}

/**
 * Pide un archivo a Nexray (ej. '/maker/ttp', { text: 'hola' }).
 * Devuelve un Buffer con la imagen o el video, sea que la API responda el archivo
 * directamente o un JSON con su URL.
 */
export async function nexrayFile(endpoint, params = {}) {
  const url = new URL(endpoint, BASE)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`Nexray respondió ${res.status}`)

  const type = res.headers.get('content-type') || ''
  if (!type.includes('json')) return Buffer.from(await res.arrayBuffer())

  const link = findUrl(await res.json())
  if (!link) throw new Error('Nexray no devolvió ningún archivo')
  const file = await fetch(link, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!file.ok) throw new Error(`No se pudo descargar el archivo (${file.status})`)
  return Buffer.from(await file.arrayBuffer())
}
