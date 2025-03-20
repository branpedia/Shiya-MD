import fs from "fs";

async function logoutBot(conn) {
    try {
        console.log("🔴 Logging out and removing session...");

        // Logout dari WhatsApp
        await conn.logout();

        // Hapus sesi (folder session)
        const sessionPath = "./sessions"; // Sesuaikan dengan path session bot
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log("✅ Session folder deleted successfully.");
        }

        console.log("✅ Bot successfully logged out and session removed.");
    } catch (error) {
        console.error("❌ Error while logging out:", error);
    }
}

// Handler perintah untuk logout
async function handler(m, { conn, isOwner }) {
    if (!isOwner) return m.reply("❌ Kamu tidak memiliki izin untuk logout bot!");

    await logoutBot(conn);
    m.reply("✅ Bot berhasil logout dan sesi telah dihapus!");
}

handler.command = ["logout"];
handler.tags = ["owner"];
handler.help = ["logout"];
handler.owner = true;

export default handler;
