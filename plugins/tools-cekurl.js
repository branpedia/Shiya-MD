import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text || !/^https?:\/\//.test(text)) {
    throw `Contoh: ${usedPrefix + command} https://gcbran.vercel.app`
  }

  m.reply('🔍 Mengecek URL redirect...')

  try {
    // Ambil isi HTML tanpa follow redirect (manual)
    const res = await axios.get(text, {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    }).catch(e => e.response || e)

    let finalUrl = res.headers?.location || text // default

    // Jika tidak redirect secara header, cek isi HTML
    if (res.status === 200 && res.data) {
      const html = res.data.toString()
      const $ = cheerio.load(html)

      // Cek <meta http-equiv="refresh">
      const meta = $('meta[http-equiv="refresh"]').attr('content')
      if (meta) {
        const match = meta.match(/url=(.+)/i)
        if (match) finalUrl = match[1].trim()
      }

      // Cek window.location.href di dalam <script>
      const scripts = $('script').map((i, el) => $(el).html()).get()
      for (let script of scripts) {
        const match = script.match(/window\.location\.href\s*=\s*["'](.+?)["']/i)
        if (match) {
          finalUrl = match[1].trim()
          break
        }
      }
    }

    m.reply(`🔍 *Hasil Redirect URL:*\n${finalUrl}`)
  } catch (e) {
    console.error(e)
    throw `❌ Gagal membaca URL redirect.\n${e.message}`
  }
}

handler.help = ['cekurl <link>']
handler.tags = ['tools']
handler.command = /^cekurl$/i
handler.limit = false

export default handler