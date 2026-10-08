# 📖 rencanakerja.md — PAPAN ORDER PROYEK **PETA DUNIA**

> Dibuat: 7 Oktober 2026 · Lokasi: `C:\data\Peta dunia`
> 🔴 **Aturan papan ini ada di `agents.md` bagian H.** Baca sana dulu.

---

## 0. 📋 PAPAN ORDER

### A. KASUS BELUM SELESAI

| Kode | Kasus | Butir | Status | Tgl |
|------|-------|-------|--------|-----|
| **K20** | **Jalan di browser Android (Chrome)** | | | |
| K20 | a. Selidiki kendala nyata (lokasi berkas, penyimpanan, pekerja web, CORS, tampilan sentuh) | ✅ | ✅ | 8 Okt 2026 |
| K20 | b. **Pertanyaan konsep:** bagaimana data JSON bisa jalan di Chrome Android (mempelajari ANodes) | ✅ | ✅ | 8 Okt 2026 |
| K20 | c. Perbaikan tampilan HP (`100vh` → `dvh`, tombol `⋯` ±44 px) — **belum dikerjakan** | ⏸️ | ⏸️ | — |
| K20 | d. Jalur pemasangan: **GitHub Pages** (dipilih Bapak) | ✅ | ✅ | 8 Okt 2026 |
| K20 | e. **Terpasang & diuji hidup:** `https://suwandhih.github.io/petadunia/` | ✅ | ✅ | 8 Okt 2026 |
| K20 | f. Cadangan versi **satu berkas** (untuk saat internet mati) — **belum dikerjakan** | ⏸️ | ⏸️ | — |

> **K20-d — keputusan pemasangan (8 Okt 2026):** Bapak memilih **GitHub Pages**.
> Sebabnya: lewat HTTPS masalah `file://` **hilang semua** — tidak perlu versi
> "satu berkas", dan kunci AirLabs/pengaturan **tidak pernah hilang**.
> Diperiksa siap: git ada (2.54.0) & terkonfigurasi · alamat berkas di
> `index.html` **semua relatif** · **tidak ada** kunci API di dalam berkas
> (sisa hanya contoh karangan) · tidak ada berkas berawalan `_` (aman dari
> aturan Jekyll). Cara pemasangan ditulis di `panduan.md`.

> K20-b **hanya pertanyaan** — tidak ada kode yang diubah untuk butir ini. Jawabannya:
> **bisa**, dengan syarat aplikasi dijadikan **satu berkas** dan dibuka dari
> aplikasi pengelola berkas Android → "Buka dengan Chrome". Rinciannya di
> `prompt.md` bagian 6.

**Rencana Bapak untuk memindahkan berkas PC → HP (8 Okt 2026):** lewat
**Google Drive**, dipindahkan **manual**. Dicatat di sini supaya tidak ditanya
lagi. ⚠️ Yang perlu diperhatikan: berkas **harus diunduh dulu** ke perangkat
(Drive Android tidak menjalankan berkas HTML dari awan), lalu dibuka dari
aplikasi **Files** → *Buka dengan Chrome*. Sama seperti aturan 6.1 di `prompt.md`.

**Hasil selidik K20-a (8 Okt 2026, sudah dikoreksi sesudah mempelajari ANodes):**
Kendala terbesar **bukan** pada kode, tetapi pada **cara mengirim & membuka**
berkasnya di HP:

1. Chrome Android **tidak bisa** membuka berkas kalau alamat `file:///…` diketik
   di bilah alamat. Yang **bisa**: membuka dari **aplikasi pengelola berkas**
   (`Files` / `File Manager`) → pilih berkas → **Buka dengan Chrome**.
   Bukti: ANodes (`C:\data\ANodes\ANodes-1berkas.html`) **terbukti jalan di
   Chrome Android lewat `file://`** — tertulis di berkasnya sendiri (L21202) dan
   sudah dipakai Bapak.
2. Berkas di HP **tidak bisa membaca berkas lain di foldernya** (`fetch` diblokir
   di `file://`) ⇒ Peta Dunia (13 berkas + MapLibre 955 KB) **harus dijadikan
   SATU BERKAS** lebih dulu. Inilah sebab ANodes dibuat `ANodes-1berkas.html`.
   ✅ Peta Dunia **sudah cocok** untuk cara ini: semua `fetch`-nya hanya ke
   **internet** (USGS, NASA, Open-Meteo, AirLabs), **tidak ada** yang membaca
   berkas lokal.
3. Tampilan HP perlu perbaikan ukuran: `100vh` mengikuti bilah alamat Chrome,
   tombol `⋯` hanya 20×20 px (terlalu kecil untuk jari), kartu ±256–290 px.

Yang **terbukti BUKAN** kendala (diukur, bukan tebakan):

