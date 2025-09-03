/* ─────────────────────
*Branpedia | Bran E-sport*
*WhatsApp:* +6285795600265
*GitHub:* github.com/branpedia
*Saluran Official Kami:* https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
─────────────────────*/

import axios from 'axios'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

async function tiktokV1(query) {
  const encodedParams = new URLSearchParams()
  encodedParams.set('url', query)
  encodedParams.set('hd', '1')

  const { data } = await axios.post('https://tikwm.com/api/', encodedParams, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: 'current_language=en',
      'User-Agent': 'Mozilla/5.0'
    }
  })
  return data
}

async function sendMedia(conn, m, data) {
  const uniqueData = [...new Set(data)]
  for (let i = 0; i < uniqueData.length; i++) {
    const media = uniqueData[i]
    try {
      const res = await fetch(media)
      const buffer = await res.buffer()

      let ext = media.includes('.mp4') ? '.mp4' : '.jpg'
      const fileName = `tiktok_${i}${ext}`

      await sleep(1000)
      await conn.sendFile(m.chat, buffer, fileName, '*TikTok Downloader*', m)
    } catch (e) {
      console.error('Gagal kirim media:', e)
    }
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukkan URL TikTok!\nContoh:\n${usedPrefix + command} https://vt.tiktok.com/xxxxxx`)

  let status = await conn.sendMessage(m.chat, { text: '🔍 Mengambil data TikTok...' }, { quoted: m })

  let mediaUrls = []
  let meta = {}
  let from = ''

  try {
    const d1 = await tiktokV1(text)
    if (d1?.data) {
      const d = d1.data
      if (d.hdplay) mediaUrls.push(d.hdplay)
      else if (d.play) mediaUrls.push(d.play)
      else if (d.wmplay) mediaUrls.push(d.wmplay)
      if (Array.isArray(d.images)) mediaUrls = mediaUrls.concat(d.images)
      if (Array.isArray(d.image_post)) mediaUrls = mediaUrls.concat(d.image_post)
      meta = { title: d.title, author: d.author, duration: d.duration, create_time: d.create_time }
      from = 'tikwm'
    }
  } catch (e) {
    console.error('Error tiktokV1:', e)
  }

  mediaUrls = mediaUrls.filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)

  if (!mediaUrls.length) {
    await conn.sendMessage(m.chat, { edit: status.key, text: '⚠️ Gagal menemukan media TikTok!' })
    return
  }

  const time = meta.create_time ? moment.unix(meta.create_time).tz('Asia/Jakarta').format('DD MMM YYYY HH:mm:ss') : '-'
  const caption = `*TikTok Downloader*
📌 Judul: ${meta.title || '-'}
👤 Author: ${meta.author?.nickname || meta.author?.unique_id || '-'}
🕒 Durasi: ${meta.duration ? meta.duration + 's' : '-'}
📅 Upload: ${time}
🎞 Jumlah media: ${mediaUrls.length}
🔗 Sumber: ${from}`

  await conn.sendMessage(m.chat, { edit: status.key, text: caption })
  await sendMedia(conn, m, mediaUrls)
}

handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = /^(tiktok|tt|ttdl|tiktokdl)$/i
handler.limit = true

export default handler
