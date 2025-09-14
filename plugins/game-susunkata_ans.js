import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.susunkata = this.susunkata || {};
  if (!(id in this.susunkata)) return true;

  let game = this.susunkata[id];

  // harus reply ke soal yang benar
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  let text = m.text.trim();
  let jawaban = game.json.jawaban.toLowerCase().trim();

  // Menyerah
  if (/^((me)?nyerah|surr?ender)$/i.test(text)) {
    clearTimeout(game.timeout);
    delete this.susunkata[id];
    return m.reply("*Yah menyerah :( !*");
  }

  // Benar
  if (text.toLowerCase() === jawaban) {
    global.db.data.users[m.sender].balance += game.balance;
    global.db.data.users[m.sender].limit += 2;
    m.reply(`*🎉 Benar!*\n+${game.balance} 💰Balance\n+2 🎫Limit`);
    clearTimeout(game.timeout);
    delete this.susunkata[id];
  }
  // Mirip
  else if (similarity(text.toLowerCase(), jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  }
  // Salah & kesempatan habis
  else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\nJawaban: *${game.json.jawaban}*`);
    delete this.susunkata[id];
  }
  // Salah masih ada kesempatan
  else {
    m.reply(`*Jawaban Salah!* Masih ada ${game.kesempatan} kesempatan`);
  }

  return true;
}

export const exp = 0;