| Diperiksa | Hasil |
|-----------|-------|
| Peker web MapLibre (bundle memakai `blob:`) | ✅ **berhasil** diuji pada asal `file://` |
| WebGL (syarat globe 3D) | ✅ tersedia |
| `localStorage` di `file://` | ✅ jalan di PC; ANodes mencatat jalan juga di Chrome Android |
| Alamat luar `http://` | ✅ tidak ada satu pun (kalau nanti perlu `http://localhost`, tidak perlu ubah kode) |
| Firewall PC & alamat LAN | IP = **192.168.1.4**, aturan `python.exe` sudah diizinkan |
| **K17** | **Peta Dunia real-time (kategori)** | | | |
| K17 | a. Peta dasar realistis (globe 3D + citra satelit) | ✅ | ✅ | 6 Okt 2026 |
| K17 | b1. **Angin** — animasi partikel mengalir + panah arah | ✅ | ✅ | 6 Okt 2026 |
| K17 | b2. **Hujan** — radar hujan bergerak (RainViewer) | ✅ | ✅ | 7 Okt 2026 |
| K17 | b3. **Suhu** — peta panas permukaan (NASA GIBS) | ✅ | ✅ | 7 Okt 2026 |
| K17 | b4. **Awan** — tutupan awan satelit (NASA GIBS) | ✅ | ✅ | 7 Okt 2026 |
| K17 | c. Kategori **Kebakaran hutan** — animasi titik api | ✅ | ✅ | 6 Okt 2026 |
| K17 | d. Kategori **Gempa bumi** — animasi gelombang | ✅ | ✅ | 6 Okt 2026 |
| K17 | e. Kategori **Gunung vulkanik** — status & abu | ✅ | ✅ | 6 Okt 2026 |
| K17 | f. Kategori **Penerbangan** — animasi pesawat bergerak | ✅ | ✅ | 7 Okt 2026 |
| K17 | g. Kategori **Kapal laut** — animasi kapal bergerak | ⬜ | ⬜ | — |
| K17 | h. Kategori **Kereta** — animasi kereta bergerak | ⬜ | ⬜ | — |
| K17 | i. Panel pilih kategori + tombol nyala/mati | ✅ | ✅ | 6 Okt 2026 |
| K17 | j. Uji PC + HP | ✅ | ✅ | 7 Okt 2026 |

### B. ANTREAN KERJA

| Kode | Kasus | Butir | Status | Tgl |
|------|-------|-------|--------|-----|
| **K18** | **Rapikan dokumen proyek** | | | |
| K18 | a. `agents.md` akar diisi aturan main Peta Dunia | ✅ | ✅ | 7 Okt 2026 |
| K18 | b. `prompt.md` · `panduan.md` · `rencanakerja.md` di akar diisi isi Peta Dunia | ✅ | ✅ | 7 Okt 2026 |
| K18 | c. `catatanAI.md` dibuat (wajib aturan G2) | ✅ | ✅ | 7 Okt 2026 |
| K18 | d. Judul tanggal `CHANGELOG.md` yang hilang dipasang kembali | ✅ | ✅ | 7 Okt 2026 |
| K18 | e. Penomoran bagian `agents.md` dirapikan (A–H berurutan) | ✅ | ✅ | 7 Okt 2026 |

#### 📌 SISA PEKERJAAN K17 (urut pengerjaan)

| Urut | Butir | Perkiraan | Catatan penting |
|------|-------|-----------|-----------------|
| 1 | **K17-g Kapal laut** | ±10 menit | Sumber **Digitraffic** (Finlandia, punya CORS). ⚠️ **Hanya Eropa Utara + Laut Baltik** — belum ada sumber gratis seluruh dunia. Harus diberitahu ke Bapak. Alat `PD.alat.kapal()` sudah siap. **Wajib uji CORS dulu.** |
| 2 | **K17-h Kereta** | ±8 menit | Sumber **Digitraffic** (Finlandia, punya CORS). ⚠️ **Hanya Finlandia**. Alat `PD.alat.kereta()` sudah siap. **Wajib uji CORS dulu.** |

⚠️ **Aturan wajib sebelum pakai sumber data baru:** uji dulu header CORS-nya
(`curl -D - -H "Origin: null" <url>` → cari `access-control-allow-origin`).
**Jangan** percaya hasil uji browser otomatis. Rinciannya di `prompt.md` bagian 4.

⚠️ **Pelajaran keras 7 Okt 2026:** sumber **posisi pesawat gratis tanpa kunci
TIDAK ADA yang punya CORS.** Sudah diuji 9 sumber (adsb.lol, adsb.fi,
airplanes.live, adsb.one, globe.adsbexchange.com, globe.adsb.fi, dll.) —
semuanya tanpa header CORS. Untuk kapal pun kemungkinan serupa, jadi uji dulu
sebelum menulis kode.

### C. IDE

| Ide | Tanda | Catatan |
|-----|-------|---------|
| Kategori tambahan di luar daftar K17 | 🟡 perlu diperdalam | menunggu usulan Bapak |
| Sumber gratis kapal & kereta seluruh dunia | 🟡 perlu diperdalam | sekarang hanya Eropa Utara |
| Angka derajat suhu (bukan hanya warna) | 🟡 perlu diperdalam | butuh sumber angka; skala warna NASA GIBS tidak bisa dibaca |
| Jejak/ekor penerbangan (lintasan pesawat) | 🟡 perlu diperdalam | AirLabs hanya memberi 1 titik posisi terbaru, bukan riwayat |

