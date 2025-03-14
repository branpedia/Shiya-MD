import { evaluate, format } from 'mathjs';

let handler = async (m, { text }) => {
  if (!text) return m.reply('⚠️ Masukkan soal yang ingin dihitung!\nContoh: `.calc 2+3`, `.calc sqrt(16)`, `.calc log10(1000)`');

  let input = text
    .replace(/×/g, '*')   // Ganti simbol perkalian
    .replace(/÷/g, '/')   // Ganti simbol pembagian
    .replace(/π|pi/gi, 'pi') // Ubah pi menjadi pi (standar mathjs)
    .replace(/e/gi, 'e');  // Ubah e menjadi e (bilangan Euler)

  try {
    let result = evaluate(input); // Hitung ekspresi matematika
    if (isNaN(result)) throw '⚠️ Perhitungan tidak valid.';

    // Format hasil agar lebih rapi
    let output = format(result, { precision: 10 });

    m.reply(`📌 *Hasil Perhitungan:*\n\n${text} = *${output}*`);
  } catch (e) {
    m.reply('⚠️ Format salah! Gunakan angka dan operator matematika yang valid.');
  }
};

handler.help = ['kalkulator <soal>'];
handler.tags = ['tools'];
handler.command = /^(calc(ulate|ulator)?|kalk(ulator)?)$/i;

export default handler;
