import {
  generateMessageIDV2,
  generateWAMessageFromContent,
  jidNormalizedUser,
  proto,
} from '@whiskeysockets/baileys'

/**
 * Envía un texto con un botón debajo que abre una lista desplegable (single_select).
 * Límites de WhatsApp: el cuerpo máx. 1024 caracteres, el botón 20, máx. 10 filas en total.
 *
 * @param {object} sock
 * @param {string} chat             JID de destino
 * @param {object} opts
 * @param {string} opts.body        texto principal
 * @param {string} [opts.footer]    texto pequeño de pie
 * @param {string} opts.buttonText  texto del botón que abre la lista
 * @param {string} opts.sectionTitle título de la sección
 * @param {Array<{id:string,title:string,description?:string}>} opts.rows filas (máx. 10)
 */
export async function sendListButton(sock, chat, { body, footer, buttonText, sectionTitle, rows }) {
  if (rows.length > 10) throw new Error('WhatsApp permite máximo 10 filas en una lista')

  const params = {
    title: buttonText,
    sections: [
      {
        title: sectionTitle,
        rows: rows.map(r => ({
          title: r.title,
          description: r.description || '',
          id: r.id,
        })),
      },
    ],
  }

  const message = generateWAMessageFromContent(
    chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: body }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || '' }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify(params) }],
            }),
          }),
        },
      },
    },
    { userJid: jidNormalizedUser(sock.user.id), messageId: generateMessageIDV2(sock.user.id) },
  )

  await sock.relayMessage(chat, message.message, { messageId: message.key.id })
}
