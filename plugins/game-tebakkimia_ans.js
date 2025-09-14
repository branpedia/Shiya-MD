import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebakkimia = this.tebakkimia || {};
  if (!(id in this.tebakkimia)) return true;

  let game = this.tebakkimia[id];

  // hanya respon kalau user reply ke soal
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
  if (isSurrender) {
    clearTimeout(game.timeout);
    delete this.tebakkimia[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  return cekJawaban(m, this, id, m.text, game);
}

function cekJawaban(m, conn, id, jawabanUser, game) {
  let jawaban = game.json.unsur.toLowerCase().trim();
  let t = jawabanUser.toLowerCase().trim();

  if (t === jawaban) {
    global.db.data.users[m.sender].exp += game.poin;
    m.reply(`*🎉 Benar!*\n+${game.poin} XP`);
    clearTimeout(game.timeout);
    delete conn.tebakkimia[id];
  } else if (similarity(t, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\nJawaban: *${game.json.unsur}*`);
    delete conn.tebakkimia[id];
  } else {
    m.reply(`*Jawaban Salah!* Masih ada ${game.kesempatan} kesempatan`);
  }
}

export const exp = 0;