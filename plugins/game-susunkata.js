import fs from "fs";

let timeout = 180000;
let balance = 5000;
let limit = 2;

let handler = async (m, { conn, usedPrefix }) => {
  conn.susunkata = conn.susunkata || {};
  let id = m.chat;

  if (id in conn.susunkata)
    return conn.reply(
      m.chat,
      "⚠️ Masih ada soal belum terjawab di chat ini!",
      conn.susunkata[id].msg
    );

  let src = JSON.parse(fs.readFileSync("./assets/json/susunkata.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎮 *Susun Kata*

❓ Soal:  
${json.soal}

📮 Tipe: ${json.tipe}
⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}suska untuk bantuan

📝 Balas pesan ini, 
atau ketik: *${usedPrefix}jawabsusunkata <jawaban>*

➕ Bonus: ${balance} Balance
🎟️ Limit: ${limit} Limit
`.trim();

  let soalMsg = await m.reply(caption);

  conn.susunkata[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    balance,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.susunkata[id]) {
        conn.reply(
          m.chat,
          `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`,
          conn.susunkata[id].msg
        );
        delete conn.susunkata[id];
      }
    }, timeout),
  };
};

handler.help = ["susunkata"];
handler.tags = ["game"];
handler.command = /^(susunkata|sskata)$/i;

export default handler;