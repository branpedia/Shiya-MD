/* Bran E-sport, V Kalkulator Mlbb Winrate
Saluran Wa : https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H
IG: @bran_pedia | YT: Bran Pedia Official  
Pembuat kode: Bran (Jangan dihapus, hargailah!)
*/

const handler = async (m, { text, command }) => {
  let [match, current, target] = text.split(/[^\d.]+/g).map(Number);

  if (![match, current, target].every(v => !isNaN(v)))
    return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${command} 122 68 75\n> 12 match\n> 68 winrate\n> 75 winrate target`);

  if (target <= current)
    return m.reply(`*Target winrate harus lebih besar dari winrate sekarang!*`);

  const currentWins = (current / 100) * match;
  const targetTotalWins = (target / 100) * match;
  const deltaWins = targetTotalWins - currentWins;
  const requiredMatches = deltaWins / ((100 - target) / 100);

  const result = Math.ceil(requiredMatches);

  m.reply(
    `*Winrate MLBB Calculator*\n\n` +
    `Total match saat ini: *${match}*\n` +
    `Winrate sekarang: *${current}%*\n` +
    `Target winrate: *${target}%*\n\n` +
    `Untuk mencapai winrate ${target}% kamu harus menang *${result}* match berturut-turut tanpa kalah.`
  );
};

handler.help = ['winratemlbb <match> <current%> <target%>'];
handler.tags = ['tools'];
handler.command = /^winratemlbb$/i;

export default handler;