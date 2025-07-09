/* 
- Fitur By Bran E-sport (Bran Pedia)
- Name economy-exchange
- Type Plugins Esm
- https://whatsapp.com/channel/0029VaR0ejN47Xe26WUarL3H

- Jangan Dihapus Bang Wmnya
- Pembuat 6285795600265
*/

let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]
    
    // Inisialisasi nilai default jika belum ada
    user.balance = user.balance || 0
    user.limit = user.limit || 0
    user.exp = user.exp || 0

    // Rate tukar
    const xpperlimit = 1000 // 1000 money = 1 limit
    const xppercoin = 100 // 100 exp = 1 money
    const xplimitToExp = 150 // 1 limit = 150 exp

    switch (command) {
        case 'tukarlimit': {
            if (!args[0]) {
                // Jika tidak ada parameter, minta pengguna memasukkan jumlah
                return conn.reply(m.chat, `Mau tukar berapa limit bang?\nContoh: *100* atau ketik *all* untuk menukar semua.`, m)
            }

            let count = args[0].toLowerCase() === 'all' ? Math.floor(user.balance / xpperlimit) : parseInt(args[0])
            count = Math.max(1, count)

            if (isNaN(count)) {
                return conn.reply(m.chat, `❌ Jumlah yang dimasukkan tidak valid!`, m)
            }

            if (user.balance >= xpperlimit * count) {
                user.balance -= xpperlimit * count
                user.limit += count
                conn.reply(m.chat, `✅ Berhasil menukar *${xpperlimit * count} money* ke *${count} limit*`, m)
            } else {
                conn.reply(m.chat, `❌ Uang kamu tidak cukup!\nDibutuhkan: *${xpperlimit * count} money*\nSaldo kamu: *${user.balance} money*`, m)
            }
            break
        }

        case 'tukarexp': {
            if (!args[0]) {
                // Jika tidak ada parameter, minta pengguna memasukkan jumlah
                return conn.reply(m.chat, `Mau tukar berapa exp bang?\nContoh: *1000* atau ketik *all* untuk menukar semua.`, m)
            }

            let count = args[0].toLowerCase() === 'all' ? Math.floor(user.exp / xppercoin) : parseInt(args[0])
            count = Math.max(1, count)

            if (isNaN(count)) {
                return conn.reply(m.chat, `❌ Jumlah yang dimasukkan tidak valid!`, m)
            }

            if (user.exp >= xppercoin * count) {
                user.exp -= xppercoin * count
                user.balance += count
                conn.reply(m.chat, `✅ Berhasil menukar *${xppercoin * count} exp* ke *${count} money*`, m)
            } else {
                conn.reply(m.chat, `❌ Exp kamu tidak cukup!\nDibutuhkan: *${xppercoin * count} exp*\nSaldo kamu: *${user.exp} exp*`, m)
            }
            break
        }

        case 'tukarlimitkeexp': {
            if (!args[0]) {
                // Jika tidak ada parameter, minta pengguna memasukkan jumlah
                return conn.reply(m.chat, `Mau tukar berapa limit ke exp bang?\nContoh: *10* atau ketik *all* untuk menukar semua.`, m)
            }

            let count = args[0].toLowerCase() === 'all' ? Math.floor(user.limit) : parseInt(args[0])
            count = Math.max(1, count)

            if (isNaN(count)) {
                return conn.reply(m.chat, `❌ Jumlah yang dimasukkan tidak valid!`, m)
            }

            if (user.limit >= count) {
                user.limit -= count
                user.exp += xplimitToExp * count
                conn.reply(m.chat, `✅ Berhasil menukar *${count} limit* ke *${xplimitToExp * count} exp*`, m)
            } else {
                conn.reply(m.chat, `❌ Limit kamu tidak cukup!\nDibutuhkan: *${count} limit*\nSaldo kamu: *${user.limit} limit*`, m)
            }
            break
        }
    }
}

handler.help = [
    'tukarlimit <jumlah>',
    'tukarexp <jumlah>',
    'tukarlimitkeexp <jumlah>'
]

handler.tags = ['main']
handler.command = /^(tukarlimit|tukarexp|tukarlimitkeexp)$/i
// handler.command = /^(tukarlimit|tukarexp|tukarlimitkeexp)([0-9]+)|(tukarlimit|tukarexp|tukarlimitkeexp)|(tukarlimit|tukarexp|tukarlimitkeexp)all$/i

export default handler