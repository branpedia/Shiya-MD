import fs from "fs";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakgame = conn.tebakgame || {};
  let id = m.chat;

  if (id in conn.tebakgame)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.tebakgame[id].msg);

  let src = JSON.parse(fs.readFileSync("./assets/json/tebakgame.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎮 *Tebak Game Logo*  

🕹️ Logo apakah ini?

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}hgame untuk bantuan
🎁 Bonus: ${poin} XP
`.trim();

  let soalMsg = await conn.sendFile(m.chat, json.img, "tebakgame.jpg", caption, m);

  conn.tebakgame[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    poin,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.tebakgame[id]) {
        conn.reply(m.chat, `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`, conn.tebakgame[id].msg);
        delete conn.tebakgame[id];
      }
    }, timeout),
  };
};

handler.help = ["tebakgame"];
handler.tags = ["game"];
handler.command = /^tebakgame$/i;

handler.onlyprem = true;
handler.game = true;

export default handler;