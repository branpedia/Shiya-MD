import FormData from "form-data";
import Jimp from "jimp";

let handler = async (m, { conn, usedPrefix, command }) => {
  conn.hdr = conn.hdr || {};
  if (m.sender in conn.hdr)
    return m.reply("⚠️ Proses sebelumnya belum selesai, tunggu sebentar.");

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || "";
  if (!mime) return m.reply("❌ Kirim gambar terlebih dahulu.");
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`❌ Format ${mime} tidak didukung.`);

  conn.hdr[m.sender] = true;
  m.reply("⏳ Sedang memproses HD, harap tunggu...");

  try {
    let img = await q.download?.();
    img = await resizeImage(img); // Kurangi ukuran sebelum dikirim ke API
    const hdImage = await processing(img, "enhance");

    // **Cek apakah hasilnya valid atau rusak**
    if (!hdImage || hdImage.length < 5000) {
      throw new Error("Hasil gambar rusak atau tidak valid.");
    }

    await conn.sendFile(m.sender, hdImage, "enhanced.jpg", "✅ HD sudah selesai!", m);
    m.reply("📩 Hasil sudah dikirim ke private chat!");

  } catch (error) {
    console.error("❌ Error:", error);
    m.reply("❌ Gagal melakukan HD, coba lagi nanti.");

    // **Kembalikan limit jika gagal**
    if (m.limit) m.limit += 10; 

  } finally {
    delete conn.hdr[m.sender];
  }
};

handler.help = ["hd", "remini"];
handler.tags = ["ai"];
handler.command = /^(hd|remini)$/i;
handler.register = true;
handler.limit = 10; // Batasi pemakaian agar server tidak overload
handler.disable = false;

export default handler;

// 📌 Mengurangi ukuran gambar sebelum dikirim ke API
async function resizeImage(imageBuffer, maxWidth = 800) {
  const image = await Jimp.read(imageBuffer);
  image.resize(maxWidth, Jimp.AUTO).quality(80); // Kurangi ukuran & atur kualitas
  return image.getBufferAsync(Jimp.MIME_JPEG);
}

// 📌 Proses HD dengan fetch timeout
async function processing(imageBuffer, method) {
  return new Promise(async (resolve, reject) => {
    let Methods = ["enhance"];
    if (!Methods.includes(method)) method = Methods[0];

    let formData = new FormData();
    formData.append("model_version", "1");
    formData.append("image", imageBuffer, { filename: "image.jpg", contentType: "image/jpeg" });

    const apiURL = `https://inferenceengine.vyro.ai/${method}`;

    try {
      const response = await fetchWithTimeout(apiURL, {
        method: "POST",
        body: formData,
        headers: { "User-Agent": "okhttp/4.9.3" },
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const buffer = await response.buffer();
      
      // **Cek apakah hasilnya valid (bukan file rusak)**
      if (buffer.length < 5000) throw new Error("File hasil terlalu kecil, kemungkinan rusak.");

      resolve(buffer);
    } catch (err) {
      console.error("❌ API Error:", err);
      reject(err);
    }
  });
}

// 📌 Fungsi untuk fetch dengan timeout (agar tidak menunggu terlalu lama)
async function fetchWithTimeout(url, options, timeout = 30000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error("⏳ Request Timeout")), timeout)),
  ]);
                     }
