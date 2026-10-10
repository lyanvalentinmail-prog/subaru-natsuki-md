import { RESTART_CODE } from '../../lib/restart.js'

export default {
  name: 'restart',
  alias: ['reiniciar'],
  owner: true,
  description: 'Reinicia el bot',
  async run({ reply }) {
    await reply('♻️ Reiniciando el bot...')
    // index.js detecta este código y vuelve a iniciar el proceso
    setTimeout(() => process.exit(RESTART_CODE), 1000)
  },
}
