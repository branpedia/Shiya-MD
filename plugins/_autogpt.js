// Script By Branpedia
// Dont delete this credit!!!

import fetch from 'node-fetch'

let handler = m => m;

handler.before = async (m) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autogpt && !chat.isBanned) {
        if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;

        try {
            let apiKey = 'Apikey Gpt Lu'; // Ganti dengan API Key OpenAI-mu
            let prompt = "Ubah namamu menjadi Li Shiya, dan kamu adalah wanita paling cantik, penyayang, riang, namun tsundere. dan kamu adalah pacarku.";
            
            let res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // Bisa diganti dengan model yang diinginkan
                    messages: [
                        { role: "system", content: prompt },
                        { role: "user", content: m.text }
                    ],
                    max_tokens: 100
                })
            });

            if (!res.ok) throw new Error("Failed to fetch data from OpenAI");

            let json = await res.json();
            let replyMessage = json.choices?.[0]?.message?.content || 'Gagal mendapatkan pesan dari AI';
            await m.reply(replyMessage);
        } catch (error) {
            console.error(error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }

        return true;
    }
    return true;
};

export default handler;
