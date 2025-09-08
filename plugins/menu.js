import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
import fetch from 'node-fetch'
const { generateWAMessageFromContent, proto, getDevice } = (await import('@adiwajshing/baileys')).default

const defaultMenu = {
  before: `
● *Nama:*  %name 
● *Nomor:* %tag
● *Premium:* %prems
● *Limit:* %limit
● *Role:* %role

*${ucapan()} %name!*
● *Tanggal:* %week %weton
● *Date:* %date
● *Tanggal Islam:* %dateIslamic
● *Waktu:* %time

● *Nama Bot:* %me
● *Mode:* %mode
● *Prefix:* [ *%_p* ]
● *Platform:* %platform
● *Type:* Node.JS
● *Uptime:* %muptime
● *Database:* %rtotalreg dari %totalreg

⬣───「 *INFO CMD* 」───⬣
│ *Ⓟ* = Premium
│ *Ⓛ* = Limit
▣────────────⬣
  %readmore
  `.trimStart(),
    header: '╭─────『 %category 』',
    body: '  ⫸ %cmd %isPremium %islimit',
    footer: '╰–––––––––––––––༓',
    after: ``,
  }
  
const thumbnailUrl = 'https://files.catbox.moe/7crfs8.jpg'
const videoUrl = 'https://files.catbox.moe/9nnmus.mp4'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {
  if (m.isGroup && !global.db.data.chats[m.chat].menu) {
    throw `Admin telah mematikan menu`
  }

  // REPLY "sedang diproses" dan kirim reaksi awal
  let processingMsg = await conn.reply(m.chat, '⏳ *Mohon tunggu, menu sedang diproses...*', m)
  await conn.sendMessage(m.chat, { react: { text: '🔴', key: m.key } })
  
  let tags = {
    'main': 'Main',
    'ai': 'Ai feature',
    'memfess': 'Memfess',
    'search' : 'Searching',
    'rpg' : 'Rpg',
    'downloader': 'Downloader',
    'internet': 'Internet',
    'anime': 'Anime',
    'sticker': 'Sticker',
    'stalk': 'Stalking',
    'store': 'Store',
    'tools': 'Tools',
    'group': 'Group',
    'quotes': 'Quotes',
    'fun': 'Fun',
    'maker': 'Maker Text Logo',
    'nulis': 'Nulis',
    'info': 'Info',
    'owner': 'Owner',
    'game' : 'Game',
  }

  try {
    let dash = global.dashmenu
    let m1 = global.dmenut
    let m2 = global.dmenub
    let m3 = global.dmenuf
    let m4 = global.dmenub2

    let cc = global.cmenut
    let c1 = global.cmenuh
    let c2 = global.cmenub
    let c3 = global.cmenuf
    let c4 = global.cmenua

    let lprem = global.lopr
    let llim = global.lolm
    let tag = `@${m.sender.split('@')[0]}`
    let device = await getDevice(m.id)

    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let usrs = db.data.users[m.sender]

    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let mode = global.opts['self'] || global.opts['owneronly'] ? 'Private' : 'Publik'
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { age, exp, limit, level, role, registered, money } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium' : 'Free'}`
    let platform = os.platform()

    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    
    // PERBAIKAN: Filter berdasarkan argumen yang diberikan
    let filteredTags = {}
    if (args[0] && tags[args[0].toLowerCase()]) {
      // Jika ada argumen dan sesuai dengan tags yang ada
      const requestedTag = args[0].toLowerCase()
      filteredTags[requestedTag] = tags[requestedTag]
    } else if (args[0] && !tags[args[0].toLowerCase()]) {
      // Jika ada argumen tapi tidak sesuai dengan tags yang ada, tampilkan semua
      filteredTags = tags
    } else {
      // Jika tidak ada argumen, tampilkan semua
      filteredTags = tags
    }
    
    let _text = [
      before,
      ...Object.keys(filteredTags).map(tag => {
        return header.replace(/%category/g, filteredTags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      tag, dash, m1, m2, m3, m4, cc, c1, c2, c3, c4, lprem, llim,
      ucpn, platform, wib, mode, _p, money, age, tag, name, prems, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let fkon = {
      key: {
        fromMe: false,
        participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: '16500000000@s.whatsapp.net' } : {})
      },
      message: {
        contactMessage: {
          displayName: `${name}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          verified: true
        }
      }
    }

    await conn.sendMessage(m.chat, {
      video: { url: "https://raw.githubusercontent.com/kepocodeid/testeraja/main/143.198/inivid.mp4"},
      gifPlayback: true,
      caption: text,
      mentions: [m.sender],
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: wm,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://files.catbox.moe/7crfs8.jpg',
          sourceUrl: `https://chat.whatsapp.com/E75NYG8eKvyEXk6QtFtj92`,
        }
      }
    }, { quoted: fkon })
    
    await conn.sendMessage(m.chat, {
      audio: { url: "https://raw.githubusercontent.com/kepocodeid/testeraja/main/143.198/inisound.mp3" },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: fkon })

    await conn.sendMessage(m.chat, { react: { text: '🟢', key: m.key } })
    
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'menu [category]']
handler.tags = ['main']
handler.command = /^(allmenu|menu|help|\?)$/i

handler.register = true
handler.exp = 3

export default handler

//----------- FUNCTION -------

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}
function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [ye, ' *Years 🗓️*\n', mo, ' *Month 🌙*\n', d, ' *Days ☀️*\n', h, ' *Hours 🕐*\n', m, ' *Minute ⏰*\n', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  let res = "Kok Belum Tidur Kak? 🥱"
  if (time >= 4) {
    res = "Pagi Kak 🌄"
  }
  if (time >= 10) {
    res = "Siang Kak ☀️"
  }
  if (time >= 15) {
    res = "Sore Kak 🌇"
  }
  if (time >= 18) {
    res = "Malam Kak 🌙"
  }
  return res
}
