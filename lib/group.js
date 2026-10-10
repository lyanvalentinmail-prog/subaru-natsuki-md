import { jidToNumber } from './utils.js'

/** Busca al participante del grupo por número. Devuelve su JID tal como lo usa el grupo, o null */
export function findParticipant(groupMetadata, number) {
  const p = groupMetadata?.participants?.find(
    x => jidToNumber(x.id) === number || (x.phoneNumber && jidToNumber(x.phoneNumber) === number),
  )
  return p ? p.id : null
}

/** true si el número es admin o superadmin del grupo */
export function isAdminNumber(groupMetadata, number) {
  const p = groupMetadata?.participants?.find(
    x => jidToNumber(x.id) === number || (x.phoneNumber && jidToNumber(x.phoneNumber) === number),
  )
  return !!p && (p.admin === 'admin' || p.admin === 'superadmin')
}
