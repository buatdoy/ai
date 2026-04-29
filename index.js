const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// KONFIGURASI — ISI DI SINI
// ==============================
const GROQ_API_KEY = "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"; // Ganti dengan Groq API Key kamu
const FONNTE_TOKEN = "PkkMyoxoHAKhKpeZcHE1";     // Ganti dengan Token Fonnte kamu
const NAMA_BOT = "Asisten AI";     // Nama bot kamu
const SISTEM_PROMPT = `Kamu adalah ${NAMA_BOT}, asisten WhatsApp yang ramah dan membantu. 
Jawab pertanyaan customer dengan sopan, singkat, dan jelas dalam bahasa Indonesia.
Jika ada pertanyaan yang tidak kamu tahu jawabannya, minta customer untuk menghubungi admin.`;
// ==============================

// Simpan riwayat percakapan per nomor
const chatHistory = {};

app.get("/", (req, res) => {
  res.send("WhatsApp AI Bot aktif! ✅");
});

app.post("/webhook", async (req, res) => {
  try {
    const { sender, message } = req.body;

    // Abaikan jika bukan pesan teks
    if (!sender || !message) return res.sendStatus(200);

    console.log(`Pesan dari ${sender}: ${message}`);

    // Inisialisasi riwayat jika belum ada
    if (!chatHistory[sender]) {
      chatHistory[sender] = [];
    }

    // Tambahkan pesan user ke riwayat
    chatHistory[sender].push({ role: "user", content: message });

    // Batasi riwayat 20 pesan terakhir agar tidak terlalu panjang
    if (chatHistory[sender].length > 20) {
      chatHistory[sender] = chatHistory[sender].slice(-20);
    }

    // Kirim ke Groq
    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SISTEM_PROMPT },
          ...chatHistory[sender],
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = groqRes.data.choices[0].message.content;

    // Simpan balasan ke riwayat
    chatHistory[sender].push({ role: "assistant", content: reply });

    // Kirim balasan via Fonnte
    await axios.post(
      "https://api.fonnte.com/send",
      {
        target: sender,
        message: reply,
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
      }
    );

    console.log(`Balasan ke ${sender}: ${reply}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot berjalan di port ${PORT}`);
});
