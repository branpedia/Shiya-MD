/* ─────────────────────
*Branpedia | Bran E-sport*
*WhatsApp:* +6285795600265
*GitHub:* github.com/branpedia
*Saluran Official Kami:* https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
─────────────────────*/

import fs from "fs";

let timeout = 180000;
let balance = 5000;
let limit = 2;

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakbahasa = conn.tebakbahasa || {};
  let id = m.chat;

  if (id in conn.tebakbahasa)
    return conn.reply(
      m.chat,
      "⚠️ Masih ada soal belum terjawab di chat ini!",
      conn.tebakbahasa[id].msg
    );

  let src = JSON.parse(fs.readFileSync("./assets/json/tebakbahasa.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎮 *Tebak Bahasa Daerah*

📝 *Kata:* 
"${json.kata}"

📍 *Asal:* ${json.asal}
🏷️ *Kategori:* ${json.kategori}

💡 *Artinya apa dalam bahasa Indonesia?*

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
🔍 Ketik *${usedPrefix}hbahasa* untuk bantuan

📝 *Balas pesan ini dengan jawaban*

➕ Bonus: ${balance} Balance
🎟️ Limit: ${limit} Limit
`.trim();

  let soalMsg = await m.reply(caption);

  conn.tebakbahasa[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    balance,
    kesempatan: 3,
    timeout: setTimeout(() => {
      if (conn.tebakbahasa[id]) {
        conn.reply(
          m.chat,
          `⏳ Waktu habis!\n📑 Jawaban: *${json.arti}*\n📍 Asal: ${json.asal}`,
          conn.tebakbahasa[id].msg
        );
        delete conn.tebakbahasa[id];
      }
    }, timeout),
  };
};

handler.help = ["tebakbahasa"];
handler.tags = ["game"];
handler.command = /^(tebakbahasa)$/i;

export default handler;