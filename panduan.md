# 📘 panduan.md — CARA PAKAI **PETA DUNIA**

> Panduan ini untuk **Bapak** — ditulis dengan **bahasa biasa**, bukan bahasa teknis.
> Tujuannya: supaya Bapak bisa memakai aplikasinya **tanpa perlu bertanya**.

---

## 0. 📌 Status sekarang

Aplikasi **sudah jalan**. Yang sudah bisa dipakai: **8 kategori** —
🌊 Gempa Bumi · 🔥 Kebakaran Hutan · 🌋 Gunung Vulkanik · 💨 Angin ·
🌧️ Hujan · ✈️ Penerbangan · 🌡️ Suhu Permukaan · ☁️ Awan.

Masih ada **2 kategori** yang belum dibuat: 🚢 Kapal laut · 🚆 Kereta.

> ✈️ **Penerbangan perlu kunci gratis dari AirLabs** — cara mengambil & menempelkannya
> ada di bagian 5b di bawah. Tanpa kunci, kategori Penerbangan tidak bisa menampilkan
> pesawat (dan aplikasi akan bilang terus terang, bukan mengarang).
> ✅ **Sudah diuji dengan kunci sungguhan dan berhasil** — ±380 pesawat tampak di layar,
> lengkap dengan rute & maskapainya.
>
> ⚠️ **Kunci pernah terhapus** dari peramban saat saya mendiagnosis keluhan
> *"AirLabs: Unknown api_key"* (sebabnya kunci palsu sisa uji saya, bukan kunci Bapak).
> **Mohon tempel ulang kunci sekali** lewat tombol `⋯` pada baris ✈️ Penerbangan.
> Kunci Bapak masih berlaku sampai **7 November 2026**.
> 🔒 **Kunci asli juga saya hapus dari kode & dokumen** (dulu tertulis sebagai
> "contoh bentuk"). Sekarang contohnya karangan, sesuai aturan F12 — jadi kunci
> Bapak tidak tersimpan di berkas mana pun, hanya di peramban Bapak.
> Catatan pemakaian diperbarui menjadi **15 kueri** (perkiraan) karena banyak uji
> pada sesi ini — itu hitungan kita sendiri, bukan angka resmi AirLabs.

---

## 1. 📱 CARA MEMBUKA APLIKASI

1. Buka folder `C:\data\Peta dunia\app`
2. **Klik dua kali** berkas `index.html`
3. Aplikasi langsung terbuka di peramban (browser) — **tidak perlu internet khusus**,
   tidak perlu memasang apa pun.

> 💡 Kalau peta tampak kosong/gelap, tunggu sebentar — citra satelit sedang dimuat.

---

## 2. 🗺️ APA YANG ADA DI LAYAR

| Bagian | Letaknya | Gunanya |
|--------|----------|---------|
| **Bola dunia** | seluruh layar | Bumi bisa **diputar** (tahan & geser) dan **dizoom** (roda mouse / cubit) |
| **Bilah atas** | paling atas | Nama aplikasi, **jam WIB**, dan 3 tombol |
| **Panel kategori** | kiri | Daftar kategori + saklar nyala/mati |
| **Panel informasi** | kanan | Muncul saat sebuah titik diklik |
| **Keterangan peta** | bawah | Sumber citra yang sedang dipakai |

### Tombol di bilah atas

| Tombol | Gunanya |
|--------|---------|
| 🌐 **Globe** | Ganti tampilan **bola dunia** ↔ **datar** |
| 🛰️ **Satelit** | Ganti tampilan **citra satelit** ↔ **peta jalan** |
| ☰ | Buka/tutup panel kategori (khusus di HP) |

---

### 2b. ☁️ AWAN — FOTO SATELIT REALISTIS & KEPEKATAN

