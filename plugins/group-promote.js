import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants, text }) => {
  let users = []

  // 1. Jika mention
  if (m.mentionedJid.length) {
    users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
  }

  // 2. Jika reply
  else if (m.quoted) {
    users = [m.quoted.sender]
  }

  // 3. Jika input nomor
  else if (text) {
    let number = text.replace(/[^0-9]/g, '')
    if (!number) throw 'Nomor tidak valid.'
    users = [`${number}@s.whatsapp.net`]
  }

  // 4. Tidak ada input
  else {
    throw 'Tag, reply, atau tulis nomor yang ingin di-promote.\n\nContoh:\n.promote @tag\n.promote 628xxxx\n(promote dengan reply pesan)'
  }

  let promoteSuccess = []

  for (let user of users) {
    if (user.endsWith('@s.whatsapp.net')) {
      const participant = participants.find(v => areJidsSameUser(v.id, user))
      if (!participant?.admin) {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
        promoteSuccess.push(user)
        await delay(1000)
      }
    }
  }

  if (promoteSuccess.length) {
    let teks = `✅ *Sukses Promote Admin:*\n${promoteSuccess.map(u => `• @${u.split('@')[0]}`).join('\n')}`
    
    // Kirim sebagai reply ke pesan utama, sambil tag user yang di-promote
    await conn.sendMessage(m.chat, {
      text: teks,
      mentions: promoteSuccess
    }, { quoted: m })
  } else {
    m.reply('⚠️ Tidak ada yang bisa dipromote.')
  }
}

handler.help = ['promote @tag / reply / nomor']
handler.tags = ['group']
handler.command = /^(promote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))