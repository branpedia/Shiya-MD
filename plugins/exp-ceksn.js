import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
  
  let sn = createHash('md5').update(m.sender).digest('hex')
  let name = await conn.getName(m.sender)
let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}

conn.sendMessage(m.chat, {
text: sn,
contextInfo: {
externalAdReply: {
title: '📄 Y O U R  S E R I A L  N U M B E R',
body: 'copy the text below',
showAdAttribution: true,
mediaType: 1,
sourceUrl: '',
thumbnailUrl: pp,
renderLargerThumbnail: true
}}
}, {quoted: fkon})

}

handler.help = ['ceksn']
handler.tags = ['main']
handler.command = /^(ceksn)$/i
handler.register = true
export default handler


// Bekasan Bro

/* import { createHash } from 'crypto'
import { Buttons, Button } from '@adiwajshing/baileys'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
  let sn = createHash('md5').update(m.sender).digest('hex')
  let name = await conn.getName(m.sender)
  let fkon = { 
    key: { 
      fromMe: false, 
      participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, 
      ...(m.chat ? { 
        remoteJid: '16504228206@s.whatsapp.net' 
      } : {}) 
    }, 
    message: { 
      contactMessage: { 
        displayName: `${name}`, 
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      } 
    } 
  }

  const buttons = [
    Button.text('Copy SN', 'copy', { text: sn }),
    Button.text('Tombol', 'tombol', { command: `${usedPrefix}tombol` }),
  ];

  const buttonMessage = {
    text: `*YOUR SERIAL NUMBER*\n${sn}`,
    footer: `*${name}*`,
    buttons: buttons,
    headerType: 1,
  };

  conn.sendMessage(m.chat, buttonMessage, { quoted: fkon });
}

handler.help = ['ceksn']
handler.tags = ['main']
handler.command = /^(ceksn)$/i
handler.register = true

export default handler */