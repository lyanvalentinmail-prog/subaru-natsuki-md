import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { startConnection } from './lib/connection.js'
import { loadCommands } from './lib/loader.js'
import { loadDb } from './lib/db.js'
import { RESTART_CODE } from './lib/restart.js'
import config from './config.js'
import { log } from './lib/logger.js'

// El proceso principal solo vigila al bot: si el bot pide reinicio (.restart), lo vuelve a lanzar.
// Al primer arranque, la sesión y los mensajes viven en el proceso hijo, que hereda la terminal.
function supervise() {
  const run = () => {
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url)], {
      stdio: 'inherit',
      env: { ...process.env, BOT_CHILD: '1' },
    })
    child.on('exit', code => {
      if (code === RESTART_CODE) {
        console.log('♻️ Reiniciando el bot...')
        run()
      } else {
        process.exit(code ?? 0)
      }
    })
  }
  run()
}

async function main() {
  console.log(`\n🤖 Iniciando ${config.botName}...`)
  loadDb()
  const commands = await loadCommands()
  console.log(`📦 Comandos cargados: ${commands.length}`)
  if (!config.owners.length) log.warn('No hay Owner configurado. Define OWNER_NUMBER o edita config.js.')
  await startConnection()
}

process.on('unhandledRejection', err => log.error('Promesa no controlada:', err))
process.on('uncaughtException', err => log.error('Excepción no controlada:', err))

if (process.env.BOT_CHILD) {
  main().catch(err => {
    log.error(err.message || err)
    process.exit(1)
  })
} else {
  supervise()
}