1. **Nyalakan** kategori ☁️ Awan seperti biasa (klik barisnya di panel kiri).
2. **Klik tombol `⋯`** pada baris ☁️ Awan → muncul kartu penjelasan dan tombol
   **kepekatan**.
   *(Bisa juga dengan mengetuk peta di tempat kosong — tetapi tombol `⋯` lebih pasti.)*
3. Tampilan Awan selalu memakai **foto satelit asli dengan warna alami**.
   Awan tampak putih; **tidak ada peta awan berwarna merah**. Celah gelap di
   antara lintasan satelit kadang terlihat. Salju dan es juga dapat tampak putih.
4. **Klik salah satu kepekatan** — peta langsung berubah. Pilihan **diingat**,
   jadi tidak perlu diatur ulang tiap kali aplikasi dibuka.
   - **Tipis** = awan samar, peta di bawahnya paling jelas.
   - **Sedang** = tengah-tengah.
   - **Tebal** = awan paling jelas (bawaan).

> ℹ️ Foto satelit memperlihatkan **permukaan**, bukan hanya awan — jadi **salju
> dan es di kutub/gunung juga tampak putih**. Itu bukan kesalahan.
>
> ℹ️ Sekali-sekali satu bagian peta awan (atau suhu) bisa tampak **kosong**.
> Itu dari **server NASA**, yang kadang menolak satu permintaan lalu berhasil
> lagi. Geser sedikit petanya, nanti terisi sendiri.

---

## 3. 🔘 CARA MENYALAKAN KATEGORI

1. Lihat **panel kategori** di kiri.
2. **Klik** salah satu kategori (misalnya 🌊 Gempa Bumi).
3. Tunggu sebentar — di bawahnya muncul tulisan *"memuat…"*, lalu berubah jadi
   *"aktif"*.
4. Titik-titik data langsung muncul di atas peta.
5. **Klik lagi** kategori yang sama untuk mematikannya.
6. Tombol **"Matikan semua"** mematikan seluruh kategori sekaligus.

> 💡 Boleh menyalakan **beberapa kategori bersamaan** — misalnya 🔥 Kebakaran Hutan
> dan 💨 Angin sekaligus, supaya kelihatan arah angin di sekitar titik api.

Di kaki panel ada **ringkasan**: berapa titik yang sedang tampak, dan peringatan
kalau ada kejadian penting (misalnya gempa kuat).

### Tombol `⋯` — membuka pengaturan kategori

Di setiap baris kategori ada tombol kecil **`⋯`** (titik tiga) di sisi kanan,
sebelah saklar. Gunanya membuka **kartu pengaturan** kategori itu — tempat:

- **kunci AirLabs** dan **kotak pencarian penerbangan** (kategori ✈️ Penerbangan),
- pengatur **kepekatan awan** (kategori ☁️ Awan),
- keterangan sumber & keadaan (semua kategori).

Tombol ini **tidak** menyalakan/mematikan kategori; kalau kategorinya masih mati,
ia menyalakannya sekalian supaya kartunya bisa diisi. Untuk kategori yang tidak
punya pengaturan (gempa, kebakaran, gunung, angin), tombol itu menampilkan
**kartu keterangan** kategori tersebut — jadi **selalu ada isinya**.

---

## 4. 👆 CARA MELIHAT RINCIAN

1. **Klik** salah satu titik di peta.
2. Muncul **panel informasi** di kanan berisi rinciannya.
3. Tutup dengan tombol **×**, atau klik di tempat kosong.

Contoh isi rincian:

| Kategori | Yang ditampilkan |
|----------|------------------|
| 🌊 Gempa Bumi | Kekuatan (M), tempat, waktu, kedalaman, koordinat |
| 🔥 Kebakaran Hutan | Kekuatan api (MW), suhu, satelit, waktu deteksi, koordinat |
| 🌋 Gunung Vulkanik | Tingkat siaga, negara, jenis, ketinggian, letusan terakhir |
| 💨 Angin | Kecepatan, hembusan, arah datang, **bertiup ke mana**, koordinat |
| ✈️ Penerbangan | Nomor penerbangan, **maskapai**, jenis pesawat, **rute asal → tujuan**, arah, kecepatan, ketinggian, koordinat. Bila salah satu tidak dikirim sumbernya, ditulis **"—"** (bukan angka nol) |

