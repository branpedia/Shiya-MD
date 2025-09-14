import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.lengkapikalimat = this.lengkapikalimat || {};
  if (!(id in this.lengkapikalimat)) return !0;

  let game = this.lengkapikalimat[id];

  // hanya kalau reply ke soal
  if (
    m.quoted &&
    m.quoted.id === game.msgId &&
    m.text &&
    !/.*hlen/i.test(m.text)
  ) {
    return cekJawaban(m, this, id, m.text.trim());
  }

  return !0;
}

function cekJawaban(m, conn, id, text) {
  let game = conn.lengkapikalimat[id];
  let jawaban = game.json.jawaban.toLowerCase().trim();

  // nyerah
  if (/^((me)?nyerah|surr?ender)$/i.test(text)) {
    clearTimeout(game.timeout);
    delete conn.lengkapikalimat[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  // benar
  if (text.toLowerCase() === jawaban) {
    let hadiah = game.hadiah;
    global.db.data.users[m.sender].exp += hadiah.exp;
    global.db.data.users[m.sender].limit += hadiah.limit;
    global.db.data.users[m.sender].balance += hadiah.balance;

    m.reply(
      `*🎉 Benar!*\n+${hadiah.exp} XP\n+${hadiah.limit} Limit\n+${hadiah.balance} Balance`
    );

    clearTimeout(game.timeout);
    delete conn.lengkapikalimat[id];
  }
  // mirip
  else if (similarity(text.toLowerCase(), jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  }
  // salah habis
  else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\nJawaban: *${game.json.jawaban}*`);
    delete conn.lengkapikalimat[id];
  }
  // salah masih ada kesempatan
  else {
    m.reply(`*Jawaban Salah!* Masih ada ${game.kesempatan} kesempatan`);
  }
}

export const exp = 0;