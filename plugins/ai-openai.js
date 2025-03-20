import fetch from 'node-fetch';

let history = {}; // Menyimpan riwayat percakapan per pengguna

let handler = async (m, { conn, text }) => {
  let user = m.sender;
  let hasImage = m.quoted && m.quoted.mtype.includes('imageMessage'); // Cek apakah ada gambar

  if (!text && !hasImage) {
    return m.reply('❌ Kirim pertanyaan atau gambar!\n\nContoh: `.ai itu singkil?` sambil reply gambar.');
  }

  // Batasi riwayat percakapan (maksimal 10 pesan sebelumnya)
  if (!history[user]) history[user] = [];
  if (history[user].length > 10) history[user].shift();

  let messages = history[user];

  if (text) {
    messages.push({ role: "user", content: text });
  }

  // Jika ada gambar, ambil URL gambar
  let imageURL;
  if (hasImage) {
    try {
      let media = await conn.downloadAndSaveMediaMessage(m.quoted);
      let imgUpload = await uploadImage(media); // Upload gambar ke penyimpanan dan dapatkan URL
      imageURL = imgUpload.url;
    } catch (err) {
      console.error('❌ Gagal mengunggah gambar:', err);
      return m.reply(`⚠️ Gagal mengunggah gambar. Pastikan format gambar didukung.\n\nDetail error: ${err.message}`);
    }
  }

  // Kirim permintaan ke OpenAI
  try {
    let payload = {
      model: "gpt-4o-mini", // Model Gratisan :3
      messages: messages,
      max_tokens: 500
    };

    // Tambahkan input gambar jika ada
    if (imageURL) {
      payload.messages.push({
        role: "user",
        content: [
          { type: "text", text: text || "Apa isi gambar ini?" },
          { type: "image_url", image_url: imageURL }
        ]
      });
    }

    let res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer Youkey`, // Ganti dengan API Key OpenAI
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errText = await res.text();
      throw new Error(`API OpenAI Error: ${res.status} - ${res.statusText}\n\n${errText}`);
    }

    let json = await res.json();
    if (!json.choices || json.choices.length === 0) throw new Error("❌ Gagal mendapatkan respons dari AI.");

    let replyText = json.choices[0].message.content.trim();
    
    // Simpan respons AI ke riwayat
    messages.push({ role: "assistant", content: replyText });

    // Kirim balasan ke pengguna
    await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });
  } catch (e) {
    console.error('❌ Error AI Chatbot:', e);
    m.reply(`⚠️ Terjadi kesalahan saat berkomunikasi dengan AI.\n\nDetail error: ${e.message}`);
  }
};

async function uploadImage(buffer) {
  try {
    let res = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: JSON.stringify([{ name: 'file', file: buffer.toString('base64') }]),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      let errText = await res.text();
      throw new Error(`Gagal mengunggah gambar: ${res.status} - ${res.statusText}\n\n${errText}`);
    }

    let json = await res.json();
    if (!json[0] || !json[0].src) throw new Error('Gagal mendapatkan URL gambar dari Telegra.ph.');

    return { url: 'https://telegra.ph' + json[0].src };
  } catch (err) {
    throw new Error(`❌ Kesalahan saat upload gambar: ${err.message}`);
  }
}

handler.help = ['ai <pertanyaan> atau reply gambar'];
handler.tags = ['ai'];
handler.command = /^(ai|chatgpt)$/i;
handler.limit = true;

export default handler;
