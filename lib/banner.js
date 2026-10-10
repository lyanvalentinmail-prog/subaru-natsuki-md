import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from '../config.js'

// Banner del menú: coloca la imagen en assets/banner.jpg (o .png)
const CANDIDATES = ['banner.jpg', 'banner.jpeg', 'banner.png'].map(f => path.join(ROOT, 'assets', f))

let cached
/** Devuelve el banner como Buffer, o null si no existe el archivo */
export function loadBanner() {
  if (cached !== undefined) return cached
  const file = CANDIDATES.find(f => fs.existsSync(f))
  cached = file ? fs.readFileSync(file) : null
  return cached
}
