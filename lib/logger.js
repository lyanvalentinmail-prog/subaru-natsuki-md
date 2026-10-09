import pino from 'pino'

// Logs de Baileys silenciados (solo errores graves). Los mensajes del bot se muestran con console.
export const logger = pino({ level: 'silent' })

export const log = {
  info: (...a) => console.log('[INFO]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERROR]', ...a),
}
