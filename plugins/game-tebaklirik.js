import fs from "fs";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklirik = conn.tebaklirik || {};
  let id = m.chat;

  if (id in conn.tebaklirik)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.tebaklirik[id].msg);

  let src = JSON.parse(fs.readFileSync("./assets/json/tebaklirik.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎶 *Tebak Lirik Lagu*  

${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}terik untuk bantuan
🎁 Bonus: ${poin} XP
`.trim();

  let soalMsg = await m.reply(caption);

  conn.tebaklirik[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    poin,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.tebaklirik[id]) {
        conn.reply(m.chat, `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`, conn.tebaklirik[id].msg);
        delete conn.tebaklirik[id];
      }
    }, timeout),
  };
};

handler.help = ["tebaklirik"];
handler.tags = ["game"];
handler.command = /^tebaklirik$/i;

handler.onlyprem = true;
handler.game = true;

export default handler;