let handler = async (m, { conn }) => {
  conn.tebaksurah = conn.tebaksurah || {}
  let id = m.chat

  if (!(id in conn.tebaksurah)) {
    return m.reply('⚠️ Tidak ada game Tebak Surah yang sedang berlangsung.')
  }

  let game = conn.tebaksurah[id]
  let json = game.json

  if (!json || !json.surah || !json.surah.englishName) {
    return m.reply('❌ Data surah tidak ditemukan.')
  }

  let hint = json.surah.englishName.replace(/[AIUEOaiueo]/gi, '_')

  await conn.sendMessage(
    m.chat,
    { text: `💡 *Hint Surah:*\n\`\`\`${hint}\`\`\`\n\nKetik *menyerah* untuk menyerah.` },
    { quoted: game.msg } // balas ke soal, bukan ke pesan hint
  )
}

handler.command = /^hsur$/i
handler.limit = true

export default handler