> 💡 Kategori 🌧️ Hujan, 🌡️ Suhu, dan ☁️ Awan tidak bisa diklik satu-satu — bentuknya
> **lapisan gambar** menutupi peta (bukan titik), jadi rinciannya cukup dilihat dari
> warnanya. Keterangannya ada di bagian 5 di bawah.

---

## 4b. ✈️ PENERBANGAN — CARA PAKAI

Saat kategori ✈️ Penerbangan dinyalakan, panelnya berisi:

1. **Kotak isian kunci** — tempat menempelkan kunci AirLabs (cara mendapatkannya di
   bagian 5b). Kunci **disimpan di komputer Bapak sendiri** (di penyimpanan peramban),
   **tidak ditulis di dalam kode aplikasi**, jadi tidak bisa terbaca orang lain.
2. **Kotak cari penerbangan** — ketik nomor penerbangan, misalnya `GIA612`
   atau `SQ226`, lalu tekan **Cari**. Pesawat itu akan **disorot berwarna merah muda
   berdenyut** lengkap dengan tulisannya. Kosongkan kotak lalu klik **Lepas sorotan**
   untuk kembali normal.
3. **Daftar pesawat** — dua angka yang berbeda artinya:
   - **Pesawat di layar** = jumlah yang benar-benar kelihatan sekarang.
   - **Pesawat terambil** = jumlah yang diambil aplikasi (paling banyak 400).
   Kalau tertulis **400**, aplikasi memberi catatan: itu **batas** supaya peta tetap
   ringan. **Perbesar peta** (zoom ke wilayah yang lebih sempit) untuk melihat
   wilayah itu lebih lengkap.
4. **Tombol "Segarkan sekarang"** — memaksa mengambil data baru tanpa menunggu
   30 menit. Memakai **1 kueri**.
5. **Sisa jatah** — aplikasi **menghitung sendiri** (AirLabs tidak memberitahukannya).
   Karena itu tertulis *"perkiraan … (hitungan sendiri)"* — **bukan angka resmi**.
6. **Klik salah satu pesawat di peta** → muncul rinciannya (rute, maskapai, jenis,
   ketinggian, kecepatan, arah terbang). Kalau lupa membuka panelnya, tekan tombol
   **`⋯`** pada baris ✈️ Penerbangan — atau **klik di tempat kosong di peta**.
7. **Tombol "Hapus kunci"** — menghapus kunci dari peramban Bapak. Gunakan kalau
   mau menempel kunci lain, atau bila ada tulisan *"kunci tidak dikenali"*.

> 🛠️ **Kalau muncul tulisan "Kunci AirLabs tidak dikenali" atau
> "bentuknya salah":**
>
> 1. Buka `https://airlabs.co/account` → salin ulang kuncinya (**jangan** diketik
>    dari ingatan, pasti salah).
> 2. Tempel ke kotak isian (bentuk benar: **32 angka/huruf dengan 4 tanda hubung**,
>    contoh `a1b2c3d4-5e6f-7890-abcd-ef1234567890`).
> 3. Klik **Simpan & ambil data**.
>
> Kalau masih ditolak, tekan **Hapus kunci** lalu tempel ulang dari awal.
> Kunci Bapak berlaku sampai **7 November 2026**.

> ✅ **Sudah diuji 7 Okt 2026 dengan kunci sungguhan:** 317 pesawat tampak ·
> pencarian `AK378` berhasil menampilkan **KUL → DPS · AirAsia · A20N · 8.828 m ·
> 772 km/j** dan peta otomatis terbang ke pesawat itu.

