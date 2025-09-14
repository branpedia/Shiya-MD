import fs from "fs";

let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, usedPrefix }) => {
  conn.asahotak = conn.asahotak || {};
  let id = m.chat;

  if (id in conn.asahotak)
    return conn.reply(
      m.chat,
      "⚠️ Masih ada pertanyaan belum terjawab di chat ini",
      conn.asahotak[id].msg
    );

  let src = JSON.parse(fs.readFileSync("./assets/json/asahotak.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🧠 *Asah Otak*

❓ Soal:  
${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}hotak untuk bantuan

📝 Balas pesan ini, 
atau ketik: *${usedPrefix}jawabasahotak <jawaban>*

🎁 Bonus: ${poin} XP
`.trim();

  let soalMsg = await m.reply(caption);

  conn.asahotak[id] = {
    msg: soalMsg,
    msgId: soalMsg.key.id,
    json,
    poin,
    kesempatan: 4,
    timeout: setTimeout(() => {
      if (conn.asahotak[id]) {
        conn.reply(
          m.chat,
          `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`,
          conn.asahotak[id].msg
        );
        delete conn.asahotak[id];
      }
    }, timeout),
  };
};

handler.help = ["asahotak"];
handler.tags = ["game"];
handler.command = /^asahotak$/i;

export default handler;