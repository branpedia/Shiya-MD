import axios from 'axios';
import FormData from 'form-data';

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  // Cek apakah ada media, jika tidak ada, kirim pesan "Mana medianya?"
  if (!mime) {
    return m.reply('Mana medianya? Balas dengan media apa saja!');
  }

  let media = await q.download(); // Download media

  // Kirim pesan "Loading" saat proses upload dimulai
  m.reply('🔄 Loading, mohon tunggu...');

  // Tentukan nama file default jika MIME tidak memberikan informasi cukup
  let fileName = 'uploaded_file';
  if (mime.includes('/')) {
    let ext = mime.split('/')[1];
    fileName += `.${ext}`;
  }

  // Prepare FormData untuk API 8030.us.kg
  let formData = new FormData();
  formData.append('file', media, {
    filename: fileName,
    contentType: mime,
  });

  // Make a POST request ke API 8030.us.kg
  try {
    let response = await axios.post('https://8030.us.kg/api/upload.php', formData, {
      headers: {
        ...formData.getHeaders(), // Sertakan header dari FormData
      },
    });

    let data = response.data;

    if (data.status) {
      // Extract hasil dari API
      let fileUrl = data.result.url;
      let fileName = data.result.filename;
      let fileType = data.result.mimetype;
      let fileSize = data.result.size;

      // Kirim respon dengan link dari API
      m.reply(`
🌐 *Uploaded File:*\n${fileUrl}
📂 *File Name:* ${fileName}
📄 *File Type:* ${fileType}
📊 *File Size:* ${fileSize} bytes
      `);
    } else {
      m.reply(`❌ Gagal mengunggah file: ${data.message}`);
    }
  } catch (error) {
    console.error('Error uploading to 8030.us.kg:', error);
    m.reply('Terjadi kesalahan saat mengunggah file.');
  }
};

handler.help = ['tourl (reply media)'];
handler.tags = ['tools'];
handler.command = /^(tourl|upload)$/i;

export default handler;