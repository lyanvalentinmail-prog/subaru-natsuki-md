import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Raíz del proyecto (funciona igual en Termux y en cualquier otra máquina)
export const ROOT = path.dirname(fileURLToPath(import.meta.url))

export default {
  botName: 'Subaru Natsuki - MD',

  // Prefijos aceptados para los comandos (ej. .menu, /menu, !menu)
  prefixes: ['.', '/', '!'],

  // Números con dueño del bot (solo dígitos, con código de país).
  // Se pueden definir aquí o con la variable de entorno OWNER_NUMBER="5491112345678,5491198765432"
  owners: (process.env.OWNER_NUMBER || '')
    .split(',')
    .map(n => n.replace(/\D/g, ''))
    .filter(Boolean),

  // Carpeta donde se guarda la sesión de WhatsApp (no subir a GitHub)
  sessionDir: path.join(ROOT, 'session'),

  // Archivo JSON con usuarios (límite, XP, premium...). No subir a GitHub
  databaseFile: path.join(ROOT, 'database', 'users.json'),

  // Límite de uso diario/base por usuario (símbolo Ⓛ)
  defaultLimit: 20,

  // Navegador que se muestra en "Dispositivos vinculados"
  browserName: 'Chrome',

  // Mensajes de respuesta del sistema de permisos
  msg: {
    owner: '⛔ Este comando es solo para el *Owner* (Ⓞ).',
    admin: '⛔ Este comando es solo para los *Admins* del grupo (Ⓐ).',
    botAdmin: '⛔ Necesito ser *Admin* del grupo para usar este comando.',
    group: '⛔ Este comando solo funciona en *grupos*.',
    private: '⛔ Este comando solo funciona en *chat privado*.',
    premium: '⛔ Este comando es solo para usuarios *Premium* (Ⓟ).',
    limit: '⛔ Te quedaste sin *límite* (Ⓛ). Vuelve más tarde o hazte Premium.',
    banned: '⛔ Estás baneado de este bot.',
    error: '❌ Ocurrió un error al ejecutar el comando.',
  },
}
