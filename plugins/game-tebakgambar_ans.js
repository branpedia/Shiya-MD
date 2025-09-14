import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebakgambar = this.tebakgambar || {};
  if (!(id in this.tebakgambar)) return true;

  if (!m.quoted || m.quoted.id !== this.tebakgambar[id][0].id) return true;

  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
  if (isSurrender) {
    clearTimeout(this.tebakgambar[id][4]);
    delete this.tebakgambar[id];
    return m.reply("*Yah Menyerah :( !*");
  }

  let json = this.tebakgambar[id][1];
  return cekJawaban(m, this, id, m.text, json);
}

function cekJawaban(m, conn, id, jawabanUser, json) {
  if (jawabanUser.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
    global.db.data.users[m.sender].exp += conn.tebakgambar[id][2];
    m.reply(`*🎉 Benar!*\n+${conn.tebakgambar[id][2]} XP`);
    clearTimeout(conn.tebakgambar[id][4]);
    delete conn.tebakgambar[id];
  } else if (similarity(jawabanUser.toLowerCase().trim(), json.jawaban.toLowerCase().trim()) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--conn.tebakgambar[id][3] === 0) {
    clearTimeout(conn.tebakgambar[id][4]);
    m.reply(`*Kesempatan habis!*\nJawaban: *${json.jawaban}*`);
    delete conn.tebakgambar[id];
  } else {
    m.reply(`*Jawaban Salah!* Masih ada ${conn.tebakgambar[id][3]} kesempatan`);
  }
}

export const exp = 0;