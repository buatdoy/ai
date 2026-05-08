<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Movus Bot - System Prompt Editor</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #22263a;
    --border: #2d3148;
    --accent: #4f8cff;
    --accent2: #00d4aa;
    --danger: #ff5c5c;
    --warn: #ffb74d;
    --text: #e8eaf0;
    --text2: #8b90a8;
    --text3: #555b7a;
    --green: #4caf8a;
    --radius: 10px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Sora', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.3px;
  }
  .logo-dot {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
  }
  .badge {
    font-size: 11px;
    padding: 3px 9px;
    border-radius: 20px;
    background: rgba(79,140,255,0.15);
    color: var(--accent);
    font-weight: 500;
    border: 1px solid rgba(79,140,255,0.25);
  }
  .badge.ok { background: rgba(76,175,138,0.15); color: var(--green); border-color: rgba(76,175,138,0.25); }
  .header-actions { display: flex; gap: 10px; align-items: center; }
  .btn {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn:hover { background: #2d3148; border-color: #3d4268; }
  .btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .btn.primary:hover { background: #3a7aee; }
  .btn.success {
    background: var(--green);
    border-color: var(--green);
    color: #fff;
  }
  main {
    display: grid;
    grid-template-columns: 340px 1fr;
    flex: 1;
    min-height: 0;
  }
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    height: calc(100vh - 57px);
    position: sticky;
    top: 57px;
  }
  .sidebar-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text3);
    padding: 10px 0 6px;
  }
  .section-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--radius);
    border: none;
    background: transparent;
    color: var(--text2);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: all 0.12s;
  }
  .section-btn:hover { background: var(--surface2); color: var(--text); }
  .section-btn.active { background: rgba(79,140,255,0.12); color: var(--accent); }
  .section-btn .icon {
    font-size: 15px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }
  .editor-area {
    display: flex;
    flex-direction: column;
    padding: 28px 32px;
    overflow-y: auto;
    gap: 24px;
  }
  .section-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .section-card.highlight {
    border-color: rgba(255,92,92,0.4);
    box-shadow: 0 0 0 1px rgba(255,92,92,0.1);
  }
  .section-header {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .section-title {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-body { padding: 18px; }
  .alert {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .alert.danger { background: rgba(255,92,92,0.08); border: 1px solid rgba(255,92,92,0.2); color: #ff9a9a; }
  .alert.warn { background: rgba(255,183,77,0.08); border: 1px solid rgba(255,183,77,0.2); color: #ffd082; }
  .alert.info { background: rgba(79,140,255,0.08); border: 1px solid rgba(79,140,255,0.2); color: #8bb8ff; }
  .alert .aicon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  textarea {
    width: 100%;
    background: #13151f;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    line-height: 1.7;
    padding: 14px 16px;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
  }
  textarea:focus { border-color: var(--accent); }
  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text2);
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .field-wrap { margin-bottom: 16px; }
  .field-wrap:last-child { margin-bottom: 0; }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }
  .tag {
    font-size: 11.5px;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text2);
    cursor: pointer;
    transition: all 0.12s;
    font-family: 'JetBrains Mono', monospace;
  }
  .tag:hover { border-color: var(--danger); color: var(--danger); }
  .tag.add { border-style: dashed; color: var(--accent); border-color: rgba(79,140,255,0.4); }
  .tag.add:hover { background: rgba(79,140,255,0.08); }
  input[type="text"] {
    background: #13151f;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    padding: 8px 12px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }
  input[type="text"]:focus { border-color: var(--accent); }
  .link-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
  }
  .link-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent2);
    padding: 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .output-box {
    background: #0a0c14;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    max-height: 400px;
    overflow-y: auto;
    position: relative;
  }
  .output-box .kw { color: #ff7edb; }
  .output-box .str { color: #a8ff78; }
  .output-box .cmt { color: var(--text3); }
  .output-box .key { color: var(--accent); }
  .copy-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text2);
    cursor: pointer;
    font-family: 'Sora', sans-serif;
  }
  .copy-btn:hover { color: var(--text); border-color: #3d4268; }
  .divider {
    height: 1px;
    background: var(--border);
    margin: 16px 0;
  }
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 18px;
  }
  .stat {
    background: var(--surface2);
    border-radius: 8px;
    padding: 12px 14px;
    text-align: center;
  }
  .stat-val {
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
    display: block;
  }
  .stat-label {
    font-size: 11px;
    color: var(--text3);
    margin-top: 2px;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .toggle-row:last-child { border-bottom: none; }
  .toggle-row span { color: var(--text2); }
  .toggle {
    width: 36px; height: 20px;
    border-radius: 10px;
    background: var(--border);
    position: relative;
    cursor: pointer;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .toggle.on { background: var(--green); }
  .toggle::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s;
  }
  .toggle.on::after { transform: translateX(16px); }
  #toastContainer {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 999;
  }
  .toast {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13px;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.2s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .toast.ok { border-color: rgba(76,175,138,0.3); }
  @keyframes slideIn {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .mono { font-family: 'JetBrains Mono', monospace; }
  select {
    background: #13151f;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    padding: 8px 12px;
    outline: none;
    width: 100%;
    cursor: pointer;
  }
  select:focus { border-color: var(--accent); }
</style>
</head>
<body>

<header>
  <div class="logo">
    <div class="logo-dot">🤖</div>
    Movus Bot Config
    <span class="badge">v2.0</span>
  </div>
  <div class="header-actions">
    <span class="badge ok" id="statusBadge">● Ready</span>
    <button class="btn" onclick="previewPrompt()">👁 Preview</button>
    <button class="btn primary" onclick="copyFullCode()">⬇ Export JS</button>
  </div>
</header>

<main>
  <aside class="sidebar">
    <div class="sidebar-label">Sections</div>
    <button class="section-btn active" onclick="scrollTo('sec-critical')">
      <span class="icon">🚨</span> Larangan Link (Fix Utama)
    </button>
    <button class="section-btn" onclick="scrollTo('sec-identity')">
      <span class="icon">🎭</span> Identitas Bot
    </button>
    <button class="section-btn" onclick="scrollTo('sec-excluded')">
      <span class="icon">🚫</span> Nomor Excluded
    </button>
    <button class="section-btn" onclick="scrollTo('sec-links')">
      <span class="icon">🔗</span> Whitelist Link
    </button>
    <button class="section-btn" onclick="scrollTo('sec-company')">
      <span class="icon">🏢</span> Info Perusahaan
    </button>
    <button class="section-btn" onclick="scrollTo('sec-model')">
      <span class="icon">⚙️</span> Model & Parameter
    </button>
    <button class="section-btn" onclick="scrollTo('sec-toggles')">
      <span class="icon">🎛</span> Opsi Lanjutan
    </button>
    <button class="section-btn" onclick="scrollTo('sec-output')">
      <span class="icon">📄</span> Output / Export
    </button>

    <div class="sidebar-label" style="margin-top:12px">Statistik Prompt</div>
    <div class="stat-row" style="grid-template-columns: 1fr 1fr; gap:8px; margin:0">
      <div class="stat"><span class="stat-val" id="charCount">-</span><div class="stat-label">Karakter</div></div>
      <div class="stat"><span class="stat-val" id="tokenCount">-</span><div class="stat-label">~Token</div></div>
    </div>
  </aside>

  <div class="editor-area">

    <!-- CRITICAL FIX -->
    <div class="section-card highlight" id="sec-critical">
      <div class="section-header">
        <div class="section-title">🚨 Larangan Link (Fix Anti-Halusinasi)</div>
        <span class="badge" style="background:rgba(255,92,92,0.15);color:#ff8a8a;border-color:rgba(255,92,92,0.3)">PRIORITAS</span>
      </div>
      <div class="section-body">
        <div class="alert danger">
          <span class="aicon">⚠️</span>
          <div>Ini penyebab bot membuat link typo. Instruksi ini <strong>harus di baris pertama</strong> sistem prompt agar paling diperhatikan model.</div>
        </div>
        <div class="field-wrap">
          <div class="field-label">Instruksi Larangan Link</div>
          <textarea id="linkBan" rows="6">LARANGAN KERAS — LINK:
Kamu DILARANG KERAS membuat, mengarang, mengubah, atau memodifikasi URL/link apapun.
Hanya boleh gunakan link berikut persis kata per kata, tanpa perubahan apapun:
- Form daftar: https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=WAGroupAgent&utm_content=RidwanSyahPutraDaeng
- Grup agen: https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN
- Agen Maulana: https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=tiktokagent&utm_content=Maulana_Munazir
Jika tidak ada link yang sesuai konteks, JANGAN kirim link apapun.</textarea>
        </div>
        <div class="alert info">
          <span class="aicon">💡</span>
          <div>Menaruh instruksi ini di awal + akhir prompt meningkatkan kepatuhan model secara signifikan. Generator di bawah akan otomatis melakukan ini.</div>
        </div>
      </div>
    </div>

    <!-- IDENTITAS -->
    <div class="section-card" id="sec-identity">
      <div class="section-header">
        <div class="section-title">🎭 Identitas Bot</div>
      </div>
      <div class="section-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field-wrap">
            <div class="field-label">Nama Bot</div>
            <input type="text" id="botName" value="Putra" placeholder="Contoh: Putra">
          </div>
          <div class="field-wrap">
            <div class="field-label">Peran</div>
            <input type="text" id="botRole" value="staf customer service" placeholder="Contoh: customer service">
          </div>
        </div>
        <div class="field-wrap">
          <div class="field-label">Instruksi Karakter</div>
          <textarea id="characterInstructions" rows="5">Jawab SINGKAT maksimal 2-3 kalimat. Jangan bertele-tele. Langsung ke inti jawaban.
Jawab seolah-olah kamu manusia, bukan AI.
Jangan pernah mengaku sebagai AI, robot, atau asisten virtual.
Jika ditanya "kamu siapa?", jawab bahwa kamu {NAMA_BOT}.
Gunakan bahasa Indonesia yang santai dan ramah, boleh pakai emoji secukupnya.
Kalau ada yang memulai chat dengan "Halo, saya ingin sewa mobil dari agen Maulana", kirim link Maulana langsung, jangan berikan opsi kirim KTP.</textarea>
        </div>
        <div class="field-wrap">
          <div class="field-label">Instruksi Utama (CTA)</div>
          <textarea id="ctaInstruction" rows="3">PALING PENTING: Jika ada yang tertarik, mau daftar, atau tanya cara daftar → SELALU arahkan untuk kirim foto KTP dulu. Pendaftaran dan survey GRATIS!
Jika pertanyaan di luar informasi yang kamu miliki, jawab sopan bahwa kamu akan cek dulu.</textarea>
        </div>
      </div>
    </div>

    <!-- EXCLUDED NUMBERS -->
    <div class="section-card" id="sec-excluded">
      <div class="section-header">
        <div class="section-title">🚫 Nomor Excluded</div>
      </div>
      <div class="section-body">
        <div class="alert warn">
          <span class="aicon">⚠️</span>
          <div>Bot tidak akan membalas nomor-nomor ini.</div>
        </div>
        <div class="tag-list" id="excludedList">
          <span class="tag" onclick="removeExcluded(this)">6281586663847 ×</span>
          <span class="tag" onclick="removeExcluded(this)">6282124928840 ×</span>
          <span class="tag" onclick="removeExcluded(this)">6281271468787 ×</span>
          <span class="tag" onclick="removeExcluded(this)">6285811418236 ×</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input type="text" id="newExcluded" placeholder="628xxxx (tanpa +)" style="flex:1">
          <button class="btn" onclick="addExcluded()">+ Tambah</button>
        </div>
      </div>
    </div>

    <!-- LINK WHITELIST -->
    <div class="section-card" id="sec-links">
      <div class="section-header">
        <div class="section-title">🔗 Whitelist Link yang Boleh Dikirim</div>
      </div>
      <div class="section-body">
        <div class="alert info">
          <span class="aicon">💡</span>
          <div>Hanya link di bawah ini yang boleh dikirim bot. Pastikan persis sama dengan yang di kode sumber.</div>
        </div>
        <div class="field-wrap">
          <div class="field-label">Link Form Daftar</div>
          <input type="text" id="linkDaftar" value="https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=WAGroupAgent&utm_content=RidwanSyahPutraDaeng">
        </div>
        <div class="field-wrap">
          <div class="field-label">Link Grup Agen</div>
          <input type="text" id="linkAgen" value="https://chat.whatsapp.com/Cm0Wo3yngwgFtW4eXlxOSN">
        </div>
        <div class="field-wrap">
          <div class="field-label">Link Agen Maulana</div>
          <input type="text" id="linkMaulana" value="https://mo-vus.com/daftarlangsung?utm_source=external_agents&utm_medium=offline&utm_campaign=tiktokagent&utm_content=Maulana_Munazir">
        </div>
      </div>
    </div>

    <!-- COMPANY INFO -->
    <div class="section-card" id="sec-company">
      <div class="section-header">
        <div class="section-title">🏢 Info Perusahaan & Layanan</div>
      </div>
      <div class="section-body">
        <div class="field-wrap">
          <div class="field-label">Deskripsi Layanan</div>
          <textarea id="serviceDesc" rows="4">Kantor kamu adalah layanan sewa-beli mobil. Setelah 5 tahun sewa, mobil jadi milik customer sepenuhnya.

Keunggulan: Gratis servis & sparepart (aki, ban, dll) 5 tahun, Asuransi all risk 5 tahun ditanggung, Gratis pajak & biaya balik nama, Bebas semua aplikasi online (Gojek, Grab, inDrive, Maxim, dll) maupun offline, CS standby 24 jam, fast respon, Kredit lebih mudah dari konvensional, Pendaftaran dan survey GRATIS.</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field-wrap">
            <div class="field-label">Lokasi Kantor</div>
            <input type="text" id="officeLocation" value="Tanah Abang, Jakarta Pusat">
          </div>
          <div class="field-wrap">
            <div class="field-label">Lokasi Serah Terima</div>
            <input type="text" id="deliveryLocation" value="Cakung, Jakarta Timur">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field-wrap">
            <div class="field-label">Harga Mulai</div>
            <input type="text" id="startPrice" value="200-ribuan">
          </div>
          <div class="field-wrap">
            <div class="field-label">Biaya Awal</div>
            <input type="text" id="initialCost" value="Rp 1.000.000">
          </div>
        </div>
        <div class="field-wrap">
          <div class="field-label">Wilayah Layanan</div>
          <input type="text" id="serviceArea" value="Jabodetabek">
        </div>
        <div class="field-wrap">
          <div class="field-label">Komisi Agen</div>
          <input type="text" id="agentCommission" value="Hingga Rp 500.000 per referral">
        </div>
      </div>
    </div>

    <!-- MODEL & PARAMS -->
    <div class="section-card" id="sec-model">
      <div class="section-header">
        <div class="section-title">⚙️ Model & Parameter AI</div>
      </div>
      <div class="section-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
          <div class="field-wrap">
            <div class="field-label">Model</div>
            <select id="modelSelect">
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
              <option value="llama-3.1-70b-versatile">llama-3.1-70b-versatile</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
              <option value="gemma2-9b-it">gemma2-9b-it</option>
            </select>
          </div>
          <div class="field-wrap">
            <div class="field-label">Max Tokens</div>
            <input type="text" id="maxTokens" value="200">
          </div>
          <div class="field-wrap">
            <div class="field-label">History Limit</div>
            <input type="text" id="historyLimit" value="20">
          </div>
        </div>
        <div class="alert warn">
          <span class="aicon">💡</span>
          <div>Model 8B lebih rentan lupa instruksi. Pertimbangkan upgrade ke <strong>llama-3.1-70b</strong> atau <strong>llama-3.3-70b</strong> jika bot masih sering membuat link sendiri.</div>
        </div>
      </div>
    </div>

    <!-- TOGGLES -->
    <div class="section-card" id="sec-toggles">
      <div class="section-header">
        <div class="section-title">🎛 Opsi Lanjutan</div>
      </div>
      <div class="section-body">
        <div class="toggle-row">
          <span>Repeat larangan link di akhir prompt</span>
          <div class="toggle on" id="tog-repeat" onclick="toggleSwitch(this)"></div>
        </div>
        <div class="toggle-row">
          <span>Pakai sapaan Pak/Bu</span>
          <div class="toggle on" id="tog-greeting" onclick="toggleSwitch(this)"></div>
        </div>
        <div class="toggle-row">
          <span>Log pesan ke console</span>
          <div class="toggle on" id="tog-log" onclick="toggleSwitch(this)"></div>
        </div>
        <div class="toggle-row">
          <span>Trim whitespace reply</span>
          <div class="toggle on" id="tog-trim" onclick="toggleSwitch(this)"></div>
        </div>
        <div class="toggle-row">
          <span>Proteksi nomor excluded</span>
          <div class="toggle on" id="tog-excluded" onclick="toggleSwitch(this)"></div>
        </div>
      </div>
    </div>

    <!-- OUTPUT -->
    <div class="section-card" id="sec-output">
      <div class="section-header">
        <div class="section-title">📄 Preview Output</div>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="previewPrompt()">🔄 Generate</button>
          <button class="btn primary" onclick="copyFullCode()">📋 Copy Kode JS</button>
        </div>
      </div>
      <div class="section-body">
        <div class="field-label" style="margin-bottom:10px">Sistem Prompt yang Akan Digunakan</div>
        <div class="output-box" id="promptOutput" style="position:relative">
          <button class="copy-btn" onclick="copyPrompt()">Copy</button>
          <span style="color:var(--text3)">Klik "Generate" untuk preview sistem prompt...</span>
        </div>
        <div class="divider"></div>
        <div class="field-label" style="margin-bottom:10px">Kode JS Lengkap (index.js)</div>
        <div class="output-box" id="codeOutput" style="position:relative">
          <button class="copy-btn" onclick="copyCode()">Copy</button>
          <span style="color:var(--text3)">Klik "Generate" untuk melihat kode...</span>
        </div>
      </div>
    </div>

  </div>
</main>

<div id="toastContainer"></div>

<script>
function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function toggleSwitch(el) {
  el.classList.toggle('on');
}

function removeExcluded(el) {
  el.remove();
}

function addExcluded() {
  const inp = document.getElementById('newExcluded');
  const val = inp.value.trim();
  if (!val) return;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = val + ' ×';
  tag.onclick = () => tag.remove();
  document.getElementById('excludedList').appendChild(tag);
  inp.value = '';
  showToast('Nomor ditambahkan', 'ok');
}

function getExcludedNumbers() {
  return Array.from(document.querySelectorAll('#excludedList .tag'))
    .map(t => t.textContent.replace(' ×', '').trim())
    .filter(Boolean);
}

function isOn(id) {
  return document.getElementById(id).classList.contains('on');
}

function buildSystemPrompt() {
  const botName = document.getElementById('botName').value;
  const botRole = document.getElementById('botRole').value;
  const linkBan = document.getElementById('linkBan').value;
  const charInst = document.getElementById('characterInstructions').value.replace(/{NAMA_BOT}/g, botName);
  const ctaInst = document.getElementById('ctaInstruction').value;
  const serviceDesc = document.getElementById('serviceDesc').value;
  const officeLocation = document.getElementById('officeLocation').value;
  const deliveryLocation = document.getElementById('deliveryLocation').value;
  const startPrice = document.getElementById('startPrice').value;
  const initialCost = document.getElementById('initialCost').value;
  const serviceArea = document.getElementById('serviceArea').value;
  const agentCommission = document.getElementById('agentCommission').value;
  const linkDaftar = document.getElementById('linkDaftar').value;
  const linkAgen = document.getElementById('linkAgen').value;
  const linkMaulana = document.getElementById('linkMaulana').value;
  const repeatBan = isOn('tog-repeat');
  const greetingPakBu = isOn('tog-greeting');

  let prompt = `${linkBan}

Kamu adalah ${botName}, ${botRole} yang ramah dan sopan.
${charInst}

${ctaInst}

${serviceDesc}

=== LOKASI ===
- Kantor: ${officeLocation}
- Serah terima unit: ${deliveryLocation}

=== MOBIL & HARGA ===
Harga sewa kepemilikan start ${startPrice}
KUOTA TERBATAS!

=== BIAYA AWAL ===
- Biaya awal ${initialCost}, dibayar saat serah terima
- Biaya awal ini memotong biaya mingguan pertama

=== WILAYAH ===
- Layanan: ${serviceArea}
- KTP luar daerah bisa, asal domisili ${serviceArea}
- Bebas keluar kota, tidak ada batasan wilayah

=== PROSES PENGAJUAN ===
Pendaftaran dan survey GRATIS!
PRIORITAS: Minta foto KTP dulu dari calon customer!
Customer bisa kirim foto KTP langsung atau isi form di: ${linkDaftar}

Data yang dibutuhkan:
- Foto KTP (prioritas utama)
- Nomor WA aktif
- Pekerjaan saat ini (kalau tidak ada pekerjaan, cukup foto KTP)

Proses:
1. Kirim foto KTP → tim akan validasi
2. Jadwal survey (gratis)
3. Jika lolos → bayar biaya awal ${initialCost} saat serah terima
4. Ambil mobil di ${deliveryLocation}
Waktu proses: sekitar 1 minggu

=== PROGRAM AGEN / REFERRAL ===
Komisi agen: ${agentCommission}
Cara jadi agen: Join grup WA: ${linkAgen}
Cara kirim referral: minta temannya kirim foto KTP dulu
Link Agen Maulana: ${linkMaulana}

=== CONTOH JAWABAN ===

Pertanyaan: "Mau daftar / tertarik / gimana caranya"
Jawaban: "Pendaftaran gratis Pak/Bu! Silakan kirim foto KTP dulu ya 🙏😊"

Pertanyaan: "Harga berapa?"
Jawaban: "Start ${startPrice} Sudah termasuk asuransi, servis & pajak gratis 5 tahun! Mau daftar? Kirim foto KTP dulu ya 🙏😊"

Pertanyaan: "Biaya awalnya berapa?"
Jawaban: "Biaya awal ${initialCost} Pak/Bu, dibayar saat serah terima dan langsung memotong biaya minggu pertama 🙏😊"

Pertanyaan: "Dimana kantornya?"
Jawaban: "Kantor kami di ${officeLocation}. Serah terima unitnya di ${deliveryLocation} ya Pak/Bu 🙏😊"

Pertanyaan: "Gimana caranya jadi agen?"
Jawaban: "Join grup agen di sini ya Pak/Bu 🙏😊 ${linkAgen} Komisi ${agentCommission}!"

=== PENTING ===
- Kalau ada yang mau daftar, tertarik, atau tanya cara daftar → SELALU minta foto KTP dulu & ingatkan pendaftaran GRATIS
- Jawab singkat, langsung ke inti, jangan bertele-tele${greetingPakBu ? '\n- Pakai sapaan Pak/Bu' : ''}`;

  if (repeatBan) {
    prompt += `\n\n=== PENGINGAT AKHIR ===\n${linkBan}`;
  }

  return prompt;
}

function updateStats(prompt) {
  document.getElementById('charCount').textContent = prompt.length.toLocaleString();
  document.getElementById('tokenCount').textContent = Math.round(prompt.length / 4).toLocaleString();
}

function previewPrompt() {
  const prompt = buildSystemPrompt();
  document.getElementById('promptOutput').innerHTML = `<button class="copy-btn" onclick="copyPrompt()">Copy</button>${escapeHtml(prompt)}`;
  updateStats(prompt);

  const excluded = getExcludedNumbers();
  const model = document.getElementById('modelSelect').value;
  const maxTokens = document.getElementById('maxTokens').value;
  const historyLimit = document.getElementById('historyLimit').value;

  const code = generateJSCode(prompt, excluded, model, maxTokens, historyLimit);
  document.getElementById('codeOutput').innerHTML = `<button class="copy-btn" onclick="copyCode()">Copy</button>${syntaxHighlight(code)}`;

  showToast('Prompt berhasil di-generate ✅', 'ok');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function syntaxHighlight(code) {
  return escapeHtml(code)
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>')
    .replace(/\b(const|let|var|async|await|function|return|if|try|catch|new|require|module\.exports)\b/g, '<span class="kw">$1</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="cmt">$1</span>');
}

function generateJSCode(prompt, excluded, model, maxTokens, historyLimit) {
  const doLog = isOn('tog-log');
  const doTrim = isOn('tog-trim');
  const doExcluded = isOn('tog-excluded');

  return `const express = require("express");
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
const EXCLUDED_NUMBERS = ${JSON.stringify(excluded)};

const SISTEM_PROMPT = \`${prompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

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
${doExcluded ? '    if (EXCLUDED_NUMBERS.includes(sender)) return res.sendStatus(200);' : '    // excluded check disabled'}

${doLog ? '    console.log(`Pesan dari ${sender}: ${message}`);' : ''}

    let history = await getHistory(sender);
    history.push({ role: "user", content: message });

    if (history.length > ${historyLimit}) {
      history = history.slice(-${historyLimit});
    }

    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "${model}",
        messages: [
          { role: "system", content: SISTEM_PROMPT },
          ...history,
        ],
        max_tokens: ${maxTokens},
      },
      {
        headers: {
          Authorization: \`Bearer \${GROQ_API_KEY}\`,
          "Content-Type": "application/json",
        },
      }
    );

    let reply = groqRes.data.choices[0].message.content;
${doTrim ? '    reply = reply.trim();' : '    // trim disabled'}

    history.push({ role: "assistant", content: reply });
    await saveHistory(sender, history);

    await kirimWA(sender, reply);

${doLog ? '    console.log(`Balasan ke ${sender}: ${reply}`);' : ''}
    res.sendStatus(200);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(\`Bot berjalan di port \${PORT}\`);
});
`;
}

function copyPrompt() {
  const prompt = buildSystemPrompt();
  navigator.clipboard.writeText(prompt).then(() => showToast('Prompt disalin!', 'ok'));
}

function copyCode() {
  const excluded = getExcludedNumbers();
  const model = document.getElementById('modelSelect').value;
  const maxTokens = document.getElementById('maxTokens').value;
  const historyLimit = document.getElementById('historyLimit').value;
  const prompt = buildSystemPrompt();
  const code = generateJSCode(prompt, excluded, model, maxTokens, historyLimit);
  navigator.clipboard.writeText(code).then(() => showToast('Kode JS disalin!', 'ok'));
}

function copyFullCode() {
  previewPrompt();
  setTimeout(copyCode, 100);
}

function showToast(msg, type='') {
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.innerHTML = `<span>${type === 'ok' ? '✅' : 'ℹ️'}</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// Auto update stats on load
window.onload = () => {
  const prompt = buildSystemPrompt();
  updateStats(prompt);
};
</script>
</body>
</html>
