import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, isAdmin, participants }) => {
    if (!m.isGroup) throw '❌ Perintah ini hanya untuk grup.'
    if (!isAdmin) throw '❌ Hanya admin grup yang bisa menggunakan perintah ini.'

    let who, users = global.db.data.users
    
    // 1. Jika ada mention
    if (m.mentionedJid.length) {
        who = m.mentionedJid[0]
    } 
    // 2. Jika reply
    else if (m.quoted) {
        who = m.quoted.sender
    }
    // 3. Jika input nomor
    else if (text) {
        let phoneNumber = text.replace(/\D/g, '')
        if (!phoneNumber) throw 'Format salah. Gunakan: .unbanmember @tag/nomor'
        
        // Cek apakah grup menggunakan LID
        const isLidGroup = participants.some(p => p.id.endsWith('@lid'))
        who = phoneNumber + (isLidGroup ? '@lid' : '@s.whatsapp.net')
    } else {
        throw '❌ Format salah. Gunakan:\n.unbanmember @tag\n.unbanmember 62xxxx\n(atau reply pesan target)'
    }

    // Verifikasi user
    if (!users[who]) throw '❌ Pengguna tidak ditemukan dalam database.'
    if (!users[who].banned) {
        return conn.sendMessage(m.chat, {
            text: `ℹ️ @${who.split('@')[0]} tidak sedang diban.`,
            mentions: [who]
        }, { quoted: m })
    }

    // Proses unban
    users[who].banned = false
    users[who].banReason = ''

    // Kirim notifikasi ke owner
    let owner = '6285795600265@s.whatsapp.net'
    let notif = `✅ *UNBAN MEMBER*\n\n👤 @${who.split('@')[0]}\n📍 Grup: ${m.chat}`
    conn.sendMessage(owner, { text: notif, mentions: [who] })

    // Kirim DM ke user yang diunban
    try {
        await conn.sendMessage(who, { text: '🎉 Selamat! Anda telah di-unban oleh admin grup.' })
    } catch (e) {
        console.log('Gagal mengirim DM', e)
    }

    // Beri tahu di grup
    conn.sendMessage(m.chat, {
        text: `✅ @${who.split('@')[0]} telah di-unban!`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['unbanmember @user/62xxxx']
handler.tags = ['group']
handler.command = /^unbanmember$/i
handler.group = true
handler.admin = true

export default handler