> ℹ️ **Batas resmi paket gratis AirLabs:** **1.000 kueri/bulan · 2.500/jam ·
> 250/menit**. Aplikasi mengambil data **30 menit sekali**, jadi pemakaian biasa
> aman di dalam batas.

> ⚠️ **Kuota terbatas.** Kunci gratis AirLabs memberi **1.000 kueri per bulan**
> (batas resmi: 1.000/bulan · 2.500/jam · 250/menit). Aplikasi sudah dibuat hemat:
> ia hanya mengambil **30 menit sekali** (bukan terus-menerus), dan pencarian satu
> penerbangan memakai **1 kueri**. Kalau kuota habis, aplikasi akan bilang terus terang.

> ⚠️ **Jangan heran kalau kolom rute kadang kosong.** Tidak semua pesawat melaporkan
> rutenya; pesawat kecil atau penerbangan carter sering hanya memberi nomor pesawat.

---

## 5. 🌍 ARTI WARNA & ANIMASI

| Kategori | Artinya |
|----------|---------|
| 🌊 **Gempa** | Warna menurut kekuatan & umur. Gempa ≤24 jam memancarkan **gelombang mengembang**. Gempa kuat diberi label **M 5,5** ke atas |
| 🔥 **Kebakaran** | Titik **berkedip** seperti bara. Makin besar & makin merah = makin kuat apinya. Saat dizoom jauh, titik yang menumpuk digabung jadi satu |
| 🌋 **Gunung** | Bentuk **segitiga**. Oranye = meletus ≤5 tahun, kuning = ≤50 tahun, abu = lama. Gunung yang sedang erupsi mengeluarkan **asap/abu** |
| 💨 **Angin** | **Partikel mengalir** mengikuti arah angin. Biru = lemah, hijau/kuning = sedang, jingga/merah = kencang. **Panah** menunjukkan arah tiupan. Bila jatah harian Open-Meteo habis, aplikasi otomatis memakai **server cadangan** dan ringkasannya berkata *"sedang memakai server cadangan"* |
| ✈️ **Penerbangan** | Bentuk **pesawat kecil yang berputar mengikuti arah terbang**. Warna **kuning = terbang rendah (di bawah 3.000 m)**, **biru muda = terbang tinggi**. Yang sedang Bapak cari **berdenyut merah muda** + ada tulisan nomor & rutenya. **Klik** pesawat untuk melihat rute, maskapai, jenis, ketinggian, kecepatan, dan arah |
| 🌧️ **Hujan** | Lapisan warna di atas peta yang **bergerak seperti animasi cuaca** — maju lalu mundur, menunjukkan hujan 2 jam terakhir. **Warna biru = hujan ringan, hijau/kuning = sedang, merah = lebat.** Lalu-lintas warna: biru → hijau → kuning → jingga → merah |
| 🌡️ **Suhu Permukaan** | Warna **suhu permukaan daratan**, bukan suhu udara. Biru = dingin (kutub/gunung tinggi), kuning = hangat, merah = panas. ⚠️ **Laut tampak kosong** — itu benar, yang diukur hanya permukaan daratan. ⚠️ NASA **tidak menyediakan skala angkanya**, jadi aplikasi **tidak menuliskan derajat** — hanya warnanya. Itu lebih jujur daripada menebak |
| ☁️ **Awan** | Foto satelit asli dengan warna alami. Awan tampak putih (salju & es juga putih); celah gelap di antara lintasan satelit dapat terlihat. Tidak ada peta awan berwarna merah |
| ☁️ **Awan — kepekatan** | Bisa diatur: **Tipis / Sedang / Tebal** (tombol `⋯` pada baris ☁️ Awan). Pilihan kepekatan diingat aplikasi |

---

## 5b. 🔑 CARA MENDAPATKAN KUNCI AIRLABS (GRATIS) — UNTUK PENERBANGAN

Hanya perlu dilakukan **sekali**. Perkiraan waktu: **±5 menit**.

