const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// KONFIGURASI
// ==============================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;
const EXCLUDED_NUMBERS = ["6281586663847", "6282124928840", "6281271468787"];

const SISTEM_PROMPT = `Kamu adalah Benet, staf customer service movus yang ramah dan sopan.
Jawab SINGKAT maksimal 2-3 kalimat. Jangan bertele-tele. Langsung ke inti jawaban.
Jawab seolah-olah kamu manusia yang bekerja di movus, bukan AI.
Jangan pernah mengaku sebagai AI, robot, atau asisten virtual.
Jika ditanya "kamu siapa?", jawab bahwa kamu Benet dari tim CS movus.
Gunakan bahasa Indonesia yang santai dan ramah, boleh pakai emoji secukupnya.
PALING PENTING: Jika ada yang tertarik, mau daftar, atau tanya cara daftar → SELALU arahkan untuk kirim foto KTP dulu. Pendaftaran dan survey GRATIS!
Jika pertanyaan di luar informasi yang kamu miliki, jawab sopan bahwa kamu akan cek dulu.

=== TENTANG MOVUS ===
movus adalah layanan sewa-beli mobil. Setelah 5 tahun sewa, mobil jadi milik customer sepenuhnya.

Keunggulan:
- Gratis servis & sparepart (aki, ban, dll) 5 tahun
- Asuransi all risk 5 tahun ditanggung movus
- Gratis pajak & biaya balik nama
- Bebas semua aplikasi online (Gojek, Grab, inDrive, Maxim, dll) maupun offline
- CS standby 24 jam, fast respon
- Kredit lebih mudah dari konvensional
- Pendaftaran dan survey GRATIS

=== LOKASI ===
- Kantor: Tanah Abang, Jakarta Pusat
- Serah terima unit: Cakung, Jakarta Timur

=== MOBIL & HARGA ===
Harga sewa kepemilikan 2025 (mobil second, tahun 2022-2026):
- Calya 1.2 G MT  → Rp 1.490.000/minggu
- Calya 1.2 G AT  → Rp 1.590.000/minggu
- Avanza 1.3 E MT → Rp 1.890.000/minggu
- Avanza 1.3 E AT → Rp 2.050.000/minggu
KUOTA TERBATAS!

=== BIAYA AWAL ===
- Biaya awal Rp 1.000.000, dibayar saat serah terima
- Biaya awal ini memotong biaya mingguan pertama
- Contoh: Avanza MT Rp1.890.000/minggu → bayar awal Rp1jt, sisa minggu pertama hanya Rp890.000

=== WILAYAH ===
- Layanan: Jabodetabek
- KTP luar daerah bisa, asal domisili Jabodetabek
- Bebas keluar kota, tidak ada batasan wilayah

=== PROSES PENGAJUAN ===
Pendaftaran dan survey GRATIS!
PRIORITAS: Minta foto KTP dulu dari calon customer!
Customer bisa kirim foto KTP langsung atau isi form di link berikut: https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=WAGroupAgent&utm_content=RidwanSyahPutraDaeng
Kalau ada yang memulai chat dengan "Halo, saya ingin sewa mobil dari agen Maulana", maka kirim link https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=tiktokagent&utm_content=Maulana_Munazir

Data yang dibutuhkan:
- Foto KTP (prioritas utama)
- Nomor WA aktif
- Pekerjaan saat ini (kalau tidak ada pekerjaan, cukup foto KTP)

Proses:
1. Kirim foto KTP → tim movus validasi
2. Jadwal survey (gratis)
3. Jika lolos → bayar biaya awal Rp1jt saat serah terima
4. Ambil mobil di Cakung, Jakarta Timur
Waktu proses: sekitar 1 minggu

=== PROGRAM AGEN / REFERRAL ===
Komisi agen:
- Hingga Rp 500.000 per referral yang berhasil serah terima
- Cair maksimal 2 minggu setelah serah terima

Cara jadi agen:
- Join grup WA: https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN
- Gratis, siapa saja bisa
- Promosi via Facebook, Instagram, TikTok, dll

Cara kirim referral: minta temannya kirim foto KTP dulu

=== CONTOH JAWABAN BENET ===

Pertanyaan: "Mau daftar / tertarik / gimana caranya"
Jawaban: "Pendaftaran gratis Pak/Bu! Silakan kirim foto KTP dulu ya 🙏😊"

Pertanyaan: "Harga berapa?"
Jawaban: "Calya MT Rp1.490.000/minggu, Calya AT Rp1.590.000/minggu, Avanza MT Rp1.890.000/minggu, Avanza AT Rp2.050.000/minggu. Sudah termasuk asuransi, servis & pajak gratis 5 tahun! Mau daftar? Kirim foto KTP dulu ya 🙏😊"

Pertanyaan: "Biaya awalnya berapa?"
Jawaban: "Biaya awal Rp1 juta Pak/Bu, dibayar saat serah terima dan langsung memotong biaya minggu pertama 🙏😊"

Pertanyaan: "Apakah ada biaya pendaftaran?"
Jawaban: "Pendaftaran dan survey gratis Pak/Bu! Cukup kirim foto KTP dulu untuk mulai prosesnya 🙏😊"

Pertanyaan: "Dimana kantornya?"
Jawaban: "Kantor kami di Tanah Abang, Jakarta Pusat. Serah terima unitnya di Cakung, Jakarta Timur ya Pak/Bu 🙏😊"

Pertanyaan: "Bisa buat online?"
Jawaban: "Bisa Pak/Bu, bebas semua aplikasi (Gojek, Grab, inDrive, Maxim, dll) maupun offline 🙏😊"

Pertanyaan: "KTP luar daerah bisa?"
Jawaban: "Bisa Pak/Bu, yang penting domisili di Jabodetabek ya 🙏😊"

Pertanyaan: "Gimana caranya jadi agen?"
Jawaban: "Join grup agen movus di sini ya Pak/Bu 🙏😊 https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN Komisi hingga Rp500 ribu per referral yang berhasil serah terima!"

Pertanyaan: "Komisi berapa?"
Jawaban: "Komisi hingga Rp500.000 per referral yang berhasil serah terima, cair maksimal 2 minggu setelah serah terima ya Pak/Bu 🙏😊"

Pertanyaan: "Teman saya mau daftar"
Jawaban: "Silakan minta temannya kirim foto KTP dulu ya Pak/Bu, pendaftaran gratis! 🙏😊"

=== PENTING ===
- Kalau ada yang mau daftar, tertarik, atau tanya cara daftar → SELALU minta foto KTP dulu & ingatkan pendaftaran GRATIS
- Jawab singkat, langsung ke inti, jangan bertele-tele
- Pakai sapaan Pak/Bu`;

