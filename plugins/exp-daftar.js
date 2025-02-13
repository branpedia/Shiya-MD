import { createHash } from 'crypto'

let handler = async function (m, { text, usedPrefix, conn }) {
  // Inisialisasi database
  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      registered: false,
      name: '',
      age: 0,
      regTime: 0
    }
  }
  const user = global.db.data.users[m.sender]

  // URL thumbnail
  const mainThumbnail = 'https://ar-hosting.pages.dev/1738636253290.jpg'
  const successThumbnail = 'https://ar-hosting.pages.dev/1738636250739.jpg'

  // Cek status registrasi
  if (user.registered) {
    return conn.sendFile(m.chat, mainThumbnail, 'thumb.jpg', 
      `✅ *Anda sudah terdaftar!*\n\nUntuk daftar ulang ketik:\n*${usedPrefix}unreg <SN>*`, m)
  }

  // Inisialisasi sesi
  if (!global.temp) global.temp = {}
  const session = global.temp[m.sender]

  // Step 1: Minta nama
  if (!session) {
    global.temp[m.sender] = { step: 'nama' }
    return conn.sendFile(m.chat, mainThumbnail, 'thumb.jpg', 
      `📝 *FORM REGISTRASI*\n\nSilakan balas pesan ini dengan cara:\n*.daftar namamu*\n(maksimal 30 karakter)`, m)
  }

  // Step 2: Proses nama
  if (session.step === 'nama') {
    if (!text || text.length > 30) {
      delete global.temp[m.sender]
      return conn.sendFile(m.chat, mainThumbnail, 'thumb.jpg', 
        '❌ Nama tidak valid! Harus 3-30 karakter\nContoh: Budi Santoso', m)
    }
    
    global.temp[m.sender] = { step: 'umur', name: text.trim() }
    return conn.sendFile(m.chat, mainThumbnail, 'thumb.jpg', 
      `🎂 *USIA ANDA*\n\nSilakan balas pesan ini dengan cara:\n*.daftar umurmu*\n(12-100 tahun)`, m)
  }

  // Step 3: Proses umur
  if (session.step === 'umur') {
    const age = parseInt(text)
    if (isNaN(age) || age < 12 || age > 100) {
      delete global.temp[m.sender]
      return conn.sendFile(m.chat, mainThumbnail, 'thumb.jpg', 
        '❌ Usia tidak valid! Harus 12-100 tahun\nContoh: 25', m)
    }

    // Simpan data
    user.name = session.name
    user.age = age
    user.regTime = Date.now()
    user.registered = true

    // Generate SN
    const sn = createHash('md5')
      .update(`${m.sender}:${user.regTime}`)
      .digest('hex')
      .substr(0, 12)
      .toUpperCase()

    // Hapus session
    delete global.temp[m.sender]

    // Kirim konfirmasi dengan thumbnail sukses
    return conn.sendFile(m.chat, successThumbnail, 'success.jpg', 
      `✅ *REGISTRASI BERHASIL!*

╭─「 📋 DATA AKUN 」
│ • Nama: ${user.name}
│ • Usia: ${user.age} tahun
│ • SN: ${sn}
╰────

📜 *SYARAT & KETENTUAN:*
1. Dilarang spam command
2. Tidak menggunakan fitur NSFW
3. Masa berlaku 30 hari

🗓 Registrasi berlaku hingga:
${new Date(user.regTime + 2592000000).toLocaleDateString('id-ID', {
  weekday: 'long', 
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}`, m)
  }
}

handler.help = ['daftar']
handler.tags = ['main']
handler.command = /^(daftar|reg(is(ter)?)?)$/i

export default handler