### D. SELESAI

| Kode | Keterangan | Tgl |
|------|------------|-----|
| — | Inisialisasi proyek: dokumen dasar dibuat | 30 Sep 2026 |
| K17 a, b1, c, d, e, i | Peta globe + satelit, Angin, Kebakaran, Gempa, Gunung, Panel kategori | 6 Okt 2026 |
| K18 a–e | Dokumen proyek dirapikan & difokuskan ke Peta Dunia | 7 Okt 2026 |
| K17 b2, b3, b4 | Hujan (radar RainViewer), Suhu & Awan (NASA GIBS) | 7 Okt 2026 |
| K17 f | Penerbangan (AirLabs) + kotak cari penerbangan & rute + perbaikan 2 bug tersembunyi + **uji kunci sungguhan (berhasil)** | 7 Okt 2026 |
| K17 j | Uji PC (8 kategori serentak) + uji HP (layar sempit) | 7 Okt 2026 |
| K19 | Awan realistis — hilangkan peta awan berpalet merah, gunakan foto satelit asli sebagai satu-satunya tampilan | 8 Okt 2026 |
| — | **Perbaikan pasca-keluhan *"AirLabs: Unknown api_key"*** (kunci palsu sisa uji dibersihkan · validasi bentuk kunci · pesan galat jelas · tombol Hapus kunci · bug angka 0 karangan · kartu = ringkasan) | 7 Okt 2026 |
| — | **Tombol `⋯`** pada tiap kategori (kartu pengaturan selalu bisa dibuka, termasuk di HP) | 7 Okt 2026 |
| — | **Animasi Angin hilang diperbaiki** — sebabnya **jatah harian Open-Meteo habis** (bukan gangguan sebentar); ditambah **server cadangan** `historical-forecast-api` + catatan "habis hari ini" | 7 Okt 2026 |
| — | **Kebakaran "hilang"** dipastikan **bukan bug** — animasi dijeda browser saat halaman tidak terlihat (terbukti: 0 bingkai dijalankan, sumber HTTP 200) | 7 Okt 2026 |

---

## 📌 CATATAN

- Order baru dari Bapak → dicatat dulu di tabel **A** atau **B** dengan tanda ⬜, **baru dikerjakan**.
- **Dokumen tidak di-update di tengah perbaikan** — di-update **sekali** setelah sesi selesai.

---

## 🗓️ CATATAN AKHIR SESI — 6 Oktober 2026

**Keadaan aplikasi saat itu (sudah jalan & sudah diuji):**

| Kategori | Sumber data | Cakupan |
|----------|-------------|---------|
| 🌊 Gempa Bumi | USGS | Seluruh dunia |
| 🔥 Kebakaran Hutan | NASA GIBS WMS + GDACS | Seluruh dunia |
| 🌋 Gunung Vulkanik | Wikidata + GDACS | Seluruh dunia |
| 💨 Angin | Open-Meteo | Seluruh dunia |

**Sudah selesai:** K17 a, b1, c, d, e, i → **6 dari 13 butir**.
**Sisa:** K17 f, g, h, b2, b3, b4, j → **7 butir** (lihat tabel sisa pekerjaan di atas).

**Berkas aplikasi:** `app/` — `index.html`, `css/gaya.css`, `js/inti.js`,
`js/lapisan/` (alat, gempa, kebakaran, gunung, angin), `js/lib/maplibre-gl.js`.

**Cara membuka:** klik dua kali `app/index.html` (langsung dari berkas, tanpa server).

**Pelajaran penting (jangan diulang):**
1. Sumber data **wajib** punya header CORS — kalau tidak, browser memblokirnya.
   Kebakaran & Gunung sempat gagal karena ini.
2. **Jangan** percaya hasil uji browser otomatis soal CORS — browser uji bisa longgar.
3. Titik di balik globe harus disembunyikan, kalau tidak tampak seperti titik nyasar.

---

## 🗓️ CATATAN AKHIR SESI — 7 Oktober 2026

**K17 hampir tuntas: 11 dari 13 butir selesai.** Sisa hanya **g. Kapal** dan
**h. Kereta**.

### Keadaan aplikasi sekarang (8 kategori, sudah diuji bersamaan, 0 galat)

