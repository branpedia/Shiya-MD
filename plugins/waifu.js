let handler = async (m, { conn, args }) => {
  try {
    // Jika pengguna memasukkan argumen, gabungkan sebagai parameter tag,
    // misalnya: .waifu maid,oppai atau .waifu marin-kitagawa
    let tags = args.length ? args.join(' ') : "marin-kitagawa";
    // Buat URL API dengan parameter included_tags sesuai input (pastikan formatnya benar)
    let apiUrl = `https://api.waifu.im/search/?included_tags=${encodeURIComponent(tags)}`;

    // Ambil data JSON dari API
    let res = await fetch(apiUrl);
    let json = await res.json();

    // Pastikan ada gambar dalam response
    if (!json.images || json.images.length === 0) {
      return m.reply(`Tidak ada gambar yang ditemukan untuk tag: ${tags}`);
    }

    // Pilih 1 gambar secara acak dari array yang dikembalikan
    let randomImage = json.images[Math.floor(Math.random() * json.images.length)];
    let imageUrl = randomImage.url;

    // Buat caption yang menampilkan tag gambar (jika tersedia)
    let imageTags = randomImage.tags ? randomImage.tags.map(tag => tag.name).join(', ') : tags;
    let caption = `Ini gambar random dengan tag:\n${imageTags}`;

    // Kirim gambar ke chat
    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption });
  } catch (error) {
    console.error(error);
    return m.reply("Gagal mengambil gambar waifu.");
  }
}

handler.help = ['waifu <tags>']
handler.tags = ['anime']
handler.command = /^(waifu)$/i
handler.limit = true

export default handler;
