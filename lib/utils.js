import { normalizeMessageContent, getContentType } from '@whiskeysockets/baileys'

/** Deja solo los dígitos de un texto */
export const onlyDigits = (text = '') => String(text).replace(/\D/g, '')

/** "5491112345678@s.whatsapp.net" -> "5491112345678" */
export const jidToNumber = (jid = '') => String(jid).split('@')[0].split(':')[0]

/** Extrae el texto de cualquier tipo de mensaje (texto, caption, botones, listas) */
export function getMessageText(message) {
  if (!message) return ''
  const msg = normalizeMessageContent(message)
  const type = getContentType(msg)
  switch (type) {
    case 'conversation':
      return msg.conversation || ''
    case 'extendedTextMessage':
      return msg.extendedTextMessage?.text || ''
    case 'imageMessage':
    case 'videoMessage':
    case 'documentMessage':
      return msg[type]?.caption || ''
    case 'buttonsResponseMessage':
      return msg.buttonsResponseMessage?.selectedButtonId || ''
    case 'listResponseMessage':
      return msg.listResponseMessage?.singleSelectReply?.selectedRowId || ''
    case 'templateButtonReplyMessage':
      return msg.templateButtonReplyMessage?.selectedId || ''
    case 'interactiveResponseMessage': {
      // Respuesta de un botón/lista interactiva: el id va dentro de paramsJson
      const params = msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
      try {
        return JSON.parse(params || '{}').id || ''
      } catch {
        return ''
      }
    }
    default:
      return ''
  }
}

/** Tiempo de espera simple (ms) */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/** Tipos de mensaje que pueden tener contextInfo (respuestas, menciones) */
const CONTEXT_TYPES = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']

/** Devuelve el contextInfo de un mensaje (o null) */
export function getContextInfo(message) {
  if (!message) return null
  const msg = normalizeMessageContent(message)
  const type = getContentType(msg)
  if (CONTEXT_TYPES.includes(type)) return msg[type]?.contextInfo || null
  return null
}

/**
 * Obtiene el usuario objetivo de un comando: la primera mención, la persona
 * respondida o el número escrito como argumento. Devuelve el número (solo dígitos) o null.
 */
export function resolveTargetNumber(m, args = []) {
  const ctx = getContextInfo(m.message)
  const mentioned = ctx?.mentionedJid?.[0]
  if (mentioned) return jidToNumber(mentioned)
  if (ctx?.participant && ctx?.quotedMessage) return jidToNumber(ctx.participant)
  const digits = onlyDigits(args[0] || '')
  return digits.length >= 8 ? digits : null
}
