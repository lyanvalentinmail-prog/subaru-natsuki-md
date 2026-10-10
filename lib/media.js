import { downloadMediaMessage, getContentType, normalizeMessageContent } from '@whiskeysockets/baileys'
import { getContextInfo } from './utils.js'
import { logger } from './logger.js'

/**
 * Busca una imagen en el mensaje actual o en el mensaje respondido.
 * Devuelve un Buffer con la imagen, o null si no hay ninguna.
 */
export async function getImageBuffer(sock, m) {
  if (getContentType(normalizeMessageContent(m.message)) === 'imageMessage') {
    return download(sock, m.key, m.message)
  }
  const ctx = getContextInfo(m.message)
  if (ctx?.quotedMessage && getContentType(normalizeMessageContent(ctx.quotedMessage)) === 'imageMessage') {
    const key = { remoteJid: m.key.remoteJid, id: ctx.stanzaId, participant: ctx.participant, fromMe: false }
    return download(sock, key, ctx.quotedMessage)
  }
  return null
}

async function download(sock, key, message) {
  return downloadMediaMessage({ key, message }, 'buffer', {}, { logger, reuploadRequest: sock.updateMediaMessage })
}

export const NEED_IMAGE = 'Responde a una imagen o envía una imagen junto con el comando.'

/** Envía una imagen como respuesta al mensaje original */
export const sendImage = (sock, chat, m, buffer, caption) =>
  sock.sendMessage(chat, { image: buffer, ...(caption ? { caption } : {}) }, { quoted: m })
