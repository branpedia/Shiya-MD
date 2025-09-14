import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.caklontong = this.caklontong || {};
  if (!(id in this.caklontong)) return true;

  let game = this.caklontong[id];

  // hanya tanggapi jika user reply pesan soal
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  return cekJawaban(m, this, id, m.text.trim().toLowerCase(), game);
}

function cekJawaban(m, conn, id, text, game) {
  let jawaban = game.json.jawaban.toLowerCase().trim();

  if (text === jawaban) {
    global.db.data.users[m.sender].exp += game.poin;
    conn.reply(m.chat, `*🎉 Benar!* +${game.poin} XP\n📝 ${game.json.deskripsi}`, m);
    clearTimeout(game.timeout);
    delete conn.caklontong[id];
  } else if (similarity(text, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\n📑 Jawaban: *${game.json.jawaban}*\n📝 ${game.json.deskripsi}`);
    delete conn.caklontong[id];
  } else {
    m.reply(`*Jawaban Salah!* Masih ada ${game.kesempatan} kesempatan`);
  }
}

export const exp = 0;