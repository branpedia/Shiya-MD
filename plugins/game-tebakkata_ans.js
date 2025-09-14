import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebakkata = this.tebakkata || {};
  if (!(id in this.tebakkata)) return !0;

  let game = this.tebakkata[id];

  // hanya tanggapi jika user reply pesan soal
  if (
    m.quoted &&
    m.quoted.id === game.msgId && // ✅ cek id soal
    m.text &&
    !/.*teka/i.test(m.text)
  ) {
    return checkJawaban.call(this, m, m.text.trim().toLowerCase(), id);
  }

  return !0;
}

function checkJawaban(m, text, id) {
  let game = this.tebakkata[id];
  let jawaban = game.json.jawaban.toLowerCase().trim();

  if (/^((me)?nyerah|surr?ender)$/i.test(text)) {
    clearTimeout(game.timeout);
    delete this.tebakkata[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  if (text === jawaban) {
    let hadiah = game.hadiah;
    global.db.data.users[m.sender].exp += hadiah.exp;
    global.db.data.users[m.sender].limit += hadiah.limit;
    global.db.data.users[m.sender].balance += hadiah.balance;

    m.reply(`*Benar!*\n+${hadiah.exp} XP\n+${hadiah.limit} Limit\n+${hadiah.balance} Balance`);
    clearTimeout(game.timeout);
    delete this.tebakkata[id];
  } else if (similarity(text, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    delete this.tebakkata[id];
    this.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${jawaban}*`, m);
  } else {
    m.reply(`*Jawaban Salah!*\nMasih ada ${game.kesempatan} kesempatan`);
  }
}

export const exp = 0;