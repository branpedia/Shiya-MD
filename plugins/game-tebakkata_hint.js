let handler = async (m, { conn }) => {
  conn.tebakkata = conn.tebakkata || {};
  let id = m.chat;
  if (!(id in conn.tebakkata)) return;

  let game = conn.tebakkata[id];
  let jawaban = game.json.jawaban.trim();

  let clue = jawaban.replace(/[AIUEOaiueo]/gi, "_");

  conn.reply(
    m.chat,
    "Clue : " +
      "```" +
      clue +
      "```" +
      "\n\n_*Balas Soalnya, Bukan Pesan Ini*_",
    game.msg // reply ke soal, bukan ke pesan hint
  );
};

handler.command = /^teka$/i;
handler.limit = true;
handler.error = 0;

export default handler;