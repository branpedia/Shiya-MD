import fs from "fs";
let timeout = 120000;
let hadiah = {
  exp: 3000,
  limit: 3,
  balance: 1000,
};

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakkata = conn.tebakkata || {};
  let id = m.chat;
  if (id in conn.tebakkata)
    return conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebakkata[id].msg
    );

  let src = JSON.parse(fs.readFileSync("./assets/json/tebakkata.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `${json.soal}
⏱ Timeout: *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik: ${usedPrefix}teka untuk bantuan
📌 Balas pesan ini, atau ketik: \`${usedPrefix}jawabtebakkata <jawaban>\`
🎁 Bonus:
+${hadiah.exp} XP | +${hadiah.limit} Limit | +${hadiah.balance} Balance
`.trim();

  let soalMsg = await m.reply(caption);

  conn.tebakkata[id] = {
    msg: soalMsg,        // pesan soal
    msgId: soalMsg.key.id, // id pesan soal
    json,
    hadiah,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.tebakkata[id]) {
        conn.reply(
          m.chat,
          `⏰ Waktu habis!\nJawabannya adalah *${json.jawaban}*`,
          conn.tebakkata[id].msg
        );
        delete conn.tebakkata[id];
      }
    }, timeout),
  };
};

handler.help = ["tebakkata"];
handler.tags = ["game"];
handler.command = /^tebakkata$/i;

export default handler;