1. Buka **`https://airlabs.co/`** di peramban.
2. Klik **Sign up** (daftar) — cukup isi **email** dan **kata sandi**. Tidak perlu
   kartu bank, tidak perlu bayar. Gratis **1.000 kueri per bulan**.
3. Buka **kotak masuk email** Bapak, cari surat dari AirLabs, lalu klik tautan
   **verifikasi** di dalamnya.
4. Masuk (login) ke `airlabs.co`. Buka menu **Dashboard** / **API Keys**.
5. **Salin** deretan huruf-panjang yang muncul — itulah **kuncinya**
   (bentuknya seperti ini: `a1b2c3d4-5e6f-7890-abcd-ef1234567890`).
6. Buka aplikasi Peta Dunia → nyalakan **✈️ Penerbangan** → **tempel** kunci itu
   ke kotak isian → selesai. Kunci akan diingat, tidak perlu ditempel lagi.

> 🔒 **Kunci itu seperti kunci rumah** — jangan kirimkan ke sembarang orang,
> jangan difoto, jangan ditempel di berkas yang dibagikan. Cukup tempel di aplikasi.
> Kalau lupa atau bocor, di Dashboard AirLabs ada tombol untuk **membuat kunci baru**.

> 💡 Kalau kuota 1.000 habis, aplikasi akan bilang terus terang. Tunggu bulan
> berikutnya, atau buat kunci baru dengan email lain.

---

## 6. ⚠️ HAL YANG PERLU DIKETAHUI (jujur apa adanya)

1. **Data bukan karangan** — semuanya diambil dari lembaga resmi (USGS, NASA, GDACS,
   Wikidata, Open-Meteo, RainViewer, AirLabs). Kalau sumbernya sedang tidak bisa
   dihubungi, aplikasi menampilkan **gagal**, bukan data palsu.
2. **Titik api kebakaran = deteksi satelit**, bukan laporan petugas. Satelit bisa
   mendeteksi panas dari sumber lain (misalnya industri).
3. **Kapal laut & kereta** nanti hanya bisa menampilkan **Eropa Utara / Finlandia** —
   sumber gratis untuk seluruh dunia belum ada.
4. **Data tidak diperbarui tiap detik.** Gempa tiap 2 menit; kebakaran & angin tiap
   10 menit; gunung, suhu & awan tiap 15 menit; hujan & penerbangan tiap 30 menit.
   Satelitnya sendiri juga hanya melintas beberapa kali sehari.
5. **Suhu tidak menampilkan angka derajat**; lapisan Awan adalah foto, bukan angka
   persen. Keduanya ditampilkan tanpa mengarang nilai yang tidak diberikan sebagai
   data angka.
6. **Kategori Awan memakai foto satelit asli dengan warna alami.** Awan tampak
   putih; celah gelap di antara lintasan satelit dapat terlihat, dan salju/es juga
   tampak putih. Tidak ada pilihan peta awan berpalet merah. Kepekatan bisa diatur
   dengan tombol **Tipis / Sedang / Tebal** pada kartu `⋯` dan diingat aplikasi.
7. **Penerbangan butuh kunci gratis** (bagian 5b) dan kuotanya 1.000 kueri/bulan.
   Aplikasi mengambil data 30 menit sekali, jadi kuota aman untuk pemakaian biasa.
8. **Hujan bisa tampak kosong** di suatu wilayah — itu berarti memang **tidak ada
   hujan terdeteksi** di sana, bukan aplikasinya rusak. Radar hujan hanya mencakup
   wilayah yang terjangkau satelit/radar, dan laut lepas bisa tampak kosong.
9. **Pesawat yang datanya tidak lengkap ditulis "—"**, bukan angka 0. Contoh: bila
   AirLabs tidak mengirim kecepatan, kolom kecepatan berisi **"—"**. Aplikasi
   **tidak mengarang** angka (itu aturan keras proyek ini). Kolom rute juga sering
   kosong karena tidak semua pesawat melaporkan rutenya — itu wajar.
