let handler = async (m, { conn }) => {
  conn.tebaklagu = conn.tebaklagu || {}
  let id = m.chat

  if (!(id in conn.tebaklagu)) {
    return m.reply('⚠️ Tidak ada game *Tebak Lagu* yang sedang berlangsung.')
  }

  let game = conn.tebaklagu[id]
  let json = game.json

  if (!json || !json.judul) {
    return m.reply('❌ Data lagu tidak ditemukan.')
  }

  let hint = json.judul.replace(/[AIUEOaiueo]/gi, "_")

  await conn.sendMessage(
    m.chat,
    { text: `🎵 *Clue Judul Lagu:*\n\`\`\`${hint}\`\`\`\n\nBalas soal, bukan pesan ini!` },
    { quoted: game.msg } // supaya balasan tetap ke soal asli
  )
}

handler.command = /^hlagu$/i
handler.limit = true
handler.error = 0

export default handler