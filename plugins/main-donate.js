let handler = async (m) => {
  let gambar = 'https://ar-hosting.pages.dev/1739023984103.jpg'
  //let saweria = global.psaweria
  let qris = 'https://ar-hosting.pages.dev/1739023771562.jpg'
  let numberowner = global.nomorown
  let anu = `Hai 👋
Kalian bisa membeli paket premium melalui:
┌〔 Premium • Emoney 〕
├ QRIS : ${qris}
└────
╭━━━━「 SEWA 」
┊⫹⫺ Hemat: 5k/grup (1 minggu)
┊⫹⫺ Normal: 15k/grup (1 bulan)
┊⫹⫺ Standar: 30k/grup (2 bulan)
┊⫹⫺ Pro: 35k/grup (4 bulan)
┊⫹⫺ Vip: = 65k/grup (12 bulan)
╰═┅═━––––––๑
╭━━━━「 PREMIUM 」
┊⫹⫺ Hemat: 5k (1 minggu)
┊⫹⫺ Normal: 20k (1 bulan)
┊⫹⫺ Pro: 40k (4 bulan)
┊⫹⫺ Vip: 50k (8 bulan)
┊⫹⫺ Permanent: = 70k (Unlimited)
╰═┅═━––––––๑

Terimakasih :D

Contact Owner:
wa.me/${numberowner} (Owner)
`
  let qris_img = await (await fetch(gambar)).buffer()
  await conn.sendFile(m.chat, qris_img, '', anu, m)
}

handler.help = ['premium','sewabot']
handler.tags = ['main']
handler.command = /^(premium|sewabot)$/i

export default handler
