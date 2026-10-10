# subaru-natsuki-md

![Banner](assets/banner.jpg)

Bot de WhatsApp hecho con **Node.js** y **[Baileys](https://github.com/WhiskeySockets/Baileys)**.
Se conecta con **código QR** o **código de emparejamiento (pairing code)** y está pensado para
ejecutarse en **Termux** (Android) sin dependencias nativas.

> Estado actual: **estructura base lista, con un único comando: `.menu`** (alias `/help`, `/ayuda`).
> El bot conecta, carga comandos de `commands/` automáticamente y aplica permisos; el resto de
> comandos se irán agregando después.

---

## 📱 Instalación en Termux

```bash
# 1. Paquetes necesarios
pkg update && pkg upgrade -y
pkg install -y nodejs-lts git

# 2. Descargar el proyecto
git clone https://github.com/lyanvalentinmail-prog/subaru-natsuki-md.git
cd subaru-natsuki-md

# 3. Instalar dependencias
npm install

# 4. Iniciar el bot
npm start
```

Al iniciar, el bot pregunta:

1. **Cómo conectar**: `1) Código QR` o `2) Código de emparejamiento`.
2. Si eliges emparejamiento: tu número con código de país, sin `+` (ej. `5491112345678`).

Después, en WhatsApp: **Dispositivos vinculados → Vincular un dispositivo**.
- Con QR: escanea el código que aparece en Termux.
- Con código: elige *Vincular con el número de teléfono* e ingresa el código de 8 caracteres que muestra Termux.

Consejo: en Termux usa `termux-wake-lock` para que Android no cierre el bot en segundo plano.

### Conexión sin preguntas (opcional)

```bash
BOT_CONNECTION=pairing BOT_NUMBER=5491112345678 npm start
BOT_CONNECTION=qr npm start
```

---

## ⚙️ Configuración

Edita `config.js`:

| Opción | Descripción |
| --- | --- |
| `botName` | Nombre del bot |
| `prefixes` | Prefijos de comandos (por defecto `.`, `/`, `!`) |
| `owners` | Números Owner (Ⓞ). También puedes usar la variable `OWNER_NUMBER="5491112345678,..."` |
| `defaultLimit` | Límite (Ⓛ) inicial de cada usuario |
| `msg` | Mensajes de error de permisos |

Para definir el Owner sin tocar el código:

```bash
OWNER_NUMBER=5491112345678 npm start
```

---

## 🖼️ Banner del menú

El banner que aparece arriba del `.menu` y en la portada de este README es el archivo `assets/banner.jpg`.
Para cambiarlo, reemplázalo por tu imagen con el mismo nombre.
Si no existe, el menú se envía igual, sin imagen.

---

## 🗂️ Estructura del proyecto

```
subaru-natsuki-md/
├── index.js              # Punto de entrada
├── config.js             # Configuración general
├── lib/
│   ├── connection.js     # Conexión (QR / pairing code) y reconexión
│   ├── handler.js        # Procesa mensajes y aplica permisos
│   ├── loader.js         # Carga automática de comandos desde commands/
│   ├── menu.js           # Plantilla del menú (ESTADÍSTICAS, categorías, etc.)
│   ├── banner.js         # Carga el banner de assets/
│   ├── interactive.js    # Botones y listas (con imagen opcional)
│   ├── db.js             # Base de datos JSON de usuarios
│   ├── utils.js          # Utilidades (texto de mensajes, números, etc.)
│   └── logger.js         # Logs
├── assets/               # Imágenes (banner.jpg)
├── commands/             # Comandos por categoría (se cargan automáticamente)
│   ├── menu/
│   │   └── info/
│   ├── owner/
│   ├── panel/
│   ├── group/
│   ├── tools/
│   ├── search/
│   ├── ai/
│   ├── downloads/
│   ├── stickers/
│   ├── image/
│   ├── audio/
│   ├── anime/
│   ├── fun/
│   ├── games/
│   ├── economy/
│   ├── rpg/
│   └── pokemon/
└── functions/            # Funciones de apoyo para comandos (preferir SIN API)
```

Carpetas que **no se suben a GitHub** (ver `.gitignore`): `node_modules/`, `session/`, `database/`.

---

## 🧩 Cómo se escribirá un comando (para más adelante)

Cada archivo `.js` dentro de `commands/<categoría>/` exporta un objeto. La categoría se toma
del nombre de la carpeta.

```js
// commands/tools/ejemplo.js  (ejemplo, todavía no existe)
export default {
  name: 'ejemplo',          // comando: .ejemplo
  alias: ['ej'],            // alias opcionales
  usage: '<texto>',         // se muestra en el menú
  owner: false,             // Ⓞ solo owner
  admin: false,             // Ⓐ solo admins del grupo
  botAdmin: false,          // el bot debe ser admin
  premium: false,           // Ⓟ solo premium
  limit: false,             // Ⓛ consume 1 de límite
  group: false,             // solo en grupos
  private: false,           // solo en privado
  async run({ reply, text }) {
    await reply(`Dijiste: ${text}`)
  },
}
```

El contexto `run` incluye `sock`, `m`, `chat`, `sender`, `number`, `args`, `text`, `prefix`,
`isGroup`, `isOwner`, `isAdmin`, `isBotAdmin`, `isPremium`, `groupMetadata`, `user` y `reply`.

---

## 🔐 Seguridad

- La carpeta `session/` contiene las credenciales de WhatsApp. **No la compartas.**
- No subas `database/` ni archivos `.env` al repositorio.
