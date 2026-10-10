import fs from 'node:fs'
import path from 'node:path'
import config from '../config.js'

// Base de datos sencilla en JSON (sin dependencias nativas, compatible con Termux)
let data = { users: {} }

export function loadDb() {
  try {
    if (fs.existsSync(config.databaseFile)) {
      data = JSON.parse(fs.readFileSync(config.databaseFile, 'utf8'))
      data.users ||= {}
    }
  } catch (err) {
    console.error('[ERROR] No se pudo leer la base de datos, se usará una nueva:', err.message)
    data = { users: {} }
  }
}

export function saveDb() {
  fs.mkdirSync(path.dirname(config.databaseFile), { recursive: true })
  const tmp = config.databaseFile + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, config.databaseFile)
}

/** Fecha de hoy en la zona horaria del bot (AAAA-MM-DD) */
function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: config.timezone }).format(new Date())
}

/** Obtiene (o crea) el registro de un usuario por su número. Reinicia el límite diario. */
export function getUser(number) {
  if (!data.users[number]) {
    data.users[number] = {
      limit: config.defaultLimit,
      limitDate: today(),
      xp: 0,
      premium: false,
      banned: false,
      createdAt: Date.now(),
    }
  }
  const user = data.users[number]
  if (user.limitDate !== today()) {
    user.limit = config.defaultLimit
    user.limitDate = today()
  }
  return user
}

/** Lista de números de todos los usuarios registrados */
export function allUsers() {
  return Object.keys(data.users)
}
