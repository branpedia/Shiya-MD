/*
* Nama Fitur : YouTube Post Downloader
* Author : Bran + Fix Multi Image
* Type : Plugin ESM
*/

import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Gunakan format:\n${usedPrefix + command} <url yt post>\n\nContoh:\n${usedPrefix + command} https://www.youtube.com/post/UgkxDOdOM_01NA3k_tfM9DOYCxVr-gg3XdeM`

  try {
    m.reply("⏳ Mengambil data post...")

    let res = await fetch(text)
    if (!res.ok) throw `Gagal fetch halaman: ${res.status}`
    let html = await res.text()

    // cari script ytInitialData
    let jsonMatch = html.match(/var ytInitialData = (.*?);\s*<\/script>/)
    if (!jsonMatch) throw `Tidak menemukan data post`

    let data = JSON.parse(jsonMatch[1])

    // cari bagian postRenderer
    let postRenderer = findPostRenderer(data)
    if (!postRenderer) throw `Tidak bisa menemukan postRenderer`

    // ambil caption
    let caption = postRenderer.contentText?.runs?.map(r => r.text).join(" ") || "Tanpa caption"

    // ambil gambar (support single & multi)
    let images = []

    if (postRenderer.backstageAttachment?.imageAttachmentRenderer) {
      // single image
      let imgs = postRenderer.backstageAttachment.imageAttachmentRenderer.image.thumbnails
      images.push(imgs[imgs.length - 1].url)
    }

    if (postRenderer.backstageAttachment?.backstageImageRenderer) {
      // single image (variasi lain)
      let imgs = postRenderer.backstageAttachment.backstageImageRenderer.image.thumbnails
      images.push(imgs[imgs.length - 1].url)
    }

    if (postRenderer.backstageAttachment?.postMultiImageRenderer?.images) {
      // multi-image (carousel)
      for (let imgObj of postRenderer.backstageAttachment.postMultiImageRenderer.images) {
        let imgs = imgObj.backstageImageRenderer.image.thumbnails
        images.push(imgs[imgs.length - 1].url)
      }
    }

    if (images.length) {
      await m.reply(`📷 Ditemukan ${images.length} media`)
      for (let img of images) {
        await conn.sendFile(m.chat, img, "ytpost.jpg", caption, m)
      }
    } else {
      await m.reply(caption)
    }
  } catch (e) {
    console.log("❌ ytpost error:", e)
    m.reply(`❌ Error: ${e.message || e}`)
  }
}

// fungsi rekursif untuk cari postRenderer
function findPostRenderer(obj) {
  if (!obj || typeof obj !== "object") return null
  if (obj.backstagePostThreadRenderer?.post?.backstagePostRenderer) {
    return obj.backstagePostThreadRenderer.post.backstagePostRenderer
  }
  for (let k of Object.keys(obj)) {
    let found = findPostRenderer(obj[k])
    if (found) return found
  }
  return null
}

handler.help = ['ytpost <url>']
handler.tags = ['downloader']
handler.command = /^ytpost$/i

export default handler