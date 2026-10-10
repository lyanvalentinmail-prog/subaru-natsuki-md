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
