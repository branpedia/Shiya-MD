import similarity from "similarity";

const threshold = 0.7;

export async function before(m) {
  this.family = this.family ?? {};
  let id = m.chat;
  if (!(id in this.family)) return true;

  let room = this.family[id];
  let text = m.text.toLowerCase().trim();

  // Wajib reply ke pesan soal
  if (!m.quoted || m.quoted.id !== room.msg.key.id) return true;

  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(text);

  if (!isSurrender) {
    let index = room.jawaban.findIndex((jawaban, i) =>
      !room.terjawab[i] && similarity(jawaban.toLowerCase(), text) >= threshold
    );

    if (index < 0) {
      m.reply("❌ Jawaban salah! Coba lagi.");
      return true;
    }

    if (room.terjawab[index]) return true;

    room.terjawab[index] = m.sender;
    let users = global.db.data.users[m.sender];
    users.exp += room.winScore;

    let correctReply = `✅ *Benar!* +${room.winScore} XP untuk @${m.sender.split("@")[0]}`;
    m.reply(correctReply, null, { mentions: [m.sender] });

    // Tidak tampilkan daftar jawaban di sini
    let isWin = room.terjawab.every(Boolean);
    if (!isWin) return true;
  }

  // Jika nyerah atau semua jawaban sudah ditemukan
  let hasil = room.jawaban.map((jawaban, i) => {
    let penjawab = room.terjawab[i];
    return penjawab
      ? `✅ (${i + 1}) ${jawaban} - @${penjawab.split("@")[0]}`
      : `❌ (${i + 1}) ${jawaban}`;
  }).join("\n");

  let resultMessage = `
🎮 *Family 100*

📌 *Soal:* ${room.soal}

${isSurrender ? "🛑 *MENYERAH!* Berikut semua jawabannya:" : "🎉 *SELESAI!* Semua jawaban ditemukan!"}

${hasil}
`.trim();

  await this.reply(m.chat, resultMessage, null, {
    mentions: this.parseMention(resultMessage),
  });

  delete this.family[id];
  return true;
}