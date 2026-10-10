export default {
  name: 'linkgc',
  alias: ['link'],
  group: true,
  admin: true,
  botAdmin: true,
  description: 'Muestra el enlace de invitación del grupo',
  async run({ sock, chat, reply }) {
    const code = await sock.groupInviteCode(chat)
    await reply(`🔗 https://chat.whatsapp.com/${code}`)
  },
}
