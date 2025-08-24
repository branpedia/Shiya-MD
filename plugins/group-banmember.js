import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, isAdmin, participants }) => {
    if (!m.isGroup) throw '❌ Perintah ini hanya bisa digunakan dalam grup.'
    if (!isAdmin) throw '❌ Perintah ini hanya untuk admin grup.'

    let who, reason
    let users = global.db.data.users

    // 1. Jika ada mention
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]
        reason = text.replace(/@[0-9]+/g, '').trim() || 'Tidak ada alasan'
    }
    // 2. Jika reply
    else if (m.quoted) {
        who = m.quoted.sender
        reason = text || 'Tidak ada alasan'
    }
    // 3. Jika input nomor
    else if (text) {
        let parts = text.split(' ')
        let phoneNumber = parts[0].replace(/[^0-9]/g, '')
        if (!phoneNumber) throw 'Format salah. Gunakan: .banmember @tag/nomor alasan'
        
        // Cek apakah grup menggunakan LID
        const isLidGroup = participants.some(p => p.id.endsWith('@lid'))
        who = phoneNumber + (isLidGroup ? '@lid' : '@s.whatsapp.net')
        reason = parts.slice(1).join(' ') || 'Tidak ada alasan'
    } else {
        throw '❌ Format salah. Gunakan:\n.banmember @tag alasan\n.banmember 628xxx alasan\n(atau reply pesan dengan .banmember alasan)'
    }

    // Verifikasi user ada di grup
    const participant = participants.find(p => areJidsSameUser(p.id, who))
    if (!participant) throw '❌ User tidak ditemukan di grup ini'

    if (users[who]) {
        users[who].banned = true
        users[who].banReason = reason

        let owner = '6285795600265@s.whatsapp.net'
        let notif = `🚫 *BAN MEMBER*\n\n👤 @${who.split('@')[0]}\n📄 Alasan: ${reason}\n📍 Grup: ${m.chat}`
        conn.sendMessage(owner, { text: notif, mentions: [who] })

        conn.reply(m.chat, `✅ @${who.split('@')[0]} telah dibanned!\n📄 Alasan: ${reason}`, m, { mentions: [who] })
    } else {
        throw '❌ Pengguna tidak ditemukan di database.'
    }
}

handler.help = ['banmember <@tag/nomor> <alasan>']
handler.tags = ['group']
handler.command = /^banmember$/i
handler.group = true
handler.admin = true

export default handler