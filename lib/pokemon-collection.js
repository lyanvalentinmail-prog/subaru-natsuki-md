import { byId, power } from './pokedex.js'

export const MAX_COLLECTION = 100

/** Colección del usuario (se crea si no existe) */
export function collectionOf(user) {
  user.pokemones ||= []
  return user.pokemones
}

/** Nombre y estadísticas de una entrada de la colección */
export function describe(entry) {
  const p = byId(entry.id)
  return `${p?.name || '#' + entry.id} (Nv ${entry.level})`
}

/** Entrada de la colección con más poder, o null */
export function strongest(collection) {
  let best = null
  for (const e of collection) {
    const p = byId(e.id)
    if (!p) continue
    if (!best || power(p, e.level) > best.score) best = { entry: e, score: power(p, e.level) }
  }
  return best?.entry || null
}