| Kategori | Sumber data | Cakupan | Jenis tampilan |
|----------|-------------|---------|----------------|
| 🌊 Gempa Bumi | USGS | Seluruh dunia | Titik + gelombang |
| 🔥 Kebakaran Hutan | NASA GIBS WMS + GDACS | Seluruh dunia | Titik api |
| 🌋 Gunung Vulkanik | Wikidata + GDACS | Seluruh dunia | Titik + status |
| 💨 Angin | Open-Meteo | Seluruh dunia | Partikel mengalir |
| 🌧️ Hujan | RainViewer | Seluruh dunia | Ubin radar beranimasi |
| ✈️ Penerbangan | **AirLabs** | Seluruh dunia | Pesawat bergerak + rute |
| 🌡️ Suhu Permukaan | NASA GIBS WMTS | Seluruh dunia | Ubin warna |
| ☁️ Awan | NASA GIBS (WMTS + WMS) | Seluruh dunia | **Dua mode: foto satelit / rapi tanpa celah** (kepekatan bisa diatur) |

### ⚠️ Yang masih perlu diuji oleh Bapak

**Kategori Penerbangan sudah diuji dengan kunci sungguhan — berhasil.** Kunci
**tidak ditulis di kode** (aturan F5/F8) — Bapak menempelkannya sendiri di kotak
pada panel kategori. Kunci disimpan di `localStorage` dengan nama `pd_airlabs_key`.

**Batas resmi paket free AirLabs** (dibaca dari endpoint `ping` pada 7 Okt 2026):
**1.000 kueri/bulan · 2.500/jam · 250/menit**, berlaku sampai **7 November 2026**.

**Hasil uji nyata:** 400 pesawat terambil (dibatasi dari 3.252 di bbox luas) ·
**±380 terlihat di layar** · pencarian `AK378` → **KUL → DPS · AirAsia A20N ·
8.828 m · 772 km/j** · **0 galat**.

> 📌 **Catatan penting untuk Bapak:** kunci AirLabs **sudah terhapus** dari peramban
> saat saya mencari sebab keluhan *"AirLabs: Unknown api_key"* (sebabnya kunci
> palsu sisa uji saya). **Mohon tempel ulang kuncinya sekali** lewat tombol **`⋯`**
> pada baris ✈️ Penerbangan. Kunci Bapak **masih berlaku sampai 7 Nov 2026**
> (dibuktikan dengan `curl` ke endpoint `ping` → dijawab `pong`).
> Saat uji terakhir, pencarian `AK9988` **berhasil** (maskapai AK · A320 ·
> 11.907 m · en-route), jadi jalurnya sudah terbukti sehat.

### 🧠 Pelajaran keras sesi ini (jangan diulang)

1. **Sumber posisi pesawat gratis tanpa kunci TIDAK ADA yang punya CORS.**
   Diuji 9 sumber: OpenSky, `api.adsb.lol`, `opendata.adsb.fi`,
   `api.airplanes.live`, `api.adsb.one`, `globe.adsbexchange.com`,
   `globe.adsb.fi`, `globe.adsb.one`, `globe.adsb.lol` — **semuanya gagal.**
   OpenSky mengirim `Access-Control-Allow-Origin: https://opensky-network.org`,
   **bukan `*`** → mati dari `file://`. Karena itu **AirLabs** yang dipakai.
2. **`globe.airplanes.live/re-api/` punya CORS `*` DAN data lengkap, tetapi
   wajib mengirim `Referer: https://globe.airplanes.live/`** — tanpa itu 403.
   Dari `file://` browser tidak pernah mengirim Referer → tidak bisa dipakai.
3. **Browser uji otomatis TIDAK menegakkan CORS.** Ia berhasil membaca
   `adsb.lol` dan `opendata.adsb.fi` yang curl buktikan tanpa header CORS.
   → **Hanya `curl -D - -H "Origin: null"` yang sahih.** Jangan percaya browser.
4. **Membuang sumber ubin saat gambar masih di udara → MapLibre mogok**
   (`Cannot read properties of undefined (reading 'bind')`).
   Cukup `setPaintProperty(opacity, 0)`, **jangan** buang sumbernya.
5. **Ganti gaya peta (`setStyle`) dengan sumber tambahan aktif → 15 galat.**
   Perbaikan yang terbukti: **lepas lapisan TEPAT SEBELUM `setStyle`.**
   Diuji: tanpa kategori 0 galat, dengan lapisan 15 galat, lepas-dulu 0 galat.
6. **`PD.peta.getStyle()` mengembalikan objek BARU tiap panggilan** → tidak bisa
   dipakai membandingkan gaya. Harus pakai **identitas objek `PD.peta.style`**.
7. **RainViewer punya batas keras 500 permintaan / 60 detik per IP** → HTTP 429.
   Karena itu ubin **512 px** (bukan 256 px) dan `maxzoom 7` — resolusi ganda
   dengan jumlah permintaan sama. Animasi 30 detik = **0 permintaan baru**.
8. **NASA GIBS tidak menyediakan legenda/skala warna** (semua endpoint → 404)
   → **angka derajat suhu dan persen awan TIDAK ditampilkan** (aturan F8:
   jangan mengarang angka).
