let handler = async (m, { conn, args, usedPrefix, command }) => {
    let group = m.chat
    if (args[0] && args[0].includes('@')) group = args[0]
    
    try {
        // Get group metadata
        let groupMetadata = await conn.groupMetadata(group)
        let participants = groupMetadata.participants
        let groupAdmins = participants.filter(p => p.admin).map(p => p.id)
        
        // Check if user is admin
        let isAdmin = groupAdmins.includes(m.sender)
        if (!isAdmin) throw 'Hanya admin grup yang dapat menggunakan perintah ini!'
        
        // Get group invite link
        let inviteLink = await conn.groupInviteCode(group)
        let fullInviteLink = 'https://chat.whatsapp.com/' + inviteLink
        
        // Get group profile picture
        let ppUrl = await conn.profilePictureUrl(group, 'image').catch(_ => null)
        
        // Prepare caption
        let caption = `
*${groupMetadata.subject}*

👥 *Anggota:* ${participants.length}
🔗 *Link Group:* ${fullInviteLink}

// Ini buat ambil description 
*Deskripsi:*
${groupMetadata.desc || 'Tidak ada deskripsi'}

_Shiya MD_
        `.trim()
        
        // Send message with image and caption
        if (ppUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: ppUrl },
                caption: caption,
                contextInfo: {
                    mentionedJid: participants.map(p => p.id),
                    externalAdReply: {
                        title: `Undangan ${groupMetadata.subject}`,
                        body: `Klik untuk bergabung dengan grup!`,
                        mediaType: 1,
                        thumbnail: { url: ppUrl },
                        sourceUrl: fullInviteLink
                    }
                }
            }, { quoted: m })
        } else {
            // If no profile picture, send text only
            await conn.sendMessage(m.chat, {
                text: caption,
                contextInfo: {
                    mentionedJid: participants.map(p => p.id),
                    externalAdReply: {
                        title: `Undangan ${groupMetadata.subject}`,
                        body: `Klik untuk bergabung dengan grup!`,
                        mediaType: 1,
                        sourceUrl: fullInviteLink
                    }
                }
            }, { quoted: m })
        }
        
    } catch (error) {
        console.error(error)
        m.reply(`Terjadi kesalahan: ${error.message || error}`)
    }
}

handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i
handler.group = true
handler.admin = true // Only group admins can use this command

export default handler
