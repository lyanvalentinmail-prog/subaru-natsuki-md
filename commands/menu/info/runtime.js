const format = seconds => {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ')
}

export default {
  name: 'runtime',
  alias: ['uptime'],
  description: 'Tiempo que lleva encendido el bot',
  async run({ reply }) {
    await reply(`⏱️ *Tiempo activo:* ${format(process.uptime())}`)
  },
}