9. **Dua bug tersembunyi pada kategori Penerbangan** (ditemukan di uji akhir,
   keduanya tidak menampilkan pesan apa pun — kategori cuma tampak "diam"):
   - `return` **di dalam** `try` melewati baris `sedangAmbil = false` →
     **satu kegagalan mengunci kategori SELAMANYA**. Perbaikan: lepas penjaga
     di blok **`finally`**.
   - Permintaan `fetch` **tanpa batas waktu** → sumber yang menggantung membuat
     kategori diam selamanya. Perbaikan: `A.ambil()` memasang **batas waktu
     20 detik** dan melaporkan *"tidak menjawab (waktu habis)"*.
   **Pelajaran umum:** setiap penjaga "sedang bekerja" **wajib** dilepas di
   `finally`, dan **setiap** permintaan internet wajib punya batas waktu.
10. **NASA GIBS kadang menjawab HTTP 500 sementara** untuk beberapa ubin
    (diuji ulang dengan `curl` → **200**). Itu **galat sementara peladen NASA**,
    bukan bug aplikasi — ubin kosong sesaat lalu terisi sendiri.
11. **Label angka harus sesuai artinya.** Dulu tertulis "Pesawat tampak" padahal
    angkanya jumlah yang **dimuat** (batas 400), bukan yang **terlihat di layar**.
    Sekarang dipisah: **"Pesawat di layar"** dan **"Pesawat terambil"**.
    **Pelajaran umum:** jangan memberi label yang membuat Bapak salah paham —
    angka yang ditampilkan harus benar-benar berarti seperti tulisannya.
12. **AirLabs TIDAK mengirim sisa jatah.** Endpoint `ping` hanya memberi **batas**
    (1.000/bulan · 2.500/jam · 250/menit) dan masa berlaku. Jadi perkiraan sisa
    jatah dihitung **oleh aplikasi sendiri** dan **dinyatakan apa adanya** sebagai
    *"perkiraan … (hitungan sendiri)"* — jangan pernah menampilkannya seolah angka
    resmi AirLabs (aturan F8).
13. **Peta warna NASA bisa "horor".** Ubin awan lama
    (`MODIS_Terra_Cloud_Fraction_Day`) setelah **dibongkar piksel demi piksel**
    ternyata berisi **merah menyala `rgb(255,0,5)` 46%** + **ungu `rgb(102,0,119)`
    14%**, kejenuhan warna **99%**. Bapak mengeluh "horor" dan memang benar.
    **Perbaikan:** pakai **foto asli satelit**
    (`MODIS_Terra_CorrectedReflectance_TrueColor`) — kejenuhan hanya **18%** dan
    **17% piksel putih bersih** (awan tampak alami).
    **Pelajaran umum:** bila lapisan NASA tampak menyala keras, **coba dulu foto
    aslinya** (`CorrectedReflectance_TrueColor`) — lebih enak dilihat **dan** lebih
    jujur daripada peta warna yang butuh legenda.
    **Cara memeriksa secara pasti:** unduh satu ubin, baca chunk `PLTE`/`tRNS` PNG
    dan hitung warna mana yang paling banyak dipakai — **jangan menebak dari
    penglihatan saja.**
14. **Foto satelit bersifat OPAK** (menutupi peta dasar). Karena itu lapisan foto
    perlu **opasitas sedang** (mis. 0,72) dan sebaiknya **opasitasnya bisa diatur
    Bapak sendiri**; pilihan disimpan di `localStorage`.
15. **Sifat warna lapisan (`raster-contrast`, dsb) WAJIB dipasang ulang** setiap
    kali lapisan dibuat baru — sebab gaya peta bisa diganti dan lapisan dipasang
    ulang. Di `PD.alat.lapisan()` ini diurus lewat opsi `paint: {...}`.
16. **🔴 Kunci/nilai PALSU sisa uji pernah tertinggal di peramban Bapak** dan
    membuat kategori Penerbangan berbunyi *"AirLabs: Unknown api_key"* — Bapak
    mengira kuncinya rusak. **Penyebabnya kesalahan saya** (menempel kunci
    `uji-benar` untuk menguji pesan galat, lalu tidak dibersihkan).
    **Pelajaran:** sesudah uji, **selalu** bersihkan `localStorage`; dan bila Bapak
    melaporkan galat aneh, **periksa isi `localStorage` lebih dulu** sebelum
    menyalahkan sumber data. Bukti `curl` ke endpoint `ping` menentukan apakah
    kunci asli masih sah (`pong` = masih sah).
17. **`Number(null)` bernilai 0 di JavaScript.** Akibatnya "tidak ada data"
    berubah menjadi **angka 0 karangan** — kartu pesawat `AK9988` menulis
    *"Kecepatan 0 km/j"* padahal AirLabs tidak mengirim kecepatan untuk pesawat
    itu. **Pelajaran:** periksa "ada isinya atau tidak" **lebih dulu**, dan
    tampilkan **"—"** bila tidak ada. (Melanggar aturan F8 kalau dibiarkan.)
18. **Kartu pengaturan kategori hanya bisa dibuka lewat klik peta — itu salah.**
    Klik peta **diperebutkan** seluruh kategori aktif: diuji 8 klik, hanya **4**
    yang membuka kartu yang dimaksud. **Perbaikan:** tombol **`⋯`** pada tiap
    baris kategori (`inti.js` + `gaya.css`). Sekarang **selalu** bisa dibuka,
    termasuk di HP.
