import os from 'node:os'
import { commandList } from '../../lib/loader.js'
import { allUsers } from '../../lib/db.js'

const mb = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default {
  name: 'status',
  alias: ['estado'],
  owner: true,
  description: 'Estado del bot: memoria, sistema y usuarios',
  async run({ reply }) {
    const mem = process.memoryUsage()
    await reply(
      [
        '📊 *Estado del bot*',
        `┊ ✿ Memoria del bot: ${mb(mem.rss)}`,
        `┊ ✿ Memoria libre del sistema: ${mb(os.freemem())} de ${mb(os.totalmem())}`,
        `┊ ✿ Sistema: ${os.type()} ${os.release()} (${os.arch()})`,
        `┊ ✿ CPU: ${os.cpus()[0]?.model || 'desconocida'} (${os.cpus().length} núcleos)`,
        `┊ ✿ Tiempo activo: ${Math.floor(process.uptime())} s`,
        `┊ ✿ Usuarios registrados: ${allUsers().length}`,
        `┊ ✿ Comandos cargados: ${commandList.length}`,
      ].join('\n'),
    )
  },
}
