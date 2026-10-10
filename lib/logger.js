import fs from 'node:fs'
import path from 'node:path'
import pino from 'pino'
import { ROOT } from '../config.js'

// Logs de Baileys silenciados (solo errores graves)
export const logger = pino({ level: 'silent' })

// Registro en archivo (para el comando de panel .logs). Se guarda en logs/bot.log
const LOG_DIR = path.join(ROOT, 'logs')
export const LOG_FILE = path.join(LOG_DIR, 'bot.log')
const MAX_BYTES = 1_000_000

const fmt = a =>
  a instanceof Error ? a.stack || a.message : typeof a === 'object' ? JSON.stringify(a) : String(a)

function write(level, args) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true })
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_BYTES) {
      fs.renameSync(LOG_FILE, LOG_FILE + '.old')
    }
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} [${level}] ${args.map(fmt).join(' ')}\n`)
  } catch {
    // Si no se puede escribir el archivo, el log sigue saliendo por consola
  }
}

export const log = {
  info: (...a) => {
    console.log('[INFO]', ...a)
    write('INFO', a)
  },
  warn: (...a) => {
    console.warn('[WARN]', ...a)
    write('WARN', a)
  },
  error: (...a) => {
    console.error('[ERROR]', ...a)
    write('ERROR', a)
  },
}

/** Últimas N líneas del registro */
export function readLogTail(lines = 20) {
  if (!fs.existsSync(LOG_FILE)) return ''
  return fs.readFileSync(LOG_FILE, 'utf8').trimEnd().split('\n').slice(-lines).join('\n')
}
