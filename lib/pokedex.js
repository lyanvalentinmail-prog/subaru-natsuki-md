import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from '../config.js'

// Datos de Pokémon Gen 1–4 guardados en el proyecto (sin API)
export const POKEMON = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'pokemon.json'), 'utf8'))

const normalize = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')

/** Busca por número o por nombre (sin importar mayúsculas, acentos o guiones) */
export function findPokemon(query) {
  const q = String(query || '').trim()
  if (!q) return null
  if (/^\d+$/.test(q)) return POKEMON.find(p => p.id === Number(q)) || null
  const n = normalize(q)
  return POKEMON.find(p => normalize(p.name) === n) || null
}

export const byId = id => POKEMON.find(p => p.id === id) || null

export const randomPokemon = () => POKEMON[Math.floor(Math.random() * POKEMON.length)]

/** Suma de estadísticas base */
export const totalStats = p => Object.values(p.stats).reduce((a, b) => a + b, 0)

/** Poder de combate según estadísticas y nivel */
export const power = (p, level) => totalStats(p) * level

/**
 * Siguiente evolución del Pokémon (o null).
 * En los datos, el nivel de evolución (evoLevel) está en la especie a la que se evoluciona:
 * Charmeleon.evoLevel = 16 significa que Charmander evoluciona a Charmeleon en el nivel 16.
 */
export function nextOf(p) {
  const name = p.evos?.[0]
  return name ? POKEMON.find(x => x.name === name) || null : null
}

/** Especie a la que puede evolucionar ahora con ese nivel, o null */
export function evolutionFor(p, level) {
  const next = nextOf(p)
  if (!next || !next.evoLevel) return null
  return level >= next.evoLevel ? next : null
}

/** Nivel necesario para evolucionar, o null si no evoluciona por nivel */
export const levelToEvolve = p => nextOf(p)?.evoLevel || null

export const pokemonName = id => byId(id)?.name || `#${id}`
