/* Bran E-sport, V Kalkulator
Saluran Wa : https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
IG: @bran_pedia | YT: Bran Pedia Official  
Pembuat kode: Bran (Jangan dihapus, hargailah!)
*/

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

/* mendukung beberapa operator dan txt contoh

Mendukung Beberapa Operator Silakan Cek Tabel Gambar ini 

https://ar-hosting.pages.dev/1741989157130.jpg

Contoh Penggunaan txt

.calc 5+5
📌 Hasil Perhitungan:
5+5 = 10

.calc 10÷2
📌 Hasil Perhitungan:
10÷2 = 5

.calc 2^3
📌 Hasil Perhitungan:
2^3 = 8

.calc sqrt(16)
📌 Hasil Perhitungan:
sqrt(16) = 4

.calc log10(1000)
📌 Hasil Perhitungan:
log10(1000) = 3

.calc sin(30 deg)
📌 Hasil Perhitungan:
sin(30 deg) = 0.5
*/
