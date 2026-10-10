export default {
  name: 'tagall',
  alias: ['todos', 'invocar'],
  usage: '[texto]',
  group: true,
  admin: true,
  description: 'Menciona a todos los miembros del grupo',
  async run({ sock, chat, m, text, groupMetadata }) {
    const parts = groupMetadata.participants.map(p => p.phoneNumber || p.id)
    const lines = parts.map(jid => `┊ ✿ @${jid.split('@')[0].split(':')[0]}`)
    await sock.sendMessage(
      chat,
      { text: [`📢 *${text || 'Atención a todos'}*`, '', ...lines].join('\n'), mentions: parts },
      { quoted: m },
    )
  },
}
