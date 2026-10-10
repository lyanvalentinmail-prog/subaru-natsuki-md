export default {
  name: 'add',
  alias: ['agregar'],
  usage: '<número>',
  group: true,
  admin: true,
  botAdmin: true,
  description: 'Agrega un número al grupo',
  async run({ sock, chat, args, reply }) {
    const digits = (args[0] || '').replace(/\D/g, '')
    if (digits.length < 8) return reply('Escribe el número con código de país. Ejemplo: .add 5491112345678')
    const [res] = await sock.groupParticipantsUpdate(chat, [`${digits}@s.whatsapp.net`], 'add')
    if (res?.status && res.status !== '200') return reply('No se pudo agregar. Puede que el número tenga la privacidad activada.')
    await reply(`✅ ${digits} fue agregado al grupo.`)
  },
}
