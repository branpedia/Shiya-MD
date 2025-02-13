import util from "util";
import path from "path";

let handler = async (m, { conn }) => {
    // Daftar audio dari URL yang diberikan
    const baka = [
        "https://8030.us.kg/file/T7ZKBxrbElhr.mp3",
        "https://8030.us.kg/file/MBAI5lPDWQTy.mp3"
    ];

    // Pilih audio secara acak dari daftar
    let randomAudio = baka[Math.floor(Math.random() * baka.length)];

    // Kirim file audio ke chat
    conn.sendFile(m.chat, randomAudio, "ara.mp3", null, m, true, {
        type: "audioMessage",
        ptt: true,
    });
};

// Custom prefix untuk mendeteksi kata-kata tertentu
handler.customPrefix = /^(anjing|kontol|memek|bangsat|babi|goblok|goblog|kntl|pepek|ppk|ngentod|ngentd|ngntd|kentod|kntd|bgst|anjg|anj|fuck|hitam|ireng|jawir|gay|asw|asu|ktl|jancuk|pantek|jing|bodoh|poke|tolol)$/i;

// Perintah handler (regex kosong untuk menangani customPrefix)
handler.command = new RegExp();

export default handler;