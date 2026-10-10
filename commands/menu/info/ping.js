export default {
  name: 'ping',
  description: 'Mide la velocidad de respuesta del bot',
  async run({ m, reply }) {
    // Tiempo entre que WhatsApp entregó el mensaje y el bot lo procesó
    const arrived = Number(m.messageTimestamp) * 1000
    const delay = arrived ? Math.max(Date.now() - arrived, 0) : 0
    await reply(`🏓 *Pong!*\n┊ ✿ Respuesta: ${delay} ms`)
  },
}
