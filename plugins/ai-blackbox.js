import fetch from "node-fetch"
import { branpedia } from '../lib/uploadFile.js'
let previousMessages = []
const handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    if (!text && !m.quoted && !m.mtype.includes('imageMessage')) {
      await conn.sendFile(m.chat, 'https://ar-hosting.pages.dev/1738761101618.jpg', 'thumb.jpg', "Pertanyaannya mana jirt? Silakan ketik pertanyaan Kamu.\n\nContoh: .blackbox apakah bener megawati menjual pulau?", m)
      return
    }
    let msg = await conn.sendFile(m.chat, 'https://ar-hosting.pages.dev/1738761101618.jpg', 'thumb.jpg', "Sedang Dalam Proses...", m)
    let imgUrl = null
    if (m.quoted && m.quoted.mtype === 'imageMessage') {
      let img = await m.quoted.download()
      if (img) {
        img = Buffer.from(img)
        let link = await branpedia(img)
        if (!link) throw 'Gagal mengupload gambar'
        imgUrl = typeof link === 'object' ? link.url : link
      }
    } else if (m.mtype.includes('imageMessage')) {
      let img = await m.download()
      if (img) {
        img = Buffer.from(img)
        let link = await branpedia(img)
        if (!link) throw 'Gagal mengupload gambar'
        imgUrl = typeof link === 'object' ? link.url : link
      }
    }
    let apiUrl
    if (imgUrl) {
      apiUrl = `${APIs.ryzen}/api/ai/blackbox?chat=${encodeURIComponent(text || '')}&options=blackboxai&imageurl=${encodeURIComponent(imgUrl)}`
    } else if (text) {
      apiUrl = `${APIs.ryzen}/api/ai/blackbox?chat=${encodeURIComponent(text)}&options=blackboxai`
    } else {
      throw "Tidak ada teks atau gambar yang valid untuk diproses."
    }
    let hasil = await fetch(apiUrl)
    if (!hasil.ok) {
      throw new Error("Request ke API gagal: " + hasil.statusText)
    }
    let result = await hasil.json()
    let responseMessage = result.response || "Tidak ada respons dari AI."
    if (result.additionalInfo && result.additionalInfo.length > 0) {
      responseMessage += "\n\n**Informasi Tambahan:**\n"
      result.additionalInfo.forEach(info => {
        responseMessage += `- [${info.title}](${info.link}): ${info.snippet}\n`
        if (info.sitelinks && info.sitelinks.length > 0) {
          info.sitelinks.forEach(link => {
            responseMessage += ` - [${link.title}](${link.link})\n`
          })
        }
      })
    }
    await conn.sendFile(m.chat, 'https://ar-hosting.pages.dev/1738761101618.jpg', 'thumb.jpg', responseMessage, m, { edit: msg.key })
    previousMessages.push({ role: "user", content: text || '[Image]' })
  } catch (error) {
    console.error('Error in handler:', error)
    await conn.sendFile(m.chat, 'https://ar-hosting.pages.dev/1738761101618.jpg', 'thumb.jpg', `Error: ${error.message}`, m, { edit: msg.key })
  }
}
handler.help = ['blackbox']
handler.tags = ['ai']
handler.command = /^(blackbox)$/i
handler.limit = 8
handler.premium = false
handler.register = true
export default handler