let handler = async (m, { conn }) => {
  // Definisi caption
  let caption = `
    *Waalaikummussalam warahmatullahi wabarokatuh*
    _📚 Baca yang dibawah ya!_

    Orang yang mengucapkan salam seperti ini maka ia mendapatkan 30 pahala.
    Kemudian, orang yang dihadapan atau mendengarnya membalas dengan kalimat yang sama,
    yaitu “Wa'alaikum salam warahmatullahi wabarakatuh” atau ditambah dengan yang lain (waridhwaana).

    Artinya selain daripada do'a selamat juga meminta pada Allah SWT
  `.trim();

  // Definisi URL thumbnail
  let thumbnailUrl = 'https://ar-hosting.pages.dev/1738636034003.jpg';

  // Kirim pesan dengan thumbnail
  await conn.sendMessage(m.chat, {
    image: { url: thumbnailUrl },
    caption: caption,
  });
};

// Definisi handler
handler.customPrefix = /^(assalamualaikum|Salom|salam)/i;
handler.command = new RegExp();
export default handler;