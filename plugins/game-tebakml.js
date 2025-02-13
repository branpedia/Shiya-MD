import fetch from "node-fetch";

const handler = async (m, { conn, command, usedPrefix }) => {
  // Ambil soal dari GitHub
  const response = await fetch(
    "https://raw.githubusercontent.com/VynaaValerie/database-game/main/Tebak-gameml.json"
  );
  const soal = await response.json();

  if (!conn.tebakML) conn.tebakML = {};

  if (m.sender in conn.tebakML) {
    m.reply("Kamu masih punya pertanyaan yang belum selesai!");
    return;
  }

  // Pilih soal acak
  const randomSoal = soal[Math.floor(Math.random() * soal.length)];
  const imgUrl = randomSoal.img;
  const jawaban = randomSoal.jawaban.toLowerCase();
  const deskripsi = randomSoal.deskripsi;

  conn.tebakML[m.sender] = {
    answer: jawaban,
    timeout: setTimeout(() => {
      delete conn.tebakML[m.sender];
      m.reply(`Waktu habis! Jawabannya adalah *${randomSoal.jawaban}*.`);
    }, 120 * 1000), // 2 menit
  };

  m.reply(
    `*Tebak Mobile Legends*\n\nPetunjuk: ${deskripsi}\nLihat gambar di bawah ini dan ketik jawabanmu dalam waktu 2 menit!`
  );
  conn.sendFile(m.chat, imgUrl, "ml.jpg", "Siapa hero ini?", m);
};

handler.before = async (m, { conn }) => {
  if (!conn.tebakML || !(m.sender in conn.tebakML)) return;

  const game = conn.tebakML[m.sender];
  if (m.text.toLowerCase() === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakML[m.sender];

    // Pastikan objek user ada
    if (!conn.user) conn.user = {};
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0 };

    // Tambahkan hadiah
    conn.user[m.sender].money += 25; // Tambah uang 25
    conn.user[m.sender].limit += 1; // Tambah limit 1

    m.reply(
      `Selamat! Jawaban kamu benar: *${game.answer.toUpperCase()}*.\n\nKamu mendapatkan:\n💰 25 uang\n📈 1 limit.\n\n💵 Total uang: ${conn.user[m.sender].money}\n📊 Total limit: ${conn.user[m.sender].limit}`
    );
  } else {
    m.reply("Jawaban salah! Coba lagi.");
  }
};

handler.help = ["tebakml"];
handler.tags = ["game"];
handler.command = /^(tebakml|tebak ml)$/i;
handler.limit = false;

export default handler;