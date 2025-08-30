import fs from "fs"
import path from "path"
import url from "url"
import { pathToFileURL } from "url"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, "../") // folder utama project

async function checkFile(filePath) {
  try {
    await import(pathToFileURL(filePath).href)
    return `✅ OK: ${path.relative(ROOT_DIR, filePath)}`
  } catch (err) {
    return `❌ ERROR: ${path.relative(ROOT_DIR, filePath)}\n   ↳ ${err.message}`
  }
}

async function scanDir(dir) {
  let results = []
  const files = fs.readdirSync(dir)

  for (let file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      if (file === "node_modules" || file.startsWith(".")) continue
      results.push(...(await scanDir(fullPath)))
    } else if (file.endsWith(".js") || file.endsWith(".mjs")) {
      results.push(await checkFile(fullPath))
    }
  }
  return results
}

let handler = async (m, { conn, args }) => {
  m.reply("🔍 Sedang scan file project... tunggu bentar ya.")

  let targetDir = ROOT_DIR
  if (args[0]) targetDir = path.join(ROOT_DIR, args[0]) // bisa scan folder spesifik, ex: .cekerror plugins

  let report = await scanDir(targetDir)
  let errors = report.filter(r => r.startsWith("❌")).join("\n\n")
  let oks = report.filter(r => r.startsWith("✅")).length

  let text = `📂 *Hasil Cek Error*\n\n`
  text += errors ? errors : "✅ Tidak ada error ditemukan!"
  text += `\n\n📊 Total file dicek: ${report.length}\n✅ OK: ${oks}\n❌ Error: ${report.length - oks}`

  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

handler.help = ['cekerror [folder]']
handler.tags = ['debug']
handler.command = ['cekerror', 'scanerror', 'errorcheck']

export default handler