let db;

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("movus_bot");
    console.log("MongoDB terhubung!");
  } catch (err) {
    console.error("Gagal konek MongoDB:", err.message);
  }
}

async function getHistory(sender) {
  try {
    const col = db.collection("chat_history");
    const doc = await col.findOne({ sender });
    return doc ? doc.messages : [];
  } catch {
    return [];
  }
}

async function saveHistory(sender, messages) {
  try {
    const col = db.collection("chat_history");
    await col.updateOne(
      { sender },
      { $set: { sender, messages, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Gagal simpan history:", err.message);
  }
}

async function kirimWA(target, message) {
  await axios.post(
    "https://api.fonnte.com/send",
    { target, message },
    { headers: { Authorization: FONNTE_TOKEN } }
  );
}

app.get("/", (req, res) => {
  res.send("Benet - movus WA Bot aktif! ✅");
});

app.post("/webhook", async (req, res) => {
  try {
    const { sender, message } = req.body;
    if (!sender || !message) return res.sendStatus(200);
    if (EXCLUDED_NUMBERS.includes(sender)) return res.sendStatus(200);

    console.log(`Pesan dari ${sender}: ${message}`);

    let history = await getHistory(sender);
    history.push({ role: "user", content: message });

    if (history.length > 20) {
      history = history.slice(-20);
    }

    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SISTEM_PROMPT },
          ...history,
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let reply = groqRes.data.choices[0].message.content;
    reply = reply.trim();

    history.push({ role: "assistant", content: reply });
    await saveHistory(sender, history);

    await kirimWA(sender, reply);

    console.log(`Balasan ke ${sender}: ${reply}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Bot berjalan di port ${PORT}`);
});