10. **Sekali-sekali satu bagian peta Suhu atau Awan bisa tampak kosong.** Itu dari
    **server NASA** (kadang menolak satu permintaan lalu berhasil lagi — terbukti
    dengan `curl`: alamat yang sama bisa menjawab **200 → 500 → 200**). Geser
    sedikit petanya, nanti terisi sendiri. **Bukan** kerusakan aplikasi.
11. **Angin bisa berbunyi "kehabisan jatah".** Sumber angin (Open-Meteo) membatasi
    jumlah permintaan **per hari**. Bila jatah habis, aplikasi **otomatis pindah ke
    server cadangan** dan tetap berjalan — ringkasannya berkata
    *"sedang memakai server cadangan"*. Kategori **tetap menyala** dan mencoba lagi
    sendiri. **Bukan** kerusakan aplikasi.
12. **"Animasi hilang" saat halaman ditinggalkan adalah wajar.** Browser
    **menghentikan gambar bergerak** pada halaman yang tidak sedang dilihat, supaya
    baterai dan tenaga hemat. Begitu halamannya **dibuka kembali**, animasi
    (gempa, angin, pesawat, gunung) langsung jalan lagi. Jadi bila Bapak melihat
    titik-titik "hilang", **cukup buka lagi halaman itu** — tidak perlu apa-apa
    lagi. (Yang tidak beranimasi — Suhu, Awan, Hujan — biasanya tetap tampak
    karena gambarnya diambil ulang oleh peta.)

---

## 7. 📂 APA SAJA ISI FOLDER INI?

