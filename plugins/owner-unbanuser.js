let handler = async (m, { conn, text, args, isROwner }) => {
    let users = global.db.data.users;

    // Unban semua user yang terkena ban
    if (args[0] === 'all' || args[0] === 'semua') {
        if (!isROwner) throw 'Hanya pemilik utama yang dapat menggunakan perintah ini.';
        
        let bannedUsers = Object.keys(users).filter(user => users[user].banned);
        if (bannedUsers.length === 0) throw 'Tidak ada pengguna yang sedang diblokir.';
        
        let mentions = [];
        bannedUsers.forEach(user => {
            users[user].banned = false;
            users[user].banReason = '';
            conn.sendMessage(user, { text: '✅ Akun Anda telah di-unban oleh pemilik bot. Anda sekarang bisa menggunakan bot kembali.' });
            mentions.push(user);
        });

        conn.sendMessage(m.chat, { 
            text: `✅ Berhasil membebaskan ${bannedUsers.length} pengguna dari ban:\n${mentions.map(v => `@${v.split('@')[0]}`).join('\n')}`, 
            mentions 
        });
        return;
    }

    if (!text && !m.mentionedJid.length) throw 'Siapa yang ingin di-unban? Mention @user atau berikan nomor telepon.';

    let who;
    if (m.mentionedJid.length) {
        who = m.mentionedJid[0];
    } else {
        let phoneNumber = text.replace(/\D/g, ''); // Hapus semua karakter kecuali angka
        if (!phoneNumber.startsWith('62')) throw 'Gunakan format nomor dengan kode negara (contoh: 628xxxxxx)';
        who = phoneNumber + '@s.whatsapp.net';
    }

    if (!users[who]) throw 'Pengguna tidak ditemukan dalam database.';
    if (!users[who].banned) {
        return conn.sendMessage(m.chat, { 
            text: `❌ @${who.split('@')[0]} tidak sedang terkena ban.`, 
            mentions: [who] 
        });
    }

    // Unban user
    users[who].banned = false;
    users[who].banReason = '';

    // Kirim notifikasi ke user yang di-unban
    await conn.sendMessage(who, { text: '✅ Akun Anda telah di-unban oleh pemilik bot. Anda sekarang bisa menggunakan bot kembali.' });

    // Pastikan mention tetap bekerja dengan benar
    conn.sendMessage(m.chat, { 
        text: `✅ @${who.split('@')[0]} telah di-unban!`, 
        mentions: [who] 
    });
};

handler.help = ['unban @user', 'unban 62xxxx', 'unbanall'];
handler.tags = ['owner'];
handler.command = /^unban(all|semua|user)?$/i;
handler.rowner = true;

export default handler;
