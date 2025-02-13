let handler = async (m, {conn}) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
      const pp = await conn.profilePictureUrl(who, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
      
   conn.sendMessage(m.chat, {
text: '',
contextInfo: {
externalAdReply: {
title: '🎟️Y O U R  L I M I T',
body: `➜ ❲ ${global.db.data.users[who].limit} ❳`,
showAdAttribution: true,
mediaType: 1,
sourceUrl: '',
thumbnailUrl: pp,
renderLargerThumbnail: false
}}
}, {quoted: m})

}
handler.help = ['limit <@user>']
handler.tags = ['main']
handler.command = /^(limit)$/i
handler.register = true

export default handler