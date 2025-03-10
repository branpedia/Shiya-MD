import Canvas from 'canvas'

export async function levelup(teks, level) { // Named export
  const canvas = Canvas.createCanvas(600, 200)
  const ctx = canvas.getContext('2d')

  // Background
  let bg = await Canvas.loadImage('https://i.ibb.co/4JcZQ6F/20210807-112304.jpg')
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

  // Rotasi + gambar avatar
  ctx.save()
  ctx.beginPath()
  ctx.rotate(-25 * Math.PI / 180)
  let avatar = await Canvas.loadImage('https://i.ibb.co/G5mJZxs/rin.jpg')
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.drawImage(avatar, 25, 100, 113, 113)
  ctx.strokeRect(25, 100, 113, 113)
  ctx.restore()

  // Tulis teks
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(teks, 200, 80)
  ctx.fillText(`Level: ${level}`, 200, 110)

  // Hasil akhir -> buffer
  return canvas.toBuffer()
}
