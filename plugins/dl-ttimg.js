import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://vt.tiktok.com/xxxxxxx`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const apiRes = await fetch(`https://api.botcahx.eu.org/api/download/tiktokslide?url=${url}&apikey=${global.api.btch}`);
        const apiData = await apiRes.json();

        if (!apiData.status) throw 'Gagal mendownload slide TikTok.';

        const { images, title } = apiData.result;

        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                await conn.sendFile(m.chat, images[i], `slide_${i + 1}.jpg`, `📸 Slide ${i + 1} dari "${title || 'Konten TikTok'}"`, m);
            }
        } else {
            throw 'Slide tidak ditemukan.';
        }

    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['ttslide'];
handler.tags = ['downloader'];
handler.command = /^(ttimg|ttslide)$/i;
handler.premium = false;

export default handler;