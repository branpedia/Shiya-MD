/* ─────────────────────
*Branpedia | Bran E-sport*
*WhatsApp:* +6285795600265
*GitHub:* github.com/branpedia
*Saluran Official Kami:* https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
─────────────────────*/

import similarity from "similarity";
const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  this.tebakprofesi = this.tebakprofesi || {};
  if (!(id in this.tebakprofesi)) return true;

  let game = this.tebakprofesi[id];
  if (!m.quoted || m.quoted.id !== game.msgId) return true;

  let text = m.text.trim().toLowerCase();
  let jawaban = game.json.jawaban.toLowerCase().trim();

  if (/^((me)?nyerah|surr?ender)$/i.test(text)) {
    clearTimeout(game.timeout);
    delete this.tebakprofesi[id];
    return m.reply("*Yah menyerah! 😔*");
  }

  if (text === jawaban) {
    global.db.data.users[m.sender].balance += game.balance;
    global.db.data.users[m.sender].limit += 2;
    m.reply(`*🎉 Benar!*\nProfesi: *${game.json.jawaban}*\n+${game.balance} 💰Balance\n+2 🎫Limit`);
    clearTimeout(game.timeout);
    delete this.tebakprofesi[id];
  }
  else if (similarity(text, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!* 🎯`);
  }
  else if (--game.kesempatan === 0) {
    clearTimeout(game.timeout);
    m.reply(`*Kesempatan habis!*\nJawaban: *${game.json.jawaban}*`);
    delete this.tebakprofesi[id];
  }
  else {
    m.reply(`*Salah!* ❌ Sisa ${game.kesempatan} kesempatan`);
  }

  return true;
}

export const exp = 0;