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
  conn.tebakprofesi = conn.tebakprofesi || {};
  let id = m.chat;

  if (id in conn.tebakprofesi)
    return conn.reply(
      m.chat,
      "⚠️ Masih ada soal belum terjawab di chat ini!",
      conn.tebakprofesi[id].msg
    );

  let src = JSON.parse(fs.readFileSync("./assets/json/tebakprofesi.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎮 *Tebak Profesi*

❓ Deskripsi:  
"${json.soal}"

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik *${usedPrefix}hprof* untuk bantuan

📝 *Balas pesan ini dengan jawaban*

➕ Bonus: ${balance} Balance
🎟️ Limit: ${limit} Limit
`.trim();

  let soalMsg = await m.reply(caption);

  conn.tebakprofesi[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    balance,
    kesempatan: 3,
    timeout: setTimeout(() => {
      if (conn.tebakprofesi[id]) {
        conn.reply(
          m.chat,
          `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`,
          conn.tebakprofesi[id].msg
        );
        delete conn.tebakprofesi[id];
      }
    }, timeout),
  };
};

handler.help = ["tebakprofesi"];
handler.tags = ["game"];
handler.command = /^(tebakprofesi)$/i;

export default handler;