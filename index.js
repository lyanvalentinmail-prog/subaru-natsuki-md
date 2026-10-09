import { startConnection } from './lib/connection.js'
import { loadCommands } from './lib/loader.js'
import { loadDb } from './lib/db.js'
import config from './config.js'
import { log } from './lib/logger.js'

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

main().catch(err => {
  log.error(err.message || err)
  process.exit(1)
})
