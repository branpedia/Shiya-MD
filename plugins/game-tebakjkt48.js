import axios from 'axios';

const usedImages = new Set(); // Gunakan Set untuk menyimpan data foto yang sudah digunakan

const handler = async (m, { conn, command, usedPrefix }) => {
  // Ambil soal dari API
  try {
    const response = await axios.get("https://api.botcahx.eu.org/api/game/tebakjkt48?apikey=branpedia");
    const soal = response.data;

    if (!conn.tebakJKT48) conn.tebakJKT48 = {};
    if (m.sender in conn.tebakJKT48) {
      m.reply("Kamu masih punya pertanyaan yang belum selesai!");
      return;
    }

    // Ambil soal acak dan skip foto yang sudah digunakan
    let randomSoal;
    do {
      randomSoal = soal[Math.floor(Math.random() * soal.length)];
    } while (usedImages.has(randomSoal.img));

    // Simpan foto yang digunakan
    usedImages.add(randomSoal.img);

    const imgUrl = randomSoal.img;
    const jawaban = randomSoal.jawaban.toLowerCase();

    conn.tebakJKT48[m.sender] = {
      answer: jawaban,
      timeout: setTimeout(() => {
        delete conn.tebakJKT48[m.sender];
        m.reply(`Waktu habis! Jawabannya adalah *${randomSoal.jawaban}*.`);
      }, 120 * 1000), // 2 menit
    };

    m.reply(`
    *Tebak JKT48*
    Petunjuk: Lihat gambar di bawah ini dan ketik jawabanmu dalam waktu 2 menit!
    `);

    conn.sendFile(m.chat, imgUrl, "jkt48.jpg", "Siapa dia?", m);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    m.reply("Terjadi kesalahan saat mengambil data dari API. Silahkan coba lagi nanti.");
  }
};

handler.before = async (m, { conn }) => {
  if (!conn.tebakJKT48 || !(m.sender in conn.tebakJKT48)) return;
  const game = conn.tebakJKT48[m.sender];

  if (m.text.toLowerCase() === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakJKT48[m.sender];

    // Pastikan data user ada
    if (!conn.user) conn.user = {};
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0, winStreak: 0, loseStreak: 0 };

    // Tambahkan hadiah
    conn.user[m.sender].money += 30; // Tambah uang 30
    conn.user[m.sender].limit += 2; // Tambah limit 2
    conn.user[m.sender].winStreak += 1; // Tambah win streak
    conn.user[m.sender].loseStreak = 0; // Reset lose streak

    let replay;
    if (conn.user[m.sender].winStreak === 1) {
      replay = "Apakah kamu bisa menjawab soal selanjutnya? 🤔";
    } else if (conn.user[m.sender].winStreak === 2) {
      replay = "Wih, boleh juga kamu ya! 😎";
    } else if (conn.user[m.sender].winStreak >= 3) {
      replay = `Kamu sangat pintar! Kamu sudah menang ${conn.user[m.sender].winStreak} kali berturut-turut! 🤩`;
    }

    m.reply(`
    Selamat! Jawaban kamu benar: *${game.answer.toUpperCase()}*.
    Kamu mendapatkan:
    💰 30 uang
    📈 2 limit.
    Win Streak: ${conn.user[m.sender].winStreak}
    Total uang: ${conn.user[m.sender].money}
    Total limit: ${conn.user[m.sender].limit}
    `);

    m.reply(replay);
  } else {
    if (!conn.user[m.sender]) conn.user[m.sender] = { money: 0, limit: 0, winStreak: 0, loseStreak: 0 };
    conn.user[m.sender].loseStreak += 1; // Tambah lose streak
    conn.user[m.sender].winStreak = 0; // Reset win streak

    const ejekan = [
      "Kamu sangat payah!",
      "Kamu tidak bisa menjawab!",
      "Kamu harus berlatih lebih keras!",
      "Kamu kalah terus, apa kamu sedih?",
      "Kamu harus lebih baik dari ini!",
      "Kamu tidak pantas menjadi juara!",
      "Kamu harus berusaha lebih keras!",
      "Kamu kalah, tapi jangan menyerah!",
      "Kamu harus lebih cerdas dari ini!",
      "Kamu kalah, tapi jangan putus asa!",
    ];

    let replay;
    if (conn.user[m.sender].loseStreak === 1) {
      replay = "Ah, kamu kurang beruntung. Ayo coba lagi! 😅";
    } else if (conn.user[m.sender].loseStreak >= 2) {
      const randomEjekan = ejekan[Math.floor(Math.random() * ejekan.length)];
      replay = `${randomEjekan}`;
    }

    m.reply(replay);
  }
};

handler.help = ["tebakjkt48"];
handler.tags = ["game"];
handler.command = /^(tebakjkt48|tebak jkt48)$/i;
handler.limit = false;

export default handler;