import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebaklagu = this.tebaklagu || {};
  if (!(id in this.tebaklagu)) return true;

  let game = this.tebaklagu[id];

  // hanya tanggapi jika user reply pesan soal
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
  if (isSurrender) {
    clearTimeout(game.timeout);
    delete this.tebaklagu[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  return cekJawaban(m, this, id, m.text, game);
}

function cekJawaban(m, conn, id, jawabanUser, game) {
  let jawaban = game.json.judul.toLowerCase().trim();
  let t = jawabanUser.toLowerCase().trim();

  if (t === jawaban) {
    global.db.data.users[m.sender].exp += game.poin;
    m.reply(`*🎉 Benar!*\n+${game.poin} XP`);
    clearTimeout(game.timeout);
    delete conn.tebaklagu[id];
  } else if (similarity(t, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\nJawaban: *${game.json.judul}*`);
    delete conn.tebaklagu[id];
  } else {
    m.reply(`*Jawaban Salah!* Masih ada ${game.kesempatan} kesempatan`);
  }
}

export const exp = 0;