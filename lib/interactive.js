import {
  generateMessageIDV2,
  generateWAMessageFromContent,
  isJidGroup,
  jidNormalizedUser,
  prepareWAMessageMedia,
  proto,
} from '@whiskeysockets/baileys'

/**
 * Nodos binarios que WhatsApp espera para que se vean los botones interactivos
 * (Baileys no los añade por sí solo en la versión 7 rc). En chats privados se añade "bot".
 */
function interactiveNodes(chat) {
  const biz = {
    tag: 'biz',
    attrs: {},
    content: [
      {
        tag: 'interactive',
        attrs: { type: 'native_flow', v: '1' },
        content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }],
      },
    ],
  }
  return isJidGroup(chat) ? [biz] : [biz, { tag: 'bot', attrs: { biz_bot: '1' } }]
}

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
 * @param {Buffer} [opts.image]    imagen (banner) que se muestra arriba del texto
 */
export async function sendListButton(sock, chat, { body, footer, buttonText, sectionTitle, rows, image }) {
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

  // Cabecera con imagen (banner): se sube a WhatsApp y se adjunta como header
  let header
  if (image) {
    const media = await prepareWAMessageMedia({ image }, { upload: sock.waUploadToServer })
    header = proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: true,
      imageMessage: media.imageMessage,
    })
  }

  // Sin viewOnce: ese envoltorio impide que algunas cuentas vean el botón
  const message = generateWAMessageFromContent(
    chat,
    {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        ...(header ? { header } : {}),
        body: proto.Message.InteractiveMessage.Body.create({ text: body }),
        ...(footer ? { footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }) } : {}),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify(params) }],
        }),
      }),
    },
    { userJid: jidNormalizedUser(sock.user.id), messageId: generateMessageIDV2(sock.user.id) },
  )

  await sock.relayMessage(chat, message.message, {
    messageId: message.key.id,
    additionalNodes: interactiveNodes(chat),
  })
}
