import config from '../../config.js'
import { allUsers } from '../../lib/db.js'
import { sleep } from '../../lib/utils.js'

export default {
  name: 'bc',
  alias: ['broadcast', 'difusion'],
  usage: '<texto>',
  owner: true,
  description: 'Envía un mensaje a todos los usuarios del bot',
  async run({ sock, text, reply, number }) {
    if (!text) return reply('Escribe el mensaje a enviar. Ejemplo: .bc Hola a todos')
    const users = allUsers().filter(n => n !== number)
    let sent = 0
    for (const n of users) {
      try {
        await sock.sendMessage(`${n}@s.whatsapp.net`, { text: `📣 ${text}\n\n— ${config.botName}` })
        sent++
      } catch {}
      await sleep(1500) // pausa para no ser bloqueado por WhatsApp
    }
    await reply(`📣 Mensaje enviado a ${sent} de ${users.length} usuarios.`)
  },
}
