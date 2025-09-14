import fetch from "node-fetch";
let timeout = 120000;
let poin = 4999;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaksurah = conn.tebaksurah || {};
  let id = m.chat;

  if (id in conn.tebaksurah) {
    return conn.reply(m.chat, "⚠️ Masih ada soal yang belum terjawab di chat ini", conn.tebaksurah[id].msg);
  }

  let totalAyat = 6236;
  let randomAyat = Math.floor(Math.random() * totalAyat) + 1;

  let res = await fetch(`https://api.alquran.cloud/v1/ayah/${randomAyat}/ar.alafasy`);
  if (res.status !== 200) throw await res.text();

  let result = await res.json();
  let json = result.data;

  if (result.code === 200) {
    let caption = `
📖 *${command.toUpperCase()}*

Number in Surah: ${json.numberInSurah}
By: ${json.edition.name} (${json.edition.englishName})

⏳ Waktu *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik *${usedPrefix}hsur* untuk bantuan
🎁 Bonus: ${poin} XP

*Balas pesan ini untuk menjawab!*
`.trim();

    let info = `
✨ Surah: ${json.surah.englishName}
📌 Surah Number: ${json.surah.number}
📖 Name: ${json.surah.name} (${json.surah.englishName})
🔤 Translation: ${json.surah.englishNameTranslation}
🔢 Total Ayat: ${json.surah.numberOfAyahs}
🌍 Type: ${json.surah.revelationType}
`;

    let soalMsg = await conn.reply(m.chat, caption, m);

    conn.tebaksurah[id] = {
      msg: soalMsg,
      msgId: soalMsg.key.id,
      json,
      poin,
      info,
      timeout: setTimeout(() => {
        if (conn.tebaksurah[id]) {
          conn.reply(m.chat, `⏳ Waktu habis!\nJawabannya adalah:\n${info}`, conn.tebaksurah[id].msg);
          delete conn.tebaksurah[id];
        }
      }, timeout),
    };

    await conn.sendFile(m.chat, json.audio, "ayat.mp3", "🎧 Dengarkan ayat di atas", m);
  } else if (result.code === 404) {
    m.reply(`⚠️ Ulangi! Command ${usedPrefix + command} gagal: ${json.data}`);
  }
};

handler.help = ["tebaksurah"];
handler.tags = ["game"];
handler.command = /^tebaksurah/i;
handler.register = true;

export default handler;