import fs from "fs";

const winScore = 4999;

let handler = async (m, { conn }) => {
  conn.family = conn.family ?? {};
  let id = m.chat;

  if (id in conn.family) {
    return conn.reply(m.chat, "⚠️ Masih ada kuis yang belum selesai di chat ini!", conn.family[id].msg);
  }

  let src = JSON.parse(fs.readFileSync("./assets/json/family100.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
🎮 *Family 100*

📌 *Soal:* ${json.soal}
📌 Terdapat *${json.jawaban.length}* jawaban! ${
    json.jawaban.find((v) => v.includes(" ")) ? "(beberapa jawaban memiliki spasi)" : ""
  }

🏆 +${winScore} XP tiap jawaban benar.

❓ *Jawab dengan reply pesan ini!*
⌛ Ketik *nyerah* jika menyerah.
`.trim();

  let msg = await m.reply(caption);

  conn.family[id] = {
    id,
    msg,
    ...json,
    terjawab: Array.from(json.jawaban, () => false),
    winScore,
  };
};

handler.help = ["family100"];
handler.tags = ["game"];
handler.command = /^family100$/i;
handler.onlyprem = false;
handler.game = true;

export default handler;