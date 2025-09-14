let handler = async (m, { conn }) => {
  conn.tebakkimia = conn.tebakkimia || {};
  let id = m.chat;

  if (!(id in conn.tebakkimia)) {
    return m.reply('⚠️ Tidak ada game *Tebak Kimia* yang sedang berlangsung.');
  }

  let game = conn.tebakkimia[id];
  let json = game.json;

  if (!json || !json.unsur) {
    return m.reply('❌ Data unsur tidak ditemukan.');
  }

  let hint = json.unsur.replace(/[AIUEOaiueo]/gi, "_");

  await conn.sendMessage(
    m.chat,
    {
      text: `🧪 *Clue Unsur Kimia:*\n\`\`\`${hint}\`\`\`\n\nBalas soal, bukan pesan ini!`
    },
    { quoted: game.msg } // supaya tetap nge-reply ke soal aslinya
  );
};

handler.command = /^hmia$/i;
handler.limit = true;
handler.error = 0;

export default handler;