import fs from "fs";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakgambar = conn.tebakgambar || {};
  let id = m.chat;

  let ephemeral =
    conn.chats[m.chat]?.metadata?.ephemeralDuration ||
    conn.chats[m.chat]?.ephemeralDuration ||
    false;

  let setting = global.db.data.settings[conn.user.jid];

  if (id in conn.tebakgambar)
    return conn.reply(m.chat, "⚠️ Masih ada soal belum terjawab di chat ini", conn.tebakgambar[id][0]);

  let src = JSON.parse(fs.readFileSync("./assets/json/tebakgambar.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🖼️ *Tebak Gambar*  
${json.deskripsi}

⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💡 Ketik ${usedPrefix}hgamb untuk bantuan

📝 Balas reply pesan ini, 
atau ketik: *${usedPrefix}jawabtebakgambar <jawaban>*

🎁 Bonus: ${poin} XP
`.trim();

  conn.tebakgambar[id] = [
    await conn.sendMessage(
      m.chat,
      {
        image: { url: json.img },
        fileName: "tebakgambar.jpg",
        mimetype: "image/jpeg",
        caption: setting.smlcap ? conn.smlcap(caption) : caption,
      },
      { quoted: m, ephemeralExpiration: ephemeral },
    ),
    json,
    poin,
    4,
    setTimeout(() => {
      if (conn.tebakgambar[id]) {
        conn.reply(m.chat, `⏳ Waktu habis!\n📑 Jawaban: *${json.jawaban}*`, conn.tebakgambar[id][0]);
        delete conn.tebakgambar[id];
      }
    }, timeout),
  ];
};

handler.help = ["tebakgambar"];
handler.tags = ["game"];
handler.command = /^tebakgambar$/i;

export default handler;