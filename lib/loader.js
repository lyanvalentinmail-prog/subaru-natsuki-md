import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT } from '../config.js'
import { log } from './logger.js'

/** Mapa nombre/alias -> comando */
export const commands = new Map()
/** Lista única de comandos cargados */
export const commandList = []

/** Recorre recursivamente una carpeta y devuelve todos los .js */
function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full)
  }
  return files
}

/**
 * Carga todos los comandos de /commands (recursivo).
 * Cada archivo exporta por defecto un objeto:
 *   { name, alias?, usage?, description?, owner?, admin?, botAdmin?, premium?,
 *     limit?, group?, private?, run: async (ctx) => {} }
 * La categoría se toma de la carpeta donde está el archivo (ej. commands/tools/x.js -> "tools").
 */
export async function loadCommands(dir = path.join(ROOT, 'commands')) {
  commands.clear()
  commandList.length = 0

  for (const file of walk(dir)) {
    let cmd
    try {
      const mod = await import(pathToFileURL(file).href)
      cmd = mod.default
    } catch (err) {
      log.error(`No se pudo cargar ${path.relative(ROOT, file)}:`, err.message)
      continue
    }

    if (!cmd || typeof cmd.name !== 'string' || typeof cmd.run !== 'function') {
      log.warn(`Archivo ignorado (no exporta un comando válido): ${path.relative(ROOT, file)}`)
      continue
    }

    const names = [cmd.name, ...(cmd.alias || [])].map(n => n.toLowerCase())
    const dup = names.find(n => commands.has(n))
    if (dup) {
      log.warn(`Comando duplicado "${dup}" en ${path.relative(ROOT, file)}, se omite.`)
      continue
    }

    cmd.category = path.basename(path.dirname(file))
    cmd.file = file
    for (const n of names) commands.set(n, cmd)
    commandList.push(cmd)
  }

  return commandList
}