19. **Angka "Pesawat di layar" di kartu sempat selalu 400** (jumlah dimuat),
    sedangkan ringkasan menulis 387 (yang tampak). Perbaikannya bukan menambah
    perhitungan baru, tetapi **memakai syarat yang sama** dengan fungsi gambar
    (`hitungDiLayar()`). **Pelajaran:** satu angka yang muncul di dua tempat
    **wajib** dihitung dengan cara yang sama.
20. **Jangan memperbaiki ubin gagal dengan `source.setTiles()`.** Saya sempat
    mencobanya untuk memulihkan ubin NASA yang kena 500, dan **bugs MapLibre
    (`reading 'bind'`) hidup kembali** (2 galat halaman). Percobaan itu
    **dibatalkan seluruhnya**. **Pelajaran:** jangan menukar keandalan aplikasi
    hanya demi kerapian tampilan.
21. **Kegagalan sementara sumber data (mis. Open-Meteo HTTP 429 — batas laju)
    JANGAN menggagalkan kategori.** Terbukti: saat saya membuat `muat()` melempar
    galat untuk data kosong, kategori 💨 Angin **gagal dinyalakan** dan yang
    tertinggal hanya *"data angin kosong"* — Bapak tidak akan tahu sebabnya.
    **Perbaikan:** biarkan kategori tetap menyala, **katakan apa adanya** lewat
    ringkasan (*"Open-Meteo kehabisan jatah harian — dicoba lagi nanti"*),
    dan coba lagi pada penjadwalan berikutnya. **Pelajaran umum:** kegagalan
    sementara → **penjelasan**, bukan **penolakan**.
22. **`HTTP 429` ada DUA jenis, dan bedanya mahal.** Saat Bapak melaporkan
    *"animasi angin hilang"*, saya sangka itu batas laju sebentar. Setelah membaca
    **isi** jawabannya, ternyata: *"Daily API request limit exceeded. Please try
    again tomorrow."* — artinya **jatah harian habis sampai besok**. Saya bahkan
    sempat mencoba menolongnya dengan **membuka permintaan dari alamat internet
    berbeda**, dan itu **TIDAK menolong** (jatah Open-Meteo dihitung **per
    jaringan/IP**, bukan per alamat web/profil peramban).
    **Perbaikan yang benar:** pindah ke **alamat server yang setara** —
    `historical-forecast-api.open-meteo.com` (`200`, data sama, CORS `*`) — dan
    simpan catatan *"sumber utama habis hari ini"* di `localStorage`
    (`pd_angin_utama_lelah`) supaya tidak dihubungi lagi sampai besok.
    **Pelajaran umum:** **baca isi jawaban galat, jangan hanya kodenya**; dan untuk
    jatah, tukar **penyedia/alamat server**, bukan alamat halaman.
23. **"Animasi hilang" belum tentu bug — browser menjeda animasi di halaman yang
    tidak terlihat.** Bapak melaporkan 💨 Angin dan 🔥 Kebakaran "hilang".
    Setelah diperiksa di halaman yang Bapak tinggalkan: `document.visibilityState`
    = **`hidden`**, dan **tidak satu pun** bingkai animasi dijalankan (dipasang
    penghitung pada `requestAnimationFrame` dan pada setiap fungsi `gambar()` →
    hasilnya **0**). Sumber kebakaran diuji `curl` → **HTTP 200** (sehat).
    Jadi: **kebakaran bukan rusak**, cukup buka lagi halamannya (langsung muncul
    6.408 titik api). **Pelajaran umum:** sebelum menyalahkan kode, periksa
    (a) halamannya sedang terlihat atau tidak, (b) apakah fungsi gambar dipanggil,
    (c) keadaan sumber datanya dengan `curl`. Hati-hati: **browser uji saya sendiri
    sering berada di latar belakang**, jadi "0 bingkai" bisa menyesatkan bila tidak
    diperiksa keadaan halamannya lebih dulu.

### 📁 Berkas yang berubah sesi ini

