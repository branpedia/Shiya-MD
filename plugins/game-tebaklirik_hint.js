let handler = async (m, { conn }) => {
  conn.tebaklirik = conn.tebaklirik || {}
  let id = m.chat

  if (!(id in conn.tebaklirik)) {
    return m.reply('⚠️ Tidak ada game *Tebak Lirik* yang sedang berlangsung.')
  }

  let game = conn.tebaklirik[id]
  let json = game.json

  if (!json || !json.jawaban) {
    return m.reply('❌ Data lirik tidak ditemukan.')
  }

  let hint = json.jawaban.replace(/[AIUEOaiueo]/gi, "_")

  await conn.sendMessage(
    m.chat,
    {
      text: `🎤 *Clue Lirik Lagu:*\n\`\`\`${hint}\`\`\`\n\nBalas soal, bukan pesan ini!`
    },
    { quoted: game.msg } // reply tetap ke soal aslinya
  )
}

handler.command = /^(terik)$/i
handler.limit = true
handler.error = 0

export default handler