// Code by BranPedia 
// Modified by M.chan
// Updated with LID support + "kick diri sendiri kalau bukan admin" + "bot marah kalau ditarget"

import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants, isAdmin }) => {
    let botJid = conn.user.id

    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, botJid))

    if (m.quoted && m.quoted.sender) {
        let quotedJid = m.quoted.sender
        if (!users.includes(quotedJid) && !areJidsSameUser(quotedJid, botJid)) {
            users.push(quotedJid)
        }
    }

    let isBotTargeted = m.mentionedJid.some(jid => areJidsSameUser(jid, botJid)) || 
                        (m.quoted && areJidsSameUser(m.quoted.sender, botJid))

    // Kalau bot ditarget
    if (isBotTargeted) {
        if (isAdmin) {
            await m.reply('Lu pikir gua bercanda? Gua out nih!')
            await delay(1500)
            return await conn.groupLeave(m.chat)
        } else {
            await m.reply('Ngapain lu tag-tag gua? Gua admin, lu malah sok nyuruh-nyuruh. Rasain!')
            await delay(1500)
            return await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }

    // Kalau bukan admin tapi coba kick
    if (!isAdmin) {
        await m.reply('Siapa lu nyuruh-nyuruh? Bisa-bisanya pake fitur admin, keluar sana!')
        await delay(1500)
        return await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    }

    if (users.length === 0) return m.reply('Tag orangnya dulu napa, jangan ngawur!')

    let kickedUser = []
    let kickedAdmins = []

    let owner = participants.find(p => p.admin === 'superadmin') || participants[0]
    let ownerJid = owner?.id || null

    for (let user of users) {
        // Check if user is LID or regular WhatsApp ID
        let isLid = user.endsWith('@lid')
        let isWhatsappUser = user.endsWith('@s.whatsapp.net')
        
        if (isLid || isWhatsappUser) {
            let isAdminUser = (participants.find(v => areJidsSameUser(v.id, user)) || { admin: false }).admin
            try {
                const res = await conn.groupParticipantsUpdate(m.chat, [user], "remove")
                kickedUser.push(user)

                if (isAdminUser) kickedAdmins.push(user)

                await delay(1000)
            } catch (e) {
                let username = user.split('@')[0]
                m.reply(`Gagal ngeluarin @${username} 😐`, null, { mentions: [user] })
            }
        }
    }

    if (kickedAdmins.length > 0 && ownerJid) {
        let adminList = kickedAdmins.map(u => {
            let username = u.split('@')[0]
            return `@${username}`
        }).join('\n')
        let executor = m.sender.split('@')[0]
        let message = `⚠️ *Laporan Pengeluaran Admin* ⚠️\n\nAdmin berikut telah dikeluarkan:\n${adminList}\n\nEksekutor: @${executor}`
        conn.sendMessage(ownerJid, { text: message, mentions: kickedAdmins.concat([m.sender]) })
    }
}

handler.help = ['kick @user / reply']
handler.tags = ['group']
handler.command = /^(kick)(\s+.+)?$/i

handler.owner = false
handler.group = true
handler.botAdmin = true
handler.admin = false

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default handler