import config from '../../../config.js'

export default {
  name: 'owner',
  alias: ['creador', 'dueño'],
  description: 'Contacto del owner del bot',
  async run({ reply }) {
    if (!config.owners.length) return reply('No hay owner configurado todavía.')
    const lines = config.owners.map((n, i) => `┊ ✿ Owner ${i + 1}: https://wa.me/${n}`)
    await reply(['👑 *Owner del bot*', ...lines].join('\n'))
  },
}
