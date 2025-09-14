import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebaksurah = this.tebaksurah || {};
  if (!(id in this.tebaksurah)) return true;

  let game = this.tebaksurah[id];

  // harus reply ke soal
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
  if (isSurrender) {
    clearTimeout(game.timeout);
    delete this.tebaksurah[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  let jawaban = game.json.surah.englishName.toLowerCase().trim();
  let teks = m.text.toLowerCase().trim();

  if (teks === jawaban) {
    global.db.data.users[m.sender].exp += game.poin;
    m.reply(`*🎉 Benar!*\n+${game.poin} XP`);
    clearTimeout(game.timeout);
    delete this.tebaksurah[id];
  } else if (similarity(teks, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else {
    m.reply(`*❌ Salah!*`);
  }

  return true;
}

export const exp = 0;