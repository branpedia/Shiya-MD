let handler = async (m, { conn }) => {
  conn.susunkata = conn.susunkata || {};
  let id = m.chat;
  if (!(id in conn.susunkata)) return;

  let game = conn.susunkata[id];
  let ans = game.json.jawaban.trim();

  // bikin hint: semua huruf vokal diganti "_"
  let clue = ans.replace(/[AIUEOaiueo]/g, "_");

  conn.reply(
    m.chat,
    "```" + clue + "```\n\n_*Balas Soalnya, Bukan Pesan Ini*_",
    game.msg
  );
};

handler.command = /^suska$/i;
handler.limit = true;
handler.error = 0;
handler.susunkata = true;
handler.onlyprem = true;

export default handler;