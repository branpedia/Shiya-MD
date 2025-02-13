import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let pp = './src/avatar_contact.png' // Default image
  
  try {
    // Coba ambil gambar profil dengan kualitas asli (non-thumbnail)
    pp = await conn.profilePictureUrl(who, 'image', { thumbnail: false })
  } catch (e) {
    // Jika gagal, coba ambil versi biasa
    try {
      pp = await conn.profilePictureUrl(who, 'image')
    } catch (e) {
      pp = './src/avatar_contact.png' // Tetap gunakan default jika masih gagal
    }
  }

  let { name, limit, exp, lastclaim, registered, regTime, age, level, role } = global.db.data.users[who]
  let { min, xp, max } = xpRange(level, global.multiplier)
  let username = conn.getName(who)
  let math = max - xp
  let premium = global.db.data.users[who].premiumTime
  let prems = `${premium > 0 ? 'Yes' : 'No'}`
  let str = `
╭─────「 *PROFILE* 」
│ • Name: ${username} ${registered ? '(' + name + ') ' : ''}
│ • Tag: @${who.replace(/@.+/, '')}
│ • Number: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
│ • Link: https://wa.me/${who.split`@`[0]}
│ • Age: ${registered ? age : '-'}
│ • Exp: ${exp} (${exp - min}/${xp})
│ • Level: ${level}
│ • Role: ${role}
│ • Limit: ${limit}
│ • Registered: ${registered ? 'Yes (' + new Date(regTime).toLocaleDateString() + ')' : 'No'}
│ • Premium: ${prems}
╰──────────────`.trim()

  let mentionedJid = [who]
  
  conn.sendMessage(m.chat, { 
    image: { url: pp },
    caption: str,
    mentions: [...mentionedJid, m.sender]
  }, { quoted: m })
}

handler.help = ['profile [@user]']
handler.tags = ['exp']
handler.command = /^profile$/i

export default handler