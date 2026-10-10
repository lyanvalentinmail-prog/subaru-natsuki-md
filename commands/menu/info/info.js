import fs from 'node:fs'
import path from 'node:path'
import config, { ROOT } from '../../../config.js'
import { commandList } from '../../../lib/loader.js'

export default {
  name: 'info',
  alias: ['infobot'],
  description: 'Información del bot',
  async run({ reply }) {
    let version = '1.0.0'
    try {
      version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version
    } catch {}
    await reply(
      [
        `🤖 *${config.botName}*`,
        `┊ ✿ Versión: ${version}`,
        `┊ ✿ Node.js: ${process.version}`,
        `┊ ✿ Sistema: ${process.platform} (${process.arch})`,
        `┊ ✿ Prefijos: ${config.prefixes.join(' ')}`,
        `┊ ✿ Comandos cargados: ${commandList.length}`,
      ].join('\n'),
    )
  },
}
