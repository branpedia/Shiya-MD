import axios from 'axios';

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Masukkan URL Videy.co!\nContoh: .videy https://videy.co/v/?id=abc123';
  
  // Extract video ID
  const videoId = args[0].match(/[?&]id=([^&]+)/i)?.[1];
  if (!videoId) throw 'Format URL salah! Contoh: https://videy.co/v/?id=xxxx';
  
  const videoUrl = `https://cdn.videy.co/${videoId}.mp4`;
  
  try {
    // Get video details
    const headRes = await axios.head(videoUrl);
    const fileSize = headRes.headers['content-length'];
    const contentType = headRes.headers['content-type'];
    
    if (!fileSize || !contentType.includes('video')) {
      throw 'Video tidak ditemukan atau tidak valid';
    }

    // Format file size - FIXED SYNTAX ERROR
    const formatSize = (bytes) => {
      if (!bytes) return '0 KB';
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };

    // Send video with details
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `📹 Videy.co Downloader\n\n🔹 Ukuran: ${formatSize(fileSize)}\n🔹 Tipe: ${contentType}\n🔹 ID: ${videoId}`
    }, { quoted: m });

  } catch (error) {
    throw `Gagal mengunduh: ${error.message || 'Video tidak tersedia'}`;
  }
};

handler.help = ['videy <url>'];
handler.tags = ['downloader'];
handler.command = /^(videy|videydl)$/i;
handler.limit = true;

export default handler;