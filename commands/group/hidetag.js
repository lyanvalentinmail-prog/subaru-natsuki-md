export default {
  name: 'hidetag',
  alias: ['ht'],
  usage: '<texto>',
  group: true,
  admin: true,
  description: 'Envía un mensaje mencionando a todos sin mostrar la lista',
  async run({ sock, chat, m, text, groupMetadata }) {
    if (!text) return
    const mentions = groupMetadata.participants.map(p => p.phoneNumber || p.id)
    await sock.sendMessage(chat, { text, mentions }, { quoted: m })
  },
}
