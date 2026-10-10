import fs from 'node:fs'
import config from '../../config.js'
import { saveDb } from '../../lib/db.js'

export default {
  name: 'backup',
  alias: ['respaldo'],
  owner: true,
  description: 'Envía una copia de la base de datos de usuarios',
  async run({ sock, chat, m, reply }) {
    saveDb() // asegura que el archivo esté al día
    if (!fs.existsSync(config.databaseFile)) return reply('No hay base de datos para respaldar.')
    const date = new Date().toISOString().slice(0, 10)
    await sock.sendMessage(
      chat,
      {
        document: fs.readFileSync(config.databaseFile),
        mimetype: 'application/json',
        fileName: `users-backup-${date}.json`,
      },
      { quoted: m },
    )
  },
}
