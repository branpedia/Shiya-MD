import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.siapakahaku = this.siapakahaku || {};
  if (!(id in this.siapakahaku)) return true;

  if (!m.quoted || m.quoted.id !== this.siapakahaku[id][0].id) return true;

  let json = this.siapakahaku[id][1];
  return cekJawaban(m, this, id, m.text, json);
}

function cekJawaban(m, conn, id, jawabanUser, json) {
  if (jawabanUser.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
    global.db.data.users[m.sender].exp += conn.siapakahaku[id][2];
    m.reply(`*🎉 Benar!*\n+${conn.siapakahaku[id][2]} XP`);
    clearTimeout(conn.siapakahaku[id][4]);
    delete conn.siapakahaku[id];
  } else if (similarity(jawabanUser.toLowerCase().trim(), json.jawaban.toLowerCase().trim()) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else if (--conn.siapakahaku[id][3] === 0) {
    clearTimeout(conn.siapakahaku[id][4]);
    m.reply(`*Kesempatan habis!*\nJawaban: *${json.jawaban}*`);
    delete conn.siapakahaku[id];
  } else {
    m.reply(`*Jawaban Salah!* Masih ada ${conn.siapakahaku[id][3]} kesempatan`);
  }
}

export const exp = 0;