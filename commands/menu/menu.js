import { buildMenu } from '../../lib/menu.js'
import { commandList } from '../../lib/loader.js'

export default {
  name: 'menu',
  alias: ['help', 'ayuda'],
  description: 'Muestra el menú de comandos',
  async run({ reply, user, isOwner, isPremium, prefix }) {
    await reply(buildMenu({ user, isOwner, isPremium, prefix, commandList }))
  },
}
