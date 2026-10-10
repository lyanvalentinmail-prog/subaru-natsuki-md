import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import qrcode from 'qrcode-terminal'
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import config from '../config.js'
import { logger, log } from './logger.js'
import { handleMessages } from './handler.js'
import { sleep, onlyDigits } from './utils.js'

// Estado de la conexión entre reintentos
let method = null // 'qr' | 'pairing'
let phone = null // número para el código de emparejamiento
let retries = 0

/** Pregunta algo por consola y cierra la interfaz */
async function ask(question) {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    return (await rl.question(question)).trim()
  } finally {
    rl.close()
  }
}

/** Pide al usuario cómo quiere vincular el bot (si aún no hay sesión) */
async function chooseConnectionMethod() {
  // Opción sin interacción: BOT_CONNECTION=qr|pairing  y  BOT_NUMBER=5491112345678
  if (process.env.BOT_CONNECTION) method = process.env.BOT_CONNECTION === 'pairing' ? 'pairing' : 'qr'
  if (!method) {
    if (!stdin.isTTY) throw new Error('No hay terminal interactiva. Define BOT_CONNECTION=qr o BOT_CONNECTION=pairing.')
    console.log('\n¿Cómo quieres conectar el bot?')
    console.log('  1) Código QR')
    console.log('  2) Código de emparejamiento (pairing code)\n')
    const answer = await ask('Elige una opción [1/2]: ')
    method = answer === '2' ? 'pairing' : 'qr'
  }

  if (method === 'pairing' && !phone) {
    const input = process.env.BOT_NUMBER || (stdin.isTTY ? await ask('Número de WhatsApp con código de país, sin + (ej. 5491112345678): ') : '')
    phone = onlyDigits(input)
    if (phone.length < 8 || phone.length > 15) throw new Error('Número inválido. Usa solo dígitos con código de país.')
  }
  console.log(method === 'pairing' ? '→ Conexión por código de emparejamiento.' : '→ Conexión por código QR.')
}

/** Versión de WhatsApp Web (si falla la consulta, Baileys usa la versión por defecto) */
async function getWaVersion() {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    if (!isLatest) log.warn('No se pudo confirmar la última versión de WhatsApp Web; se usa:', version.join('.'))
    return version
  } catch {
    return undefined
  }
}

/** Crea el socket y registra todos los eventos */
async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir)
  const version = await getWaVersion()

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: Browsers.ubuntu(config.browserName),
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    getMessage: async () => undefined,
  })

  let pairingRequested = false

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async update => {
    const { connection, lastDisconnect, qr } = update

    // --- Vinculación por QR ---
    if (qr && method === 'qr') {
      console.log('\nEscanea este QR en WhatsApp > Dispositivos vinculados > Vincular un dispositivo:\n')
      qrcode.generate(qr, { small: true })
    }

    // --- Vinculación por código de emparejamiento ---
    if (method === 'pairing' && !state.creds.registered && !pairingRequested && (connection === 'connecting' || qr)) {
      pairingRequested = true
      await sleep(3000) // Baileys necesita un momento antes de pedir el código
      try {
        const code = await sock.requestPairingCode(phone)
        const pretty = code?.match(/.{1,4}/g)?.join('-') || code
        console.log('\n════════════════════════════════')
        console.log(`  CÓDIGO DE EMPAREJAMIENTO: ${pretty}`)
        console.log('════════════════════════════════')
        console.log('WhatsApp > Dispositivos vinculados > Vincular dispositivo > Vincular con el número de teléfono.\n')
      } catch (err) {
        log.error('No se pudo solicitar el código de emparejamiento:', err.message)
      }
    }

    if (connection === 'open') {
      retries = 0
      const number = sock.user?.id?.split(':')[0]?.split('@')[0] || 'desconocido'
      console.log(`✅ ${config.botName} conectado como ${number}`)
      return
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const reason = lastDisconnect?.error?.message || 'desconocido'
      log.warn(`Conexión cerrada (código ${statusCode}): ${reason}`)

      if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.badSession) {
        console.log('Sesión cerrada o inválida. Borrando sesión y volviendo a vincular...')
        fs.rmSync(config.sessionDir, { recursive: true, force: true })
        method = null
        phone = null
        await chooseConnectionMethod()
        return setTimeout(connect, 1000)
      }

      if (statusCode === DisconnectReason.connectionReplaced) {
        log.error('Se abrió otra sesión con este número. Cierra la otra sesión y vuelve a iniciar el bot.')
        process.exit(1)
      }

      // Reintenta siempre (ej. si Termux pierde internet), con espera creciente de hasta 60 s.
      // restartRequired (515) es normal justo después de vincular.
      retries++
      const delay = Math.min(3000 * retries, 60000)
      console.log(`Reconectando en ${delay / 1000} s (intento ${retries})...`)
      setTimeout(connect, delay)
    }
  })

  sock.ev.on('messages.upsert', data => handleMessages(sock, data))
}

/** true si ya existe una sesión vinculada en la carpeta de sesión */
function isRegistered() {
  try {
    const creds = JSON.parse(fs.readFileSync(path.join(config.sessionDir, 'creds.json'), 'utf8'))
    return creds.registered === true
  } catch {
    return false
  }
}

/** Punto de entrada: elige método si hace falta y conecta */
export async function startConnection() {
  // Si el número ya está vinculado (creds.registered), no se pregunta nada
  if (!isRegistered()) await chooseConnectionMethod()
  else method = method || 'qr'
  await connect()
}
