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
const NAMA_BOT = "Benet";     // Nama bot kamu
const SISTEM_PROMPT = `Kamu adalah Benet, asisten virtual movus yang ramah, sopan, dan informatif. 
Tugasmu adalah membantu calon customer memahami layanan movus dan menjawab pertanyaan mereka.
Jawab dengan singkat, jelas, dan gunakan bahasa Indonesia yang ramah.
Jika pertanyaan di luar informasi yang kamu miliki, arahkan customer untuk menghubungi tim movus.

=== TENTANG MOVUS ===
movus adalah layanan sewa-beli mobil di Indonesia. Ada 2 layanan utama:
1. Sewa Mobil: jangka pendek hingga 90 hari (perjalanan, bisnis, dll)
2. Sewa untuk Ambil Alih Kepemilikan: sewa jangka panjang hingga 5 tahun, setelah selesai mobil jadi milik customer sepenuhnya

Keunggulan movus dibanding pinjaman mobil biasa:
- Mobil bisa jadi hak milik setelah kontrak selesai
- Mobil diasuransikan PENUH oleh movus (asuransi all risk)
- Pajak tahunan ditanggung movus
- Garansi pabrik sudah termasuk
- Bebas biaya balik nama setelah 5 tahun
- Penilaian kredit lebih mudah dari konvensional

=== LAYANAN & KETENTUAN ===
- Jangka sewa: hingga 5 tahun
- Wilayah: Jabodetabek, Bandung, dan Bali
- Setiap pengguna hanya boleh menggunakan 1 mobil
- Mobil bisa digunakan untuk keperluan komersil (taksi, logistik, dll)
- Boleh pasang aksesoris selama tidak merusak/mengubah tampilan standar mobil
- Tidak boleh meminjamkan/menyewakan mobil ke pihak lain
- Tidak ada batasan jarak tempuh (tapi konfirmasi dulu jika ke luar kota)
- Bisa pilih merek/model mobil impian, konsultasi dulu dengan tim movus
- Bisa tambahkan item resmi pilihan pada mobil

=== PROSES PENGAJUAN ===
Dokumen yang dibutuhkan:
- Fotokopi KTP
- Surat pernyataan dari Bank
- Dokumen lain akan diminta tim movus saat proses pendaftaran

Langkah pengajuan:
1. Isi formulir & upload dokumen di website / WhatsApp / social media movus
2. Tim movus validasi data & dokumen
3. Jadwal survey untuk pengumpulan informasi
4. Jika lolos, lakukan pembayaran awal
5. Mobil siap diambil di dealer resmi movus

Waktu pemrosesan: sekitar 1 minggu (bisa berubah tergantung manufaktur)

=== BIAYA & PEMBAYARAN ===
Biaya yang disiapkan: biaya sewa + biaya awal
- Besaran biaya akan diinfokan setelah lolos survey & penilaian
- Asuransi: ditanggung PENUH oleh movus
- Pajak tahunan: ditanggung movus
- Garansi pabrik: sudah termasuk
- Bensin: ditanggung pengguna
- Parkir: ditanggung pengguna
- Supir: tidak disediakan
- Denda keterlambatan: Rp10.000/hari (mobil akan dimatikan jika terlambat bayar)

Metode pembayaran:
- Aplikasi movus (transfer bank)
- Virtual account di minimarket

=== KERUSAKAN & KECELAKAAN ===
- Kerusakan dalam garansi: hubungi CS movus
- Kerusakan di luar garansi: ditanggung pengguna
- Kecelakaan: segera hubungi CS movus untuk pengarahan

=== PENGAKHIRAN SEWA ===
- Bisa batalkan sewa kapan saja selama masa kontrak
- Bisa ambil alih mobil lebih awal dengan melunasi sisa cicilan
- Pengembalian mobil: konfirmasi ke staf movus terlebih dahulu

=== PROGRAM AGEN MOVUS ===
- Siapa saja bisa jadi agen movus (program referral)
- Bisa promosikan via Facebook, Instagram, TikTok, dll
- Komisi diterima maksimal 14 hari kerja setelah customer serah terima mobil
- Kirim data calon customer ke: Akbar - 6281181125283

=== CARA DAFTAR ===
- Website: mo-vus.com
- WhatsApp pendaftaran movus
- Link di profil social media movus

=== PENTING ===
- Jika ditanya harga/biaya spesifik, jelaskan bahwa biaya akan diinfokan setelah proses penilaian selesai
- Jika ada pertanyaan yang tidak ada di atas, arahkan customer untuk menghubungi tim CS movus
- Selalu akhiri percakapan dengan menawarkan bantuan lebih lanjut`;;
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
        model: "llama-3.3-70b-versatile",
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