| Berkas | Perubahan |
|--------|-----------|
| `app/js/lapisan/alat.js` | + `A.lapisan()` (pasang lapisan ubin raster, tahan ganti gaya) — 9.070 → 12.406 byte |
| `app/js/lapisan/hujan.js` | **BARU** — 7.379 byte |
| `app/js/lapisan/penerbangan.js` | **BARU** — 15.886 byte |
| `app/js/lapisan/suhu.js` | **BARU** — 3.382 byte |
| `app/js/lapisan/awan.js` | **BARU** — 3.100 → **4.921 byte** (ganti sumber ke foto asli + kepekatan Tipis/Sedang/Tebal) |
| `app/js/lapisan/alat.js` | + `opasitas()` & sifat warna `paint` — 13.298 → 14.238 byte |
| `app/css/gaya.css` | + `.info-kotak`, `.info-tombol`, `.info-tombol.pudar` |
| `app/index.html` | + 4 berkas kategori baru (penanda versi dinaikkan: `alat?v=…-6`, `penerbangan?v=…-5`) |
| `app/js/lapisan/alat.js` | + **batas waktu 20 detik** pada `A.ambil()` (jangan biarkan permintaan menggantung) |
| `app/js/lapisan/penerbangan.js` | perbaikan: pelepasan penjaga `sedangAmbil` dipindah ke `finally` + pesan jujur saat waktu habis |
| `app/js/lapisan/penerbangan.js` | + label "Pesawat di layar"/"Pesawat terambil", catatan batas 400, tombol "Segarkan sekarang", perkiraan sisa jatah (hitungan sendiri), indentasi dirapikan — 15.886 → **18.421 byte** |
| `app/js/lapisan/penerbangan.js` | 18.421 → **22.085 byte**: validasi bentuk kunci, pesan galat jelas, tombol "Hapus kunci", `hitungDiLayar()` (kartu = ringkasan), bug angka 0 karangan (`keAngka()`) |
| `app/js/lapisan/suhu.js` | 3.382 → **3.962 byte**: uji ketersediaan diulang 3× (NASA GIBS kadang 500 acak) |
| `app/js/lapisan/awan.js` | 4.921 → **5.424 byte**: uji ketersediaan diulang 3× juga |
| `app/js/lapisan/angin.js` | Open-Meteo 429 **tidak lagi menggagalkan kategori**; pesan jelas ("membatasi permintaan — coba lagi"); ringkasan jujur saat belum ada data — 11.402 → **13.293 byte** |
| `app/js/inti.js` | + tombol **`⋯`** tiap kategori; bila kategori tak punya pengaturan, ditampilkan kartu keterangan — 14.718 → **15.428 byte** |
| `app/js/lapisan/angin.js` | + **server cadangan** `historical-forecast-api.open-meteo.com` + catatan `pd_angin_utama_lelah` (jatah habis hari ini) + pesan jelas — 13.293 → **15.936 byte** |
| `app/css/gaya.css` | + gaya `.kartu .tombol-kartu` — **8.542 byte** |
| `app/index.html` | `inti?v=…-2` · `alat?v=…-8` · `gaya.css?v=…-2` · `angin?v=…-5` · `penerbangan?v=…-13` · `suhu?v=…-3` · `awan?v=…-5` |

