import { readLogTail } from '../../lib/logger.js'

export default {
  name: 'logs',
  alias: ['log'],
  owner: true,
  description: 'Muestra las últimas líneas del registro del bot',
  async run({ reply }) {
    const tail = readLogTail(20)
    if (!tail) return reply('Todavía no hay registros.')
    await reply('```\n' + tail.slice(-3500) + '\n```')
  },
}
