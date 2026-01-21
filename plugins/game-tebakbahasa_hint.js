/* ─────────────────────
*Branpedia | Bran E-sport*
*WhatsApp:* +6285795600265
*GitHub:* github.com/branpedia
*Saluran Official Kami:* https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
─────────────────────*/

let handler = async (m, { conn }) => {
  conn.tebakbahasa = conn.tebakbahasa || {};
  let id = m.chat;
  if (!(id in conn.tebakbahasa)) return;

  let game = conn.tebakbahasa[id];
  let ans = game.json.arti.trim();

  let clue = ans.replace(/[AIUEOaiueo]/g, "_");

  conn.reply(
    m.chat,
    `💡 *HINT TEBAK BAHASA*\n\n\`\`\`${clue}\`\`\`\n📍 Asal: ${game.json.asal}\n\n_*Balas pesan soal, bukan pesan ini*_`,
    game.msg
  );
};

handler.command = /^hbahasa$/i;
handler.limit = true;
handler.tebakbahasa = true;

export default handler;