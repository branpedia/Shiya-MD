import fs from "fs";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, usedPrefix }) => {
  conn.caklontong = conn.caklontong || {};
  let id = m.chat;

  if (id in conn.caklontong)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.caklontong[id].msg);

  let src = JSON.parse(fs.readFileSync("./assets/json/caklontong.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🤣 *Cak Lontong Quiz*

❓ Soal:
${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}calo untuk bantuan

📝 Balas pesan ini, 
atau ketik: *${usedPrefix}jawabcaklontong <jawaban>*

🎁 Bonus: ${poin} XP
`.trim();

  let soalMsg = await conn.reply(m.chat, caption, m);

  conn.caklontong[id] = {
    msg: soalMsg,        // pesan soal
    msgId: soalMsg.key.id, // id pesan soal
    json,
    poin,
    kesempatan: 4,
    timeout: setTimeout(async () => {
      if (conn.caklontong[id]) {
        await conn.reply(
          m.chat,
          `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*\n📝 ${json.deskripsi}`,
          conn.caklontong[id].msg
        );
        delete conn.caklontong[id];
      }
    }, timeout),
  };
};

handler.help = ["caklontong"];
handler.tags = ["game"];
handler.command = /^caklontong$/i;

export default handler;