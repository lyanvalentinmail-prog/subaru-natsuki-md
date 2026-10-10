import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from '../config.js'

// Imágenes de los Pokémon: assets/pokemon/<número>.png (sin API)
const DIR = path.join(ROOT, 'assets', 'pokemon')
const cache = new Map()

/** Devuelve el PNG del Pokémon con ese número, o null si no existe */
export function loadSprite(id) {
  if (cache.has(id)) return cache.get(id)
  const file = path.join(DIR, `${id}.png`)
  const buf = fs.existsSync(file) ? fs.readFileSync(file) : null
  cache.set(id, buf)
  return buf
}
