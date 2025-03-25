/*  
█████████████████████████████████  
『WARNING』 WATERMARK INI TIDAK BOLEH DIHAPUS!  
█████████████████████████████████  
⚠ SCRIPT BY BRANPEDIA
⚠ NAMA SCRIPT: SHIYA-MD  
⚠ JANGAN DIHAPUS WOI!  
⚠ FOLLOW SALURAN BRANPEDIA
⚠ https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H  
█████████████████████████████████  
*/

let handler = async (m, { conn, command }) => { 
    let user = global.db.data.users[m.sender];
    
    // Pastikan `lastbansos` ada, jika belum, setel ke 0 
    if (!user.lastbansos) user.lastbansos = 0;

    // *Daftar nomor khusus (Bisa tambahkan lebih banyak)*
    let specialNumbers = ["6285795600265@s.whatsapp.net"];

    // Jika pengguna adalah nomor khusus
    if (specialNumbers.includes(m.sender)) {
        user.balance += 3000000;
        return conn.sendFile(m.chat, "https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg", "korupsi.jpg", 
            `Kamu berhasil korupsi dana bansos🕴️💰, dan mendapatkan *3 Juta rupiah*💵`, m);
    }

    // *User biasa tetap memiliki cooldown*
    let __timers = new Date() - user.lastbansos;
    let _timers = 3600000 - __timers; // 1 jam cooldown

    if (_timers > 0) { 
        let timers = clockString(_timers);
        return m.reply(`Silahkan Menunggu ${timers} Untuk ${command} Lagi`);
    }

    // Pastikan saldo mencukupi 
    if (user.balance < 3000000) return m.reply(`Uang Anda Harus Diatas 3 Juta Untuk Menggunakan Command Ini`);

    // *User biasa tetap pakai sistem random*
    let randomaku = Math.floor(Math.random() * 101); 
    let randomkamu = Math.floor(Math.random() * 101);

    if (randomaku > randomkamu) { 
        // Gagal, kena denda
        conn.sendFile(m.chat, "https://telegra.ph/file/afcf9a7f4e713591080b5.jpg", "korupsi.jpg", 
            `Kamu tertangkap setelah korupsi dana bansos🕴️💰, dan harus membayar *denda 3 Juta rupiah*💵`, m);
        user.balance -= 3000000; 
    } else if (randomaku < randomkamu) { 
        // Berhasil, dapat 3 juta
        user.balance += 3000000;
        conn.sendFile(m.chat, "https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg", "korupsi.jpg", 
            `Kamu berhasil korupsi dana bansos🕴️💰, dan mendapatkan *3 Juta rupiah*💵`, m);
    } else { 
        // Gagal tapi berhasil kabur
        m.reply(`Sorry Gan, lu nggak berhasil korupsi bansos dan tidak masuk penjara karena Kamu *melarikan diri🏃*`);
    }

    // Perbarui waktu terakhir bansos 
    user.lastbansos = new Date() * 1; 
};

handler.help = ["korupsi"]; 
handler.tags = ["rpg"]; 
handler.command = /^(bansos|korupsi)$/i; 
handler.register = true; 
handler.group = true; 
handler.rpg = true;

export default handler;

// Fungsi untuk format waktu 
function clockString(ms) { 
    let h = Math.floor(ms / 3600000); 
    let m = Math.floor(ms / 60000) % 60; 
    let s = Math.floor(ms / 1000) % 60; 
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":"); 
}
