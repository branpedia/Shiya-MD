import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

function generateFixedNIK(userId) {
  // Hash nomor WA → ambil angka
  let hash = crypto.createHash('md5').update(userId).digest('hex')
  let digits = hash.replace(/[a-f]/g, '') // buang huruf
  if (digits.length < 16) {
    digits = (digits + "1234567890").slice(0, 16)
  } else {
    digits = digits.slice(0, 16)
  }
  return digits
}

let handler = async (m, { conn, text }) => {
  if (!text) {
    await m.reply(`Format:\n.ktp Nama|TTL|Alamat|Jenis Kelamin|Agama|Status\n\nContoh:\n.ktp Nail Fadillah|Bandung, 12 Mei 2001|Jl. Anggrek No.10|Laki-laki|Islam|Belum Kawin`)
    return
  }

  let [nama, ttl, alamat, jk, agama, status] = text.split('|').map(v => v?.trim())
  if (!nama || !ttl || !alamat || !jk || !agama || !status) {
    await m.reply(`Format salah!\nContoh:\n.ktp Nail Fadillah|Bandung, 12 Mei 2001|Jl. Anggrek No.10|Laki-laki|Islam|Belum Kawin`)
    return
  }

  // NIK unik berdasarkan user
  let nik = generateFixedNIK(m.sender)

  // Ambil foto profil WhatsApp
  let ppUrl
  try {
    ppUrl = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    ppUrl = 'https://files.catbox.moe/ozzvan.jpg'
  }

  // Canvas
  const width = 800
  const height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#a5c9f0'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px Arial'
  ctx.fillText('KARTU TANDA PENDUDUK (FAKE)', 180, 50)

  ctx.font = '20px Arial'
  ctx.fillText(`NIK         : ${nik}`, 50, 120)
  ctx.fillText(`Nama        : ${nama}`, 50, 150)
  ctx.fillText(`Tempat/Tgl  : ${ttl}`, 50, 180)
  ctx.fillText(`Alamat      : ${alamat}`, 50, 210)
  ctx.fillText(`Jenis Kel.  : ${jk}`, 50, 240)
  ctx.fillText(`Agama       : ${agama}`, 50, 270)
  ctx.fillText(`Status      : ${status}`, 50, 300)
  ctx.fillText(`Kewarganeg. : Indonesia`, 50, 330)
  ctx.fillText(`Berlaku     : Seumur Hidup`, 50, 360)

  try {
    const ppImg = await loadImage(ppUrl)
    ctx.drawImage(ppImg, 600, 120, 120, 150)
  } catch {
    ctx.strokeStyle = '#000'
    ctx.strokeRect(600, 120, 120, 150)
    ctx.fillText('Foto', 640, 200)
  }

  ctx.save()
  ctx.fillStyle = 'rgba(255,0,0,0.3)'
  ctx.font = 'bold 60px Arial'
  ctx.translate(width / 2, height / 2)
  ctx.rotate(-Math.PI / 6)
  ctx.fillText('SHIYA LI BOT', -150, 0)
  ctx.restore()

  const buffer = canvas.toBuffer('image/png')
  const filePath = path.join('./tmp', `ktp-fake-${Date.now()}.png`)
  fs.writeFileSync(filePath, buffer)

  await conn.sendFile(m.chat, filePath, 'ktp.png', '✅ KTP fiktif (hiburan).', m)
  fs.unlinkSync(filePath)
}

handler.command = /^ktp$/i
handler.help = ['ktp <nama>|<ttl>|<alamat>|<jk>|<agama>|<status>']
handler.tags = ['fun']

export default handler
