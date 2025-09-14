import fs from "fs";

let timeout = 120000;
let hadiah = {
  exp: 2000,
  limit: 5,
  balance: 1000
};

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.lengkapikalimat = conn.lengkapikalimat || {};
  let id = m.chat;

  if (id in conn.lengkapikalimat)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.lengkapikalimat[id].msg);

  let src = JSON.parse(fs.readFileSync("./assets/json/lengkapikalimat.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
✍️ Lengkapi Kalimat Berikut:

"${json.soal} ..."

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik: ${usedPrefix}hlen untuk bantuan

🎁 Bonus:
+${hadiah.exp} XP
+${hadiah.limit} Limit
+${hadiah.balance} Balance
`.trim();

  let soalMsg = await m.reply(caption);

  conn.lengkapikalimat[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    hadiah,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.lengkapikalimat[id]) {
        conn.reply(m.chat, `⏰ Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id].msg);
        delete conn.lengkapikalimat[id];
      }
    }, timeout),
  };
};

handler.help = ["lengkapikalimat"];
handler.tags = ["game"];
handler.command = /^lengkapikalimat$/i;

handler.onlyprem = true;
handler.game = true;

export default handler;