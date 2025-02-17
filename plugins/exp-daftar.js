/* ─────────────────────
*Branpedia | Bran E-sport*
WhatsApp: +6285795600265
GitHub: github.com/branpedia
─────────────────────*/

import { createHash } from 'crypto';

// Daftar bahasa dan pesan yang sesuai
const languageMessages = {
  'id': {
    alreadyRegistered: '🚫 *Kamu sudah terdaftar, nih!*\n\n📛 *Nama:* {name}\n🔑 *SN:* {sn}\n📅 *Tanggal Daftar:* {regTime}',
    registrationSuccess: '🎉 *Selamat! Kamu resmi terdaftar!*\n\n📛 *Nama:* {name}\n🔑 *SN:* {sn}\n📅 *Tanggal Daftar:* {regTime}\n\n_Jangan lupa simpan SN kamu, ya!_ 😉',
    checkSN: '🔍 *Ini data registrasi kamu!*\n\n📛 *Nama:* {name}\n🔑 *SN:* {sn}\n📅 *Tanggal Daftar:* {regTime}',
    notRegistered: '❌ *Kamu belum terdaftar, nih!* Ketik *daftar* buat registrasi dulu.',
    unregisterSuccess: '🗑️ *Data kamu udah dihapus!* Kalo mau daftar lagi, ketik *daftar*.',
    unregisterNotRegistered: '❌ *Kamu belum terdaftar, nih!*',
    sendToPC: '📩 *Cek PC kamu, ya! Data udah dikirim ke chat pribadi.*'
  },
  'en': {
    alreadyRegistered: '🚫 *You are already registered!*\n\n📛 *Name:* {name}\n🔑 *SN:* {sn}\n📅 *Registration Date:* {regTime}',
    registrationSuccess: '🎉 *Congratulations! You are officially registered!*\n\n📛 *Name:* {name}\n🔑 *SN:* {sn}\n📅 *Registration Date:* {regTime}\n\n_Don\'t forget to save your SN!_ 😉',
    checkSN: '🔍 *Here is your registration data!*\n\n📛 *Name:* {name}\n🔑 *SN:* {sn}\n📅 *Registration Date:* {regTime}',
    notRegistered: '❌ *You are not registered yet!* Type *register* to sign up.',
    unregisterSuccess: '🗑️ *Your data has been deleted!* If you want to register again, type *register*.',
    unregisterNotRegistered: '❌ *You are not registered yet!*',
    sendToPC: '📩 *Check your private chat! The data has been sent to your private chat.*'
  }
};

// Fungsi untuk menentukan bahasa berdasarkan nomor telepon
const getLanguage = (phoneNumber) => {
  if (phoneNumber.startsWith('+62')) return 'id'; // Indonesia
  return 'en'; // Default ke Bahasa Inggris
};

let handler = async (m, { conn, usedPrefix, command }) => {
  // Ambil data pengguna dari database global
  let user = global.db.data.users[m.sender];

  // Tentukan bahasa berdasarkan nomor telepon pengguna
  const language = getLanguage(m.sender.split('@')[0]);

  // Fungsi untuk mengirim pesan ke private chat jika perintah berasal dari grup
  const sendPrivateMessage = async (message) => {
    if (m.isGroup) {
      await conn.sendMessage(m.sender, { text: message }, { quoted: m });
      await conn.reply(m.chat, languageMessages[language].sendToPC, m);
    } else {
      await conn.reply(m.chat, message, m);
    }
  };

  // Fungsi untuk menghasilkan SN unik
  const generateSN = (id) => {
    return 'branpedia-' + createHash('md5').update(id).digest('hex');
  };

  // Fungsi untuk membuat mention yang benar
  const getUserMention = (sender) => {
    return `@${sender.split('@')[0]}`; // Format mention sebagai string
  };

  // Perintah registrasi
  if (/^(daftar|register)$/i.test(command)) {
    if (user && user.registered) {
      await sendPrivateMessage(
        languageMessages[language].alreadyRegistered
          .replace('{name}', getUserMention(m.sender))
          .replace('{sn}', user.sn)
          .replace('{regTime}', user.regTime)
      );
    } else {
      // Inisialisasi data pengguna
      user.registered = true;
      user.name = getUserMention(m.sender); // Gunakan mention sebagai nama
      user.sn = generateSN(m.sender);
      user.regTime = new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US', { timeZone: language === 'id' ? 'Asia/Jakarta' : 'UTC' });

      await sendPrivateMessage(
        languageMessages[language].registrationSuccess
          .replace('{name}', user.name)
          .replace('{sn}', user.sn)
          .replace('{regTime}', user.regTime)
      );
    }
  }

  // Perintah cek SN
  if (/^ceksn$/i.test(command)) {
    if (user && user.registered) {
      await sendPrivateMessage(
        languageMessages[language].checkSN
          .replace('{name}', user.name)
          .replace('{sn}', user.sn)
          .replace('{regTime}', user.regTime)
      );
    } else {
      await conn.reply(m.chat, languageMessages[language].notRegistered, m);
    }
  }

  // Perintah unregistrasi
  if (/^unreg$/i.test(command)) {
    if (user && user.registered) {
      user.registered = false;
      user.name = '';
      user.sn = '';
      user.regTime = '';
      await conn.reply(m.chat, languageMessages[language].unregisterSuccess, m);
    } else {
      await conn.reply(m.chat, languageMessages[language].unregisterNotRegistered, m);
    }
  }
};

handler.help = ['daftar', 'ceksn', 'unreg'];
handler.tags = ['main'];
handler.command = /^(daftar|register|ceksn|unreg)$/i;

export default handler;
