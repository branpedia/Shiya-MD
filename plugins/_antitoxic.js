let badwordRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;

// Array quteqs edukatif
const islamicQuotes = [
    {
        quote: "❝ Jangan toxic ya. Perkataan yang menyakitkan bisa jadi dosa. ❞",
        reference: "QS. Al-Baqarah: 263"
    },
    {
        quote: "❝ Katakanlah yang baik, atau diam. ❞",
        reference: "HR. Bukhari & Muslim"
    },
    {
        quote: "❝ Celakalah bagi pencela dan pengumpat. ❞",
        reference: "QS. Al-Humazah: 1"
    },
    {
        quote: "❝ Ucapan yang baik lebih baik daripada sedekah yang disertai kata menyakitkan. ❞",
        reference: "QS. Al-Baqarah: 263"
    },
    {
        quote: "❝ Allah tidak suka ucapan buruk secara terang-terangan. ❞",
        reference: "QS. An-Nisa: 148"
    },
    {
        quote: "❝ Seorang mukmin bukanlah orang yang suka mencaci dan berkata keji. ❞",
        reference: "HR. Tirmidzi"
    },
    {
        quote: "❝ Allah memerintahkan kita mengucapkan yang terbaik. ❞",
        reference: "QS. Al-Isra: 53"
    }
];

// Fungsi ambil quote acak
function getRandomQuote() {
    const item = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
    return `${item.quote}\n📖 *${item.reference}*`;
}

export function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0;

    let chat = global.db.data.chats[m.chat] || {};
    let user = global.db.data.users[m.sender] || {};

    user.warning = user.warning || 0;

    let isBadword = badwordRegex.exec(m.text);
    console.log(isBadword);

    if (chat.antiBadword && isBadword) {
        user.warning += 1;

        const quote = getRandomQuote();

        m.reply(`❗ *Jangan Toxic ya!*\n⚠️ Kamu memiliki *${user.warning} warning*.\n${quote}\n\nUntuk mematikan fitur ini, ketik *.disable antibadword*`);

        if (user.warning >= 5) {
            user.banned = false;
            user.warning = 0;

            if (m.isGroup && isBotAdmin) {
                this.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            }
        }
    }
    return !0;
}

/* let badwordRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;

export function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0;

    let chat = global.db.data.chats[m.chat] || {};
    let user = global.db.data.users[m.sender] || {};

    // Inisialisasi default jika belum ada
    user.warning = user.warning || 0;

    let isBadword = badwordRegex.exec(m.text);
    console.log(isBadword);

    if (chat.antiBadword && isBadword) {
        user.warning += 1;
        m.reply(`❗ Jangan Toxic ya!\n⚠️ Kamu memiliki *${user.warning} warning*.\nUntuk mematikan fitur ini ketik *.disable antibadword*`);

        if (user.warning >= 5) {
            user.banned = false;
            user.warning = 0;

            if (m.isGroup && isBotAdmin) {
                this.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            }
        }
    }
    return !0;
}
*/