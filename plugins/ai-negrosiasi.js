import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

const validFilters = ["coklat", "hitam", "nerd", "piggy", "carbon", "botak"]

let handler = async (m, { conn, args }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime || !/^image/.test(mime)) {
      throw '❌ Kirim atau reply gambar dengan caption *.hitamkan <filter>*'
    }

    m.reply(wait)

    const media = await q.download()
    const uploaded = await ryzenCDN(media)

    if (!uploaded || !uploaded.url) throw '❌ Gagal mengupload gambar ke CDN!'

    const filter = (args[0] || 'hitam').toLowerCase()
    if (!validFilters.includes(filter)) {
      return m.reply(`📸 Filter yang tersedia:\n• ${validFilters.join('\n• ')}`)
    }

    const apiURL = `https://apidl.asepharyana.cloud/api/ai/negro?url=${encodeURIComponent(uploaded.url)}&filter=${filter}`
    const res = await axios.get(apiURL, { responseType: 'arraybuffer' })

    await conn.sendFile(m.chat, res.data, 'hasil.jpg', `✅ Sukses difilter dengan *${filter}*`, m)
  } catch (err) {
    console.error(err)
    m.reply(`⚠️ Error: ${err.message || err}`)
  }
}

handler.help = ['hitamkan <filter>']
handler.tags = ['ai']
handler.command = /^hitamkan$/i
handler.limit = 2
handler.register = true

export default handler