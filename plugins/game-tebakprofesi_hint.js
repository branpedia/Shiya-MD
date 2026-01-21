/* ─────────────────────
*Branpedia | Bran E-sport*
*WhatsApp:* +6285795600265
*GitHub:* github.com/branpedia
*Saluran Official Kami:* https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
─────────────────────*/

let handler = async (m, { conn }) => {
  conn.tebakprofesi = conn.tebakprofesi || {};
  let id = m.chat;
  if (!(id in conn.tebakprofesi)) return;

  let game = conn.tebakprofesi[id];
  let ans = game.json.jawaban.trim();

  // Huruf vokal jadi "_", konsonan tetap
  let clue = ans.replace(/[AIUEOaiueo]/g, "_");

  conn.reply(
    m.chat,
    `💡 *HINT TEBAK PROFESI*\n\n\`\`\`${clue}\`\`\`\n\n_*Balas pesan soal, bukan pesan ini*_`,
    game.msg
  );
};

handler.command = /^hprof$/i;
handler.limit = true;
handler.tebakprofesi = true;

export default handler;