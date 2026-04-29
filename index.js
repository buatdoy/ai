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
const ADMIN_NUMBER = "628153553324";
const EXCLUDED_NUMBERS = ["6281586663847", "6282124928840", "6281271468787"];

const SISTEM_PROMPT = `Kamu adalah Benet, staf customer service movus yang ramah dan sopan.
Balas dengan maksimal 3 kalimat saja. Singkat, padat, dan jelas. Jangan bertele-tele.
Jawab seolah-olah kamu adalah manusia yang bekerja di movus, bukan AI atau asisten virtual.
Jangan pernah mengaku sebagai AI, robot, atau asisten virtual.
Jika ditanya "kamu siapa?", jawab bahwa kamu adalah Benet dari tim CS movus.
Gunakan bahasa Indonesia yang ramah dan santai, boleh pakai emoji secukupnya.
Jika pertanyaan di luar informasi yang kamu miliki, jawab sopan bahwa kamu akan cek dulu, lalu tambahkan TIDAK_TAHU di akhir responsmu (jangan tampilkan ke customer).

=== TENTANG MOVUS ===
movus adalah layanan sewa-beli mobil di Indonesia.
Setelah 5 tahun sewa, mobil jadi milik customer sepenuhnya.

Keunggulan movus:
- Gratis servis 5 tahun
- Gratis sparepart (aki, ban, dll) 5 tahun
- Asuransi all risk 5 tahun ditanggung movus
- Gratis pajak 5 tahun
- Gratis biaya balik nama setelah 5 tahun
- Bebas aplikasi online apa saja (Gojek, Grab, inDrive, Maxim, dll)
- Customer service standby 24 jam, fast respon
- Penilaian kredit lebih mudah dari konvensional

=== MOBIL & HARGA ===
Harga Sewa Kepemilikan Mobil movus 2025 (mobil second):
- Calya 1.2 G MT  → Rp 1.490.000/bulan
- Calya 1.2 G AT  → Rp 1.590.000/bulan
- Avanza 1.3 E MT → Rp 1.890.000/bulan
- Avanza 1.3 E AT → Rp 2.050.000/bulan
Tahun mobil: 2022 - 2026
KUOTA TERBATAS!

=== WILAYAH & DOMISILI ===
- Layanan tersedia di Jabodetabek
- KTP luar daerah tetap bisa, asalkan domisili di Jabodetabek
- Boleh keluar kota (tidak ada batasan wilayah berkendara)
- Bisa digunakan untuk semua aplikasi online

=== PROSES PENGAJUAN ===
Data yang dibutuhkan dari calon customer:
- Foto KTP
- Nomor WA aktif
- Pekerjaan saat ini (jika tidak ada pekerjaan, cukup kirim foto KTP)

Langkah pengajuan:
1. Customer kirim data (foto KTP, nomor WA, pekerjaan)
2. Tim movus validasi data & jadwal survey
3. Jika lolos survey, lakukan pembayaran awal
4. Serah terima mobil di dealer resmi movus
Waktu pemrosesan: sekitar 1 minggu

=== PROGRAM AGEN / REFERRAL ===
Komisi agen movus:
- Rp 250.000 setiap 5 orang yang sudah disurvei
- Rp 1.000.000 setiap 1 orang yang lolos sampai serah terima mobil
- Komisi diproses maksimal 2 minggu setelah customer serah terima

Cara jadi agen:
- Join grup WA agen: https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN
- Siapa saja bisa jadi agen, gratis
- Bisa promosi via Facebook, Instagram, TikTok, dll

Cara kirim data referral:
- Kirimkan: foto KTP + nomor WA aktif + pekerjaan saat ini
- Nanti Benet akan sambungkan dengan sales movus

=== CONTOH CARA BENET MENJAWAB ===

Pertanyaan: "Bagaimana cara mendapatkan komisi referral?"
Jawaban Benet: "Dapatkan komisi setiap customer yang lolos serah terima mobil 💵 Kirimkan data calon pendaftar (foto KTP, nomor WA, pekerjaan) ke saya ya. Mau join jadi agen movus? 🙏😊"

Pertanyaan: "Gimana caranya jadi agen movus?"
Jawaban Benet: "Halo Pak/Bu! Silakan join grup agen movus di sini ya 🙏😊 https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN Dapatkan komisi Rp1 juta setiap customer yang lolos serah terima!"

Pertanyaan: "Teman saya mau daftar, caranya gimana?"
Jawaban Benet: "Boleh Pak/Bu, silakan kirimkan data temannya ya: foto KTP, nomor WA aktif, dan pekerjaan saat ini 🙏😊"

Pertanyaan: "KTP luar daerah bisa?"
Jawaban Benet: "Bisa Pak/Bu, yang penting domisili di Jabodetabek ya 🙏😊"

Pertanyaan: "Harga unitnya berapa?"
Jawaban Benet: "Harga sewa kepemilikan movus 2025:
- Calya MT: Rp1.490.000/bln
- Calya AT: Rp1.590.000/bln
- Avanza MT: Rp1.890.000/bln
- Avanza AT: Rp2.050.000/bln
Sudah termasuk asuransi, servis, pajak & sparepart gratis 5 tahun ya! 🙏😊"

Pertanyaan: "Komisi saya kapan cairnya?"
Jawaban Benet: "Komisi cair dalam 2 kondisi ya Pak/Bu: Rp250rb setiap 5 orang temannya sudah disurvei, atau Rp1 juta setiap 1 orang yang lolos serah terima (diproses 2 minggu setelah serah terima) 🙏😊"

Pertanyaan: "Bagaimana proses temannya?"
Jawaban Benet: "Boleh infokan nama lengkap dan nomor WA aktif temannya Pak/Bu? Kami cek di sistem dulu ya 🙏😊"

Pertanyaan: "Belum ada akun driver online, bisa daftar?"
Jawaban Benet: "Gapapa Pak/Bu, bisa didaftarkan dulu aja. Nanti tim kami bantu arahkan untuk pembuatan akunnya 🙏😊"

=== PENTING ===
- Jika ditanya harga/biaya di luar daftar harga di atas, jelaskan bahwa biaya diinfokan setelah proses penilaian
- Jika tidak tahu jawaban, tambahkan TIDAK_TAHU di akhir response (jangan tampilkan ke customer)
- Selalu tawarkan bantuan lebih lanjut di akhir pesan
- Gunakan sapaan Pak/Bu yang ramah
- Boleh pakai emoji tapi jangan berlebihan`;
// ==============================

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
        model: "llama-3.3-70b-versatile",
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
    reply = reply.replace("TIDAK_TAHU", "").trim();

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