Backup sebelum perubahan: `backups\k17f-penerbangan-20261007-144032\`,
backup akhir sesi: `backups\akhir-sesi-k17-20261007-162844\` (sebelum perbaikan
bug), `backups\akhir-sesi-k17-perbaikan-bug-20261007-170000\` (sesudah perbaikan
bug), `backups\akhir-sesi-k17-kunci-nyata-20261007-174500\` (sesudah uji kunci
sungguhan), `backups\akhir-sesi-kunci-titik-tiga-20261007-190500\` (sesudah
pencarian sebab *"Unknown api_key"* + tombol `⋯`).

---

## 🗓️ CATATAN AKHIR SESI — 7 Oktober 2026 (lanjutan 3)

### ☁️ Awan: celah lintasan — Bapak memilih **dua-duanya** (opsi C)

> Catatan ini merekam keadaan pada 7 Oktober 2026. Pada 8 Oktober, pilihan
> peta awan berpalet warna dihapus atas arahan Bapak; tampilan Awan sekarang
> hanya foto satelit realistis. Lihat K19 di tabel **D. SELESAI**.

**Bapak bertanya:** *"apakah awan masih bisa perbaiki yg kosong2 seperti pasted
image"* — yaitu **celah gelap miring** di lapisan Awan. Bapak memilih **opsi C**:
sediakan **foto satelit (bawaan)** + tombol **"Rapi tanpa celah"**.

**Hasil:** kategori ☁️ Awan sekarang punya **dua tombol jenis** + tiga tombol
kepekatan. Baik jenis maupun kepekatan **diingat** (`pd_awan_jenis`,
`pd_awan_opasitas`).

| | **Foto satelit** (bawaan) | **Rapi tanpa celah** |
|---|---|---|
| Sumber | WMTS `MODIS_Terra_CorrectedReflectance_TrueColor` | WMS `wms.cgi`, 4 lapisan `*_Cloud_Fraction_*` |
| Level | `Level9` (maxzoom 9), `.jpg` | **`Level6`** (maxzoom 6), `.png` |
| Celah terukur | Terra sendiri **33,8%** | **0,0%–2,4%** |
| `paint` | `contrast 0.15`, `saturation -0.15` | `contrast 0.10`, `saturation -0.5` |

### 🧠 Pelajaran keras sesi ini (DUA klaim saya sebelumnya SALAH)

**Koreksi 1 — "peta tutupan awan tanpa celah sama sekali" → SALAH.**
Ternyata peta tutupan awan **punya celah yang sama**, terukur **cocok 97–100%**
dengan hitam di foto (dibandingkan berpasangan, 12 ubin z4, 4 tanggal).

**Koreksi 2 — "menumpuk beberapa lapisan bisa menambal celah" → hanya benar
untuk peta tutupan awan, TIDAK untuk foto.** Foto bersifat **OPAK**, jadi
menumpuk **makin gelap** (terukur di 10 ubin bercelah z4):

| Susunan | Bagian gelap |
|---|---|
| Foto: Terra saja | 49,2% |
| Foto: Terra + Aqua | **68,4%** ← makin gelap |
| Foto: Terra + Aqua + SNPP | **99,0%** ← makin gelap |
| Tutupan awan: 4 lapisan | **0,0%–2,4%** |

**Sebabnya:** ubin `*_Cloud_Fraction_*` punya **kanal alfa** (`PLTE`+`tRNS`);
"tembus pandang" = **tidak ada data**, jadi lapisan berikutnya bisa mengisi.
Foto tidak punya alfa → lapisan atas **menutupi**, bukan menambal.

**Pelajaran cara mengukur:** kesimpulan pertama saya salah karena hanya melihat
**1–2 ubin contoh**. Setelah memeriksa **seluruh** ubin satu tingkat zoom
(256 ubin z4) dan **4 tanggal**, barulah gambarnya benar → jadi aturan **I19**.

### 🎨 Warna "horor" — penanganan yang benar

- Palet resmi NASA tetap menyala keras (idx 101 merah `rgb(255,0,5)` sendirian
  **55,7%** piksel di ubin Indonesia; kejenuhan ≥ 0,71 untuk **semua** indeks).
- **Jangan `raster-saturation: -1`.** Palet memakai **warna** untuk tingkat,
  bukan kecerahan. Terukur jumlah **pasangan warna kembar**: `-0,85` → 9,
  `-0,5` → 28, `-1` → **146 dari 5.050 pasangan** (tingkat berbeda jadi sama).
- Dipakai **sedang**: `saturation -0,5` + `contrast 0,10`.
- **Legenda resmi NASA ditemukan** (`/legends/MODIS_Cloud_Fraction_H.png`, dari
  GetCapabilities WMS) — jadi skala warnanya **bisa** dibaca. Tetap **tidak
  ditampilkan** di aplikasi (aturan F8), tetapi dicatat di sini supaya tidak
  dikarang.

### ⚡ Kecepatan: WMS tidak lebih lambat

Terukur 7 Okt 2026: **keduanya ±1,0–1,2 detik/ubin**, dan **keduanya** selalu
`X-Cache: Miss` + `Cache-Control: max-age=0, no-store, no-cache, must-revalidate`.
Jadi mode "Rapi" (1 permintaan = 4 lapisan) **tidak lebih lambat**; 4 lapisan
terpisah justru butuh **4 permintaan**. → pelajaran **I22**.

### 🧪 Hasil uji (halaman `file://`, peramban sebenarnya)

| Uji | Hasil |
|---|---|
| Muat halaman, 0 galat | ✅ |
| Ganti jenis Foto → Rapi → Foto (3×) | ✅ tiap kali 1 lapis + 1 sumber, `paint` ikut berganti, **0 galat** |
| Klik tombol jenis yang sama dua kali | ✅ tidak melakukan apa-apa, 0 galat |
| Kartu pengaturan ikut berganti judul & isi | ✅ |
| 4× tukar gaya peta (Satelit ↔ Peta) dengan Awan + Suhu aktif | ✅ lapisan selalu kembali, **0 galat** (hanya 500 acak NASA, bawaan) |
| 8 kategori bersamaan | ✅ aktif = 8 · 0 galat tak terduga (1 `AbortError` dari `hujan.js`→`setTiles`, **sudah ada sebelumnya**, bukan dari perubahan ini) |
| "Matikan semua" | ✅ aktif = 0 |
| HP 390×844 + tombol ☰ | ✅ panel buka/tutup benar |

### 📁 Berkas yang berubah sesi ini

| Berkas | Perubahan |
|--------|-----------|
| `app/js/lapisan/awan.js` | 5.424 → **11.245 byte**: dua jenis tampilan (foto/rapi), `KEKAL_JENIS`, `paint` per jenis, kartu pengaturan digambar ulang (`isiKartu()`/`pasangKartu()`), ganti jenis lewat `tutup()` + pasang ulang (**bukan** `gantiUbin`) |
| `app/index.html` | `awan?v=20261007-6` |

Backup sebelum perubahan: `backups\awan-rapi-20261007-205717\`,
`backups\awan-rapi2-20261007-213934\`.

### ⚠️ Hal yang tetap jujur dikatakan ke Bapak

1. Mode "Rapi" **bukan warna asli** awan — palet NASA (ungu–merah), dilembutkan.
2. Sisa celah mode "Rapi" **tidak nol sempurna**: **0–2%** (z2/z3), terburuk
   **11,5%** pada satu ubin.
3. Celah mode "Foto" **tidak bisa** dihilangkan (foto opak).
