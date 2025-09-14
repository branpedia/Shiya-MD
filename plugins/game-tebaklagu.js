import fs from "fs";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebaklagu = conn.tebaklagu || {};
  let id = m.chat;

  if (id in conn.tebaklagu)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.tebaklagu[id].msg);

  let src = JSON.parse(fs.readFileSync("./assets/json/tebaklagu.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎵 *Tebak Lagu*  
🎤 Artist: *${json.artis}*

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}hlagu untuk bantuan

📝 Balas reply pesan ini, 
atau ketik: *${usedPrefix}jawabtebaklagu <jawaban>*

🎁 Bonus: ${poin} XP
`.trim();

  let soalMsg = await m.reply(caption);

  conn.tebaklagu[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    poin,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.tebaklagu[id]) {
        conn.reply(m.chat, `⏳ Waktu habis!\n📑 Jawaban: *${json.judul}*`, conn.tebaklagu[id].msg);
        delete conn.tebaklagu[id];
      }
    }, timeout),
  };

  await conn.sendFile(m.chat, json.lagu, "tebaklagu.mp3", "", soalMsg);
};

handler.help = ["tebaklagu"];
handler.tags = ["game"];
handler.command = /^tebaklagu$/i;

export default handler;