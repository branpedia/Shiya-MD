import fetch from "node-fetch";

const handler = async (m, { conn, command, usedPrefix }) => {
  // Ambil soal dari GitHub
  const response = await fetch(
    "https://raw.githubusercontent.com/VynaaValerie/database-game/main/Sambung-Kata.json"
  );
  const soal = await response.json();

  if (!conn.sambungKata) conn.sambungKata = {};

  if (m.sender in conn.sambungKata) {
    m.reply("Kamu masih punya pertanyaan yang belum selesai!");
    return;
  }

  // Pilih soal acak
  const randomSoal = soal[Math.floor(Math.random() * soal.length)];
  const word = randomSoal.kata;
  const petunjuk = randomSoal.petunjuk;

  conn.sambungKata[m.sender] = {
    answer: word.toLowerCase(),
    timeout: setTimeout(() => {
      delete conn.sambungKata[m.sender];
      m.reply(`Waktu habis! Jawabannya adalah *${word}*.`);
    }, 120 * 1000), // 2 menit
  };

  m.reply(
    `*Sambung Kata*\n\nKata awal: *${word.slice(-3).toUpperCase()}...*\nPetunjuk: ${petunjuk}\n\nKetik jawabanmu dalam waktu 2 menit!\n\n*Sambung kata yang dimulai dengan huruf terakhir: "${word.slice(-1).toUpperCase()}"*`
  );
};

handler.before = async (m, { conn }) => {
  if (!conn.sambungKata || !(m.sender in conn.sambungKata)) return;

  const game = conn.sambungKata[m.sender];
  if (m.text.toLowerCase().startsWith(game.answer.slice(-1).toLowerCase())) {
    clearTimeout(game.timeout);
    delete conn.sambungKata[m.sender];

    // Pastikan data user ada
    if (!conn.user) conn.user = {};
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0 };

    // Tambahkan hadiah
    conn.user[m.sender].money += 15; // Tambah uang 15
    conn.user[m.sender].limit += 1; // Tambah limit 1

    m.reply(
      `Selamat! Kamu berhasil menyambung kata dengan benar.\n\nKamu mendapatkan:\n💰 15 uang\n📈 1 limit.\n\n💵 Total uang: ${conn.user[m.sender].money}\n📊 Total limit: ${conn.user[m.sender].limit}`
    );
  } else {
    m.reply("Jawaban salah atau tidak sesuai! Coba lagi.");
  }
};

handler.help = ["sambungkata"];
handler.tags = ["game"];
handler.command = /^(sambungkata|sambung kata)$/i;
handler.limit = false;

export default handler;