| Nama | Untuk siapa | Isinya |
|------|-------------|--------|
| 📋 **CHANGELOG.md** | Bapak | Rekam semua kejadian: apa yang berubah, kapan |
| 📖 **panduan.md** | Bapak | Berkas yang sedang Anda baca |
| 🧩 **prompt.md** | Bapak / AI lain | Konsep proyek, supaya bisa dibangun ulang |
| 📖 **rencanakerja.md** | Bapak + AI | Papan rencana: apa yang sudah & belum |
| 🤖 **agents.md** | AI | Aturan main untuk AI |
| 🗂️ **app/** | — | Aplikasinya sendiri |
| 💾 **backups/** | Semua | Cadangan berkas, supaya tidak hilang |

---

## 8. 🔍 KALAU BAPAK MAU TAHU "SUDAH SAMPAI MANA?"

Buka **`rencanakerja.md`**. Di bagian paling atas ada **papan order**, yang isinya:

| Tanda | artinya |
|-------|---------|
| ✅ | **Sudah selesai** |
| ⬜ | **Belum** |
| 🔨 | **Sedang dikerjakan** |
| ⚠️ | **Ada masalah** |

Bisa juga langsung tanya AI: *"papan"* — lalu AI beri ringkasan singkat.

---

*Panduan ini dibuat 7 Oktober 2026 · status: 8 dari 10 kategori sudah jalan*

> 📌 **Catatan terakhir sesi (7 Okt 2026, sore):** saya memeriksa keluhan
> *"AirLabs: Unknown api_key"* — **penyebabnya kunci palsu sisa uji saya**, bukan
> kunci Bapak. Sudah dibersihkan, dan aplikasi kini **menolak lebih dulu** bila
> bentuk kunci salah (supaya tidak bingung lagi). Karena pembersihan itu, **kunci
> asli perlu Bapak tempel ulang sekali** (kunci masih berlaku sampai 7 Nov 2026).
> Selain itu ditambahkan **tombol `⋯`** pada tiap kategori supaya pengaturan
> kategori (kunci, pencarian penerbangan, kepekatan awan) **selalu bisa dibuka**.

---

## 7. 📱 MEMASANG DI HP — LEWAT GITHUB (cara yang dipilih Bapak)

> Tujuan: aplikasi bisa dibuka di **HP Android** cukup dengan **mengetuk satu
> tautan**, tanpa mengirim berkas dan tanpa server sendiri.
> Perkiraan waktu: **±15 menit**, sekali saja.

### 7.1 Kenapa cara ini, bukan kirim berkas

Kalau berkas dikirim ke HP lalu dibuka langsung (**file://**), dua hal ini terjadi:

1. Berkas **tidak boleh membaca berkas lain** di foldernya → jadi harus
   disatukan jadi satu berkas besar.
2. Penyimpanan pengaturan (kunci AirLabs, kepekatan awan) **tidak selalu
   diizinkan** → kunci bisa hilang tiap kali dibuka.

Dengan **GitHub** (lewat alamat `https://`), **kedua masalah itu hilang**:
berkas boleh saling memanggil seperti biasa, dan pengaturan **diingat**.

### 7.2 Langkah membuat (di PC)

1. Buka **`github.com`** → daftar/masuk (gratis).
2. Klik **`+`** (kanan atas) → **New repository**.
   - **Repository name:** `petadunia` (huruf kecil semua, tanpa spasi)
   - **Visibility:** **Public** *(wajib untuk akun gratis)*
   - Klik **Create repository**.
3. Di halaman repo → klik **Add file** → **Upload files**.
4. Buka folder **`C:\data\Peta dunia\app`** di komputer, lalu **seret seluruh
   isinya** (`index.html` + folder `css` + folder `js`) ke jendela unggah.
   ⚠️ Yang diseret **isi `app/`**, bukan foldernya. Folder `app` sendiri tidak
   perlu dibuat di GitHub.
5. Tulis catatan kecil di kotak **Commit message** (mis. `Peta Dunia`), lalu
   klik **Commit changes**.
6. Buka **Settings** repo → menu kiri **Pages**.
   - **Source:** *Deploy from a branch*
   - **Branch:** **`main`** · folder **`/ (root)`** → klik **Save**.
7. Tunggu **±1–2 menit**, lalu muat ulang halaman Settings → Pages. Alamat
   aplikasinya muncul, bentuknya:

   ```
   https://<nama-akun>.github.io/petadunia/
   ```

### 7.3 Memakai di HP

1. Di HP, buka tautan di atas dengan **Chrome** (mis. lewat WhatsApp ke diri
   sendiri, atau ketik sekali).
2. Menu Chrome (**⋮**) → **Add to Home screen** → beri nama **Peta Dunia**.
3. Buka dari ikon itu → langsung tampil. Tempelkan kunci AirLabs lewat tombol
   **`⋯`** pada baris ✈️ Penerbangan (**sekali saja**, sesudah itu diingat).

### 7.4 Kalau ada perubahan di kemudian hari

Unggah ulang berkas yang berubah (langkah 3–5). Halaman HP ikut berubah
**±1 menit** sesudahnya — tidak perlu mengirim apa pun ke HP, cukup buka ulang.

### 7.5 Hal yang perlu diketahui (jujur)

1. **Repo Public = kode bisa dilihat siapa pun.** Isinya peta + sumber data
   publik, jadi aman. **Kunci AirLabs tidak ikut** — kunci tetap hanya di
   peramban HP Bapak.
2. Halaman ini butuh **internet untuk dibuka** (datanya sendiri memang selalu
   butuh internet). Sifat "tanpa server" penuh hilang, tetapi yang didapat:
   **cukup satu tautan** untuk PC **dan** HP, tanpa mengirim berkas.
3. GitHub pernah menghentikan pemuatan saat lalu lintas terlalu besar. Untuk
   pemakaian pribadi ini **tidak akan** terjadi.
4. **Jalan cadangan** bila internet mati: simpan juga versi "satu berkas" dan
   buka lewat aplikasi **Files → Buka dengan Chrome** (cara Google Drive/manual
   sebelumnya).
