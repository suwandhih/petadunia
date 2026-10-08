# 📋 CHANGELOG.md — **PETA DUNIA**

> Rekam **semua kejadian** di aplikasi: apa yang berubah, kapan, dan kenapa.
> Ini untuk **Bapak** — supaya tahu riwayat aplikasi tanpa perlu technical.

---

## 8 Oktober 2026 — 📱 HP ANDROID & KEPUTUSAN MEMASANG LEWAT GITHUB

Bapak menanyakan: **apakah aplikasi ini bisa jalan di Chrome Android?** Lalu
Bapak memilih cara memasangnya: **GitHub Pages**.

### Yang diperiksa (bukan tebakan)

| Diperiksa | Hasil |
|-----------|-------|
| Chrome Android membuka alamat `file:///…` diketik di bilah alamat | ❌ tidak bisa |
| Chrome Android membuka berkas dari aplikasi **Files → Buka dengan Chrome** | ✅ bisa (bukti: ANodes) |
| Halaman `file://` membaca berkas lain di foldernya | ❌ **diblokir** → maka perlu versi **satu berkas** |
| Peker web MapLibre (memakai `blob:`) | ✅ berhasil (diuji) |
| WebGL (syarat globe 3D) | ✅ tersedia |
| Data JSON lokal yang perlu dibaca | ✅ **tidak ada** — semua data dari internet |
| Kunci API di dalam berkas | ✅ **tidak ada** (sisa hanya contoh karangan) |
| Alamat berkas di `index.html` | ✅ **semua relatif** → aman di alamat bercabang |
| git di PC | ✅ ada (2.54.0), sudah terkonfigurasi |

### Keputusan Bapak: GitHub Pages

Sebabnya: lewat `https://` (GitHub) masalah `file://` **hilang semua** — tidak
perlu versi satu berkas, dan **kunci AirLabs/pengaturan tidak pernah hilang**.
Cukup **satu tautan** untuk PC **dan** HP, tanpa mengirim berkas.

Cara memasangnya ditulis lengkap di **`panduan.md` bagian 7** (bahasa biasa).
Ringkasnya: buat repo **`petadunia`** (Public) → unggah berkas
**`unggah-ke-github.zip`** lewat *Add file → Upload files* (GitHub membuka
ZIP-nya sendiri) → Settings → Pages → branch `main`, folder `/ (root)` → tautan
jadi **`https://<nama-akun>.github.io/petadunia/app/index.html`**.

> **Sudah dikerjakan untuk butir ini (8 Okt 2026):** repositori Git disiapkan di
> **`C:\data\Peta dunia`** (`git init -b main`, commit awal `e964389`, 21 berkas
> = 6 dokumen + aplikasi di `app/`) · berkas **`.gitignore`** (agar `backups/`
> 104 MB & `catat/` 79 MB tidak ikut terunggah; keduanya **tetap utuh** di
> komputer) · berkas **`.nojekyll`** (agar GitHub tidak memproses berkas dengan
> Jekyll) · **`unggah-ke-github.zip`** (355 KB) untuk tombol *Upload files* ·
> backup sebelum git: `backups\github-20261008-1035\`.
> Diperiksa juga: alat login Git (**Git Credential Manager**) tersedia, jadi
> `git push` nanti akan meminta izin masuk lewat jendela peramban — **tidak perlu
> membuat kunci manual**.

> ⚠️ **Belum ada kode aplikasi yang diubah** untuk butir ini — halaman dibiarkan
> apa adanya supaya bisa disamakan dengan keadaan Git. Yang belum dibuat (menunggu
> perintah Bapak): versi "satu berkas" sebagai **jalan cadangan** bila internet
> mati, dan perbaikan ukuran tampilan HP (`100vh` → `dvh`, tombol `⋯` dari 20 px
> jadi ±44 px).

> ✅ **SUDAH TERPASANG & DIUJI (8 Okt 2026, ±12 menit).** Halaman hidup di
> **`https://suwandhih.github.io/petadunia/`**.
>
> | Uji | Hasil |
> |-----|-------|
> | Semua berkas aplikasi (13) | ✅ **HTTP 200** |
> | Data benar-benar masuk | ✅ **127 gempa tampak dari 311** |
> | Lapisan Awan (foto realistis) | ✅ terpasang |
> | Galat halaman | ✅ **0** |
>
> **Cara memasangnya (penting untuk diingat):** GitHub **hanya mau menerbitkan
> halaman dari branch kalau setelannya sudah pernah dinyalakan**, dan **GitHub
> Actions tidak boleh menyalakannya** (gagal dengan pesan *"Create Pages site
> failed. Error: Resource not accessible by integration"* — percobaan itu sudah
> dihapus). Yang **berhasil**: cabang **`gh-pages`** berisi `index.html` + `app/`
> → GitHub menyalakan Pages sendiri. Jadi:
>
> - cabang **`main`** = seluruh repo (aplikasi + dokumen) = sumber pembaruan;
> - cabang **`gh-pages`** = halaman yang dilayani ke pengunjung.
>
> **Kalau aplikasi diperbarui**, halaman **tidak berubah sendiri**; harus disalin:
> `git checkout gh-pages` → `git checkout main -- index.html app` →
> `git commit -am "perbarui halaman"` → `git push origin gh-pages` →
> `git checkout main`. (Sudah diuji: tanpa perubahan, hasilnya memang tidak ada
> perubahan — aman dijalankan kapan saja.)
>
> Backup tambahan sebelum bekerja di cabang: `backups\aman-gh-pages-20261008-1145\`.
> Berkas `unggah-ke-github.zip` sudah dihapus (tidak dipakai lagi — repo sudah
> terunggah).

**Catatan:** `rencanakerja.md` K20 (a–d) sudah dicatat; jawaban konsep Android
disimpan di `prompt.md` bagian 6.

---

## 8 Oktober 2026 — ☁️ AWAN KEMBALI KE FOTO SATELIT REALISTIS

Bapak mengingatkan bahwa tampilan awan berpalet merah membuat planet terlihat
merah, bukan seperti awan sebenarnya. Mode peta tutupan awan berwarna buatan
dihapus dari aplikasi.

- ☁️ Awan sekarang hanya memakai foto MODIS Terra asli dari NASA GIBS.
- Awan tampil dengan warna alami; tidak ada lagi tampilan awan berwarna merah.
- Pengatur kepekatan **Tipis / Sedang / Tebal** tetap tersedia dan tetap diingat.
- Pilihan jenis tampilan lama (`pd_awan_jenis`) dibersihkan ketika kategori
  Awan dinyalakan, agar pilihan "Rapi" yang lama tidak dapat mengaktifkan palet.
- Penanda versi `awan.js` dinaikkan supaya peramban memuat perubahan.

**Uji terarah:** sintaks JavaScript lulus; ubin foto membalas HTTP 200 dengan
`Access-Control-Allow-Origin: *`; kartu Awan menampilkan foto realistis tanpa
pilihan palet; pengatur kepekatan berfungsi. Tampilan PC dan HP diperiksa dengan
`getComputedStyle`; nilai uji `pd_awan_opasitas` dibersihkan sesudah pengujian.

**Backup:** `backups\awan-realistis-20261008-0948\`.

---

## 7 Oktober 2026 (lanjutan 3) — ☁️ AWAN: celah kosong di antara lintasan satelit

**Bapak bertanya:** *"apakah awan masih bisa perbaiki yg kosong2 seperti pasted
image"* — maksudnya **celah gelap miring** pada lapisan ☁️ Awan.

**Bapak memilih:** sediakan **dua-duanya** — foto satelit **dan** tombol
**"Rapi tanpa celah"**. Sudah selesai dan sudah diuji.

Perkiraan waktu pengerjaan: **±12 menit** (perkiraan saya di awal), kenyataannya
sesi meneliti dulu sekitar **±1 jam** — karena saya harus mengukur, bukan menebak.

### Cara memakainya (Bapak)

1. Nyalakan **☁️ Awan** seperti biasa.
2. Klik tombol **`⋯`** pada baris ☁️ Awan.
3. Sekarang ada **dua kelompok tombol**:
   - **Jenis tampilan:** **Foto satelit** (bawaan) · **Rapi tanpa celah**
   - **Kepekatan:** **Tipis · Sedang · Tebal**
4. Pilihan Bapak **diingat** — tidak perlu diatur ulang lain kali.

### Apa bedanya

| | **Foto satelit** (bawaan) | **Rapi tanpa celah** |
|---|---|---|
| Yang Bapak lihat | Foto asli — awan **putih alami** | Peta tutupan awan gabungan |
| Celah gelap | **Ada** (di antara lintasan satelit) | **Hampir tidak ada** (sisa 0–2%) |
| Warna | Warna asli | **Palsu** (ungu–biru–hijau–kuning–merah), sudah dilembutkan |

> 💡 **Saran:** pakai **Foto satelit** untuk melihat keadaan sebenarnya; pakai
> **Rapi tanpa celah** bila celah hitamnya mengganggu.

### Saya harus mengaku salah dua kali (penting, supaya Bapak tidak salah percaya)

**1. Saya pernah bilang peta tutupan awan "tanpa celah sama sekali" → itu SALAH.**
Setelah diperiksa lebih teliti (12 ubin berpasangan), ternyata peta tutupan awan
**punya celah yang sama** — cocok **97–100%** dengan hitamnya di foto.

**2. Saya pernah bilang "menumpuk beberapa lapisan bisa menambal celah" → itu
hanya benar untuk peta tutupan awan, TIDAK untuk foto.** Buktinya terukur:

| Susunan | Bagian gelap |
|----------|--------------|
| Foto: Terra saja | 49,2% |
| Foto: **Terra + Aqua** | **68,4%** ← makin gelap |
| Foto: **Terra + Aqua + SNPP** | **99,0%** ← makin gelap |
| Tutupan awan: 4 lapisan | **0,0%–2,4%** |

**Sebabnya sederhana:** foto satelit **tidak tembus pandang**, jadi lapisan di
atasnya **menutupi** yang di bawah — bukan menambal yang kosong. Sedangkan peta
tutupan awan **tembus pandang** di bagian yang tidak ada datanya, sehingga
lapisan berikutnya bisa mengisi.

**Sebab saya salah:** awalnya saya hanya melihat **1–2 ubin contoh**. Setelah
memeriksa **seluruh 256 ubin** satu tingkat zoom dan **4 tanggal berbeda**,
barulah gambarnya benar. Pelajaran itu sudah saya catat sebagai aturan baru
(**I19**) supaya tidak terulang.

### "Dulu katanya horor, sekarang kok dipakai?"

Betul — warnanya memang masih **menyala keras** (itu palet resmi NASA). Karena itu:

- Warnanya **dilembutkan** (kepekatan warna dikurangi sedang, **bukan**
  dihilangkan). Kalau dihilangkan sampai abu-abu, **tingkat awannya jadi tidak
  bisa dibedakan** — terbukti terukur: pada pengurangan kuat, **146 dari 5.050**
  pasangan warna jadi **kembar** (tingkat berbeda tampak sama).
- Sifatnya **pilihan** — Bapak **tidak dipaksa** memakainya. Bawaannya tetap
  **Foto satelit** yang alami.

### Yang tetap saya katakan jujur

1. Mode "Rapi" **bukan warna asli** awan.
2. Sisa celahnya **tidak nol sempurna** — **0–2%** (pada satu ubin terburuk 11,5%).
3. Celah pada mode "Foto" **tidak bisa dihilangkan** — itu batas datanya.
4. NASA GIBS kadang membalas **HTTP 500 acak** (bukan kerusakan aplikasi) —
   geser sedikit petanya, nanti terisi sendiri.

### Hasil uji

| Uji | Hasil |
|---|---|
| Ganti Foto → Rapi → Foto (3×) | ✅ lapisan selalu kembali, **0 galat** |
| Klik tombol jenis yang sama dua kali | ✅ aman, 0 galat |
| Kartu pengaturan ikut berganti isi | ✅ |
| 4× tukar gaya peta (Satelit ↔ Peta) | ✅ lapisan selalu kembali, **0 galat** |
| 8 kategori bersamaan | ✅ aktif = 8 |
| HP 390×844 + tombol ☰ | ✅ panel buka/tutup benar |

---

## 7 Oktober 2026 (lanjutan 2) — 💨 ANIMASI ANGIN HILANG: jatah harian Open-Meteo habis

**Bapak melaporkan:** kategori 💨 Angin sudah dinyalakan **tapi animasinya hilang**,
lalu 🔥 Kebakaran Hutan juga hilang.

### Apa yang sebenarnya terjadi

| Kategori | Sebab | Keadaan |
|----------|-------|---------|
| 💨 **Angin** | Server utama Open-Meteo membalas **"Daily API request limit exceeded"** — **jatah harian habis** (bukan gangguan sebentar) | **sudah diperbaiki** |
| 🔥 **Kebakaran** | **Tidak rusak.** Sumbernya (NASA GIBS + GDACS) sehat — diuji `curl`: **HTTP 200** | **tidak ada yang diperbaiki** |

**Kebakaran hilang karena alasan sederhana:** animasi di peta **dijeda browser**
ketika tab/halaman tidak sedang dilihat (`document.visibilityState = hidden`).
Terbukti saat diperiksa: halaman yang Bapak tinggalkan memang tidak terlihat, dan
di situ **tidak ada satu pun bingkai animasi** yang dijalankan. Begitu halamannya
dibuka kembali, kebakaran langsung tampil lagi (**6.408 titik api terlihat**).
Jadi **tidak ada yang rusak** — cukup buka lagi halaman itu.

### Sumber angin: jatah harian habis — dan cara menolongnya

Percobaan menolong dengan **membuka permintaan dari alamat internet berbeda
TIDAK berhasil**: jatah Open-Meteo dihitung **per jaringan (IP)**, bukan per alamat
web. Jadi memutar alamat halaman tidak menambah jatah.

Yang berhasil: **memakai server Open-Meteo yang lain** — datanya **sama**, hanya
alamatnya berbeda:

| Server | Keadaan 7 Okt 2026 |
|--------|--------------------|
| `api.open-meteo.com` (utama) | ❌ jatah harian habis (`429`) |
| **`historical-forecast-api.open-meteo.com`** (cadangan) | ✅ **200**, data lengkap 192 titik, waktu masih segar (12 menit) |

Karena itu aplikasi sekarang: **mencoba server utama dulu**, dan **otomatis pindah
ke server cadangan** bila jatah habis. Bila server utama sudah terbukti habis
**hari ini**, ia **tidak dihubungi lagi sampai besok** (supaya tidak memunculkan
galat 429 berulang).

Kepada Bapak hal ini **diberitahukan terus terang** di ringkasan:
*"Sumber utama Open-Meteo kehabisan jatah — sedang memakai server cadangan"*.

### ✅ Uji

| Uji | Hasil |
|-----|-------|
| Angin menyala | **139 titik ukur angin · tercepat 65 km/jam** |
| Animasi benar-benar bergerak | piksel berisi: 67.422 → 67.762 → 68.207 (berubah tiap detik) = **bergerak** |
| Setelah muat ulang | hanya server cadangan dihubungi: **2× HTTP 200**, **0 galat 429** |
| Kebakaran | **6.408 titik api** (sumber tidak pernah bermasalah) |

### 📁 Berkas yang berubah

| Berkas | Perubahan |
|--------|-----------|
| `app/js/lapisan/angin.js` | 13.293 → **15.936 byte**: server cadangan + catatan "jatah habis hari ini" + pesan jelas |
| `app/index.html` | `angin.js?v=20261007-5` |

**Backup:** `backups\angin-cadangan-20261007-200200\`

---

## 7 Oktober 2026 (lanjutan) — 🔧 MENCARI SEBAB "AirLabs: Unknown api_key" + TOMBOL PENGATURAN

**Bapak melaporkan:** kategori Penerbangan berbunyi **"AirLabs: Unknown api_key"**.

### Penyebabnya — kesalahan saya, Bapak tidak salah

Penyebabnya **bukan** kunci Bapak. Saat saya menguji, saya pernah menempelkan
**kunci palsu** (`uji-benar`) ke `localStorage` untuk menguji pesan galat — dan
kunci palsu itu **tertinggal di peramban**. AirLabs lalu menjawab
*"Unknown api_key"*, dan pesan itu ikut tersimpan sehingga tetap tampil
walaupun kunci yang benar sudah dipasang.

| Bukti | Hasil |
|-------|-------|
| Curl ke `ping` dengan kunci Bapak | tetap sah — `pong`, berlaku sampai **7 Nov 2026** |
| `localStorage` di halaman | `pd_airlabs_key` **tidak ada** pada saat itu → pesan lama |
| Sebab | kunci palsu `uji-benar` sisa uji saya |

**Kunci palsu sudah dibersihkan.** Kunci asli Bapak juga sempat terhapus saat
pembersihan itu — **mohon tempel ulang sekali**, kuncinya masih berlaku.

### Yang diperbaiki supaya tidak mudah salah lagi

| Perbaikan | Guna bagi Bapak |
|-----------|-----------------|
| **Validasi bentuk kunci** sebelum dikirim | salah tempel langsung diberi tahu, tidak menunggu jawaban server |
| **Pesan galat mudah dimengerti** | dulu *"AirLabs: Unknown api_key"* → sekarang *"Kunci AirLabs tidak dikenali — tempel ulang kuncinya"* |
| **Peringatan merah di kartu** | kunci yang gagal ditandai jelas, tidak perlu menebak |
| **Tombol "Hapus kunci"** | bisa mulai bersih tanpa membuka pengaturan peramban |
| **Contoh bentuk kunci pada kotak isian** | tahu bentuk benar (32 angka/huruf bertanda hubung). Contoh yang dipakai **karangan**, bukan kunci Bapak — kunci asli **tidak pernah** ditulis di kode/dokumen (aturan F12) |

> 🔒 **Kunci asli Bapak juga dibersihkan dari kode & dokumen** pada sesi ini: dulu
> ia sempat tertulis sebagai "contoh bentuk kunci" di `penerbangan.js`, `prompt.md`,
> `panduan.md`, dan `CHANGELOG.md`. Semua sudah diganti contoh **karangan**
> (`a1b2c3d4-5e6f-7890-abcd-ef1234567890`). Diperiksa dengan pencarian menyeluruh:
> **tidak ada lagi kunci asli di berkas proyek** — hanya di peramban Bapak.

### Angka "Pesawat di layar" kini tidak pernah karut

Dulu kartu bisa menulis **400** (jumlah yang diambil) sedangkan ringkasan
menulis **387** (yang benar-benar tampak). Sekarang keduanya menghitung dengan
syarat yang **sama persis** dengan gambar di peta → selalu sama.

### 🐞 Bug ketiga pada Penerbangan: angka 0 karangan

Ditemukan saat uji: kartu pesawat `AK9988` menulis **"Kecepatan 0 km/j"**
padahal AirLabs memang **tidak mengirim** data kecepatan untuk pesawat itu.
Sebabnya `Number(null)` bernilai **0** di JavaScript — jadi "tidak ada data"
berubah menjadi angka 0. Sudah diperbaiki: data kosong kini ditulis **"—"**.
Angka 0 tidak lagi dipakai untuk mewakili "tidak tahu".

### 🖱️ Tombol ⋯ pada setiap kategori (kemudahan baru)

Kartu pengaturan kategori (tempat kunci AirLabs, kotak pencarian penerbangan,
dan pengatur kepekatan awan) **dulu hanya bisa dibuka dengan mengetuk peta** —
dan ketukan itu **diperebutkan 8 kategori**, sehingga sering muncul kartu
kategori lain. Karena itu tiap kategori kini punya tombol **⋯** di barisnya.

### ℹ️ Catatan penting tentang NASA GIBS (bukan kerusakan)

Saat uji, NASA GIBS **kadang** membalas **HTTP 500 secara acak**. Dibuktikan
dengan curl: URL yang **sama** bisa menjawab `200 → 500 → 200`. Jadi bila
satu bagian peta Suhu atau Awan tampak kosong sekali-sekali, itu **dari server
NASA**, bukan aplikasi. Ubin akan terisi sendiri saat peta digeser ulang.

### 🐞 Bug keempat (kategori Angin) — ditemukan saat uji akhir

Saat menguji bergantian, Open-Meteo membalas **HTTP 429** (batas laju: permintaan
terlalu sering). Akibatnya kategori **💨 Angin gagal dinyalakan** dan yang
tertinggal hanya tulisan **"data angin kosong"** — Bapak tidak akan tahu sebabnya.

| Perbaikan | Guna bagi Bapak |
|-----------|-----------------|
| Kegagalan **sementara** tidak lagi menggagalkan kategori | Angin tetap **menyala** dan mencoba lagi pada penjadwalan berikutnya |
| Pesan jelas: *"Open-Meteo membatasi permintaan — coba lagi sebentar lagi"* | tahu penyebabnya, tidak menyangka aplikasinya rusak |
| Saat belum ada data, ringkasan berkata apa adanya | tidak lagi "diam tanpa sebab" |
| Tombol Segarkan melaporkan hasilnya | tahu apakah data berhasil diperbarui |

### 🗂️ Tombol `⋯` selalu menghasilkan sesuatu

Untuk kategori yang **tidak punya pengaturan** (gempa, kebakaran, gunung, angin),
tombol `⋯` dulu membuka kartu **hanya bila** ketukan tepat mengenai satu titik data.
Sekarang, bila tidak ada titik di situ, ditampilkan **kartu keterangan** kategori
(sumber, keadaan, cara melihat rincian) — jadi tombol itu **tidak pernah kosong**.

### 📁 Berkas yang berubah

| Berkas | Perubahan |
|--------|-----------|
| `app/js/lapisan/penerbangan.js` | 18.421 → **22.085 byte** (validasi kunci, pesan jelas, Hapus kunci, `hitungDiLayar()` memakai syarat sama dengan animasi, bug angka 0) |
| `app/js/lapisan/suhu.js` | 3.382 → **3.962 byte** (uji ulang 3× karena 500 acak NASA) |
| `app/js/lapisan/awan.js` | 4.921 → **5.424 byte** (uji ulang 3× karena 500 acak NASA) |
| `app/js/lapisan/angin.js` | Open-Meteo 429 **tidak lagi menggagalkan kategori**; pesan jelas; ringkasan jujur saat belum ada data — 11.402 → **13.293 byte** |
| `app/js/lapisan/angin.js` | + **server cadangan** `historical-forecast-api.open-meteo.com` + catatan `pd_angin_utama_lelah` + pesan "kehabisan jatah" — 13.293 → **15.936 byte** |
| `app/js/inti.js` | + tombol **⋯** tiap kategori (membuka kartu pengaturan; ada kartu keterangan bila kategori tak punya pengaturan) — 14.718 → **15.428 byte** |
| `app/css/gaya.css` | + gaya tombol **⋯** (`.tombol-kartu`) — 8.542 byte |
| `app/index.html` | `inti.js?v=20261007-2` · `alat.js?v=20261007-8` · `gaya.css?v=20261007-2` · `angin.js?v=20261007-5` · `penerbangan.js?v=20261007-13` · `suhu.js?v=20261007-3` · `awan.js?v=20261007-5` |

**Backup:** `backups\akhir-sesi-kunci-titik-tiga-20261007-190500\`

### ✅ Uji akhir sesi

| Uji | Hasil |
|-----|-------|
| 8 kategori bersamaan | **8 aktif · 15 baris ringkasan** |
| Tukar gaya peta 4× | lapisan Awan, Hujan, Suhu **tetap ada**, **0 galat halaman** |
| Kartu vs ringkasan Penerbangan | **386 = 386** (sama) |
| Pencarian penerbangan nyata (`AK9988`) | berhasil — maskapai AK · A320 · 11.907 m · en-route |
| Tombol ⋯ | 8 tombol, **8 kartu terbuka** (di HP 390×844 juga), pengatur kepekatan awan 3 tombol |
| Kunci: salah → benar → siklus mati/nyala | pesan jelas, tidak nyangkut |
| Sisa galat | hanya **HTTP 500 acak NASA GIBS** (galat server, bukan aplikasi) |

---

## 7 Oktober 2026 — 🏁 SESI BESAR: 4 KATEGORI BARU + RAPIKAN DOKUMEN

**Bapak memesan:** rapikan dokumen → kerjakan sisa butir K17 → uji PC + HP.

### Ringkas

| Hal | Hasil |
|-----|-------|
| Kategori aplikasi | **4 → 8** (semua bisa dinyalakan bersamaan, **0 galat**) |
| Butir K17 | **6 dari 13 → 11 dari 13** selesai (sisa: 🚢 Kapal laut & 🚆 Kereta) |
| Dokumen | dirapikan & difokuskan ke Peta Dunia (tidak lagi tercampur folder `catat/`) |

### Yang sudah selesai & sudah diuji

- ✅ **🌧️ Hujan** — radar hujan **RainViewer** beranimasi maju-mundur seperti
  animasi cuaca. Animasi 30 detik = **0 permintaan jaringan baru** (hemat).
- ✅ **✈️ Penerbangan** — **AirLabs**, pesawat bergerak mengikuti arah terbang,
  ada kolom **rute (asal → tujuan)**, maskapai, jenis pesawat, kecepatan,
  ketinggian. Ada **kotak cari penerbangan** (mis. ketik `GIA612`) yang menyorot
  pesawat itu berdenyut merah muda.
- ✅ **🌡️ Suhu Permukaan** — lapisan warna suhu daratan dari **NASA GIBS WMTS**.
- ✅ **☁️ Awan** — lapisan warna tutupan awan dari **NASA GIBS WMTS**.
- ✅ **Uji PC** — 8 kategori dinyalakan **bersamaan** → stabil, 0 galat.
- ✅ **Uji HP** — layar sempit (390 × 844) → panel, tombol, dan sentuhan lolos.
- ✅ **Dokumen dirapikan** — `agents.md`, `prompt.md`, `panduan.md`,
  `rencanakerja.md`, `catatanAI.md`, `CHANGELOG.md` semuanya isi **Peta Dunia**
  (isi dari folder `catat/` tidak dipakai).

**Bukti uji akhir (halaman baru, 7 Okt 2026):** 8 kategori aktif bersamaan ·
3 lapisan ubin tetap terpasang setelah **4× tukar gaya peta** · **0 galat halaman**
· **0 galat sumber daya**. Keadaan tiap kategori dilaporkan apa adanya:
gempa 129 tampak dari 309 · kebakaran 4.343 titik api · gunung 6 erupsi (1 MERAH) ·
angin 138 titik ukur (67 km/jam) · hujan citra ke-4 dari 13 ·
**penerbangan 317 pesawat di layar dari 400 terambil** · suhu & awan siap.

### ✈️ Uji Penerbangan dengan KUNCI SUNGGUHAN (berhasil)

Bapak menyerahkan kunci AirLabs pada 7 Okt 2026. Kunci diuji tanpa ditulis ke
berkas mana pun (hanya di `localStorage` peramban):

| Uji | Hasil |
|-----|-------|
| Kunci sahih? | ✅ `ping` menjawab `pong` — paket **free**, batas **1.000/bulan · 2.500/jam · 250/menit**, berlaku s/d **7 Nov 2026** |
| CORS | ✅ `access-control-allow-origin: *` |
| Data terambil | ✅ **400 pesawat** (dibatasi dari 3.252 yang ada di bbox luas) |
| Tampil di peta | ✅ **317 pesawat terlihat** bergerak, 0 galat |
| Cari penerbangan | ✅ `AK378` → **rute KUL → DPS · maskapai AK (AirAsia) · A20N · 8.828 m · 772 km/j · arah 178°**, peta otomatis terbang ke pesawat |
| Klik pesawat | ✅ membuka rute, maskapai, jenis, ketinggian, kecepatan, arah, status |

### 🔧 Perbaikan lanjutan setelah kunci sungguhan dipakai

1. **Label menyesatkan diperbaiki.** Dulu tertulis "Pesawat tampak" padahal
   angkanya jumlah yang **dimuat** (sampai 400), bukan yang benar-benar terlihat
   di layar. Sekarang dipisah: **"Pesawat di layar"** (yang benar-benar tampak)
   dan **"Pesawat terambil"**.
2. **Pemberitahuan batas 400 pesawat** ditambahkan, supaya Bapak tidak mengira
   peta kehilangan data — cukup **perbesar peta** untuk wilayah lebih sempit.
3. **Tombol "Segarkan sekarang"** ditambahkan (dulu komentar kode menyebut adanya
   tombol ini, padahal belum ada — komentar dan kenyataan sekarang **sama**).
4. **Perkiraan sisa jatah** ditampilkan. AirLabs **tidak** mengirim sisa jatah,
   jadi aplikasi **menghitung sendiri** (1 kueri per permintaan, diingat per bulan
   di `pd_airlabs_hitung`) dan **mengatakannya apa adanya**: tertulis
   *"perkiraan … (hitungan sendiri)"*. Bukan angka resmi AirLabs.
5. **Indentasi seluruh berkas dirapikan** (dulu berantakan dari edit bertumpuk) —
   sudah dibuktikan lewat diff "abaikan spasi" bahwa **tidak ada arti kode yang
   berubah**.

### ⚠️ Hal penting yang perlu Bapak tahu

1. **Penerbangan perlu kunci AirLabs** — ✅ **sudah diuji dengan kunci sungguhan
   pada 7 Okt 2026 dan berhasil.** Kunci gratis 1.000 kueri/bulan. Kunci
   **tidak ditulis di kode** — Bapak menempelkannya sendiri di kotak pada panel
   kategori; aplikasi menyimpannya di komputer Bapak. Cara mendapatkannya ada di
   **`panduan.md` bagian 5b** (±5 menit).
   **Batas resmi paket free AirLabs** (dibaca dari endpoint `ping`):
   **1.000 kueri/bulan · 2.500/jam · 250/menit**, berlaku sampai **7 Nov 2026**.
2. **Suhu & Awan tidak menampilkan angka derajat/persen.** NASA selaku sumbernya
   **tidak menerbitkan skala warna resminya**, jadi aplikasi hanya menampilkan
   warnanya — lebih jujur daripada menebak angka.
3. **Sisa 2 kategori:** 🚢 Kapal laut & 🚆 Kereta. Keduanya hanya terjangkau
   **Eropa Utara / Finlandia** (sumber gratis seluruh dunia belum ada).

### 🔍 Penyelidikan panjang: mencari sumber pesawat

Sebelum memakai AirLabs, **9 sumber posisi pesawat diuji satu per satu** — dan
**semuanya gagal** karena tidak punya header CORS:

| Sumber | Hasil uji |
|--------|-----------|
| **OpenSky Network** | ❌ Kirim `ACAO: https://opensky-network.org` — **bukan `*`** → diblokir |
| `api.adsb.lol`, `opendata.adsb.fi` | ❌ JSON 200 OK tapi **tanpa header CORS sama sekali** |
| `api.airplanes.live`, `api.adsb.one` | ❌ tanpa header CORS |
| `globe.adsb.fi`, `globe.adsb.one`, `globe.adsb.lol`, `globe.adsbexchange.com` | ❌ tanpa header CORS |
| `globe.airplanes.live/re-api/` | ❌ CORS `*` **dan** data lengkap, tetapi **wajib header `Referer`** → dari `file://` mati |
| **AirLabs** (berkunci) | ✅ **CORS `*`** → dipakai |

**Kesimpulan penting:** **tidak ada satu pun sumber posisi pesawat gratis tanpa
kunci yang punya CORS.** Karena itu AirLabs (berkunci, gratis 1.000 kueri/bulan)
yang dipakai. Pembanding lain yang punya CORS tapi kuotanya kecil: Aviationstack
(100 kueri/bulan), FlightLabs (uji 7 hari), ADSBExchange lewat RapidAPI.

**Temuan yang menyelamatkan waktu berikutnya:** **browser uji otomatis TIDAK
menegakkan CORS** — ia berhasil membaca `adsb.lol` dan `opendata.adsb.fi` yang
`curl` buktikan tanpa header CORS. Jadi mulai sekarang **hanya `curl` yang
dipercaya** untuk soal CORS.

### 🐞 Tiga bug MapLibre yang ditemukan & diperbaiki

1. **Kategori mati tanpa pesan** — MapLibre mogok   (`Cannot read properties of undefined (reading 'bind')`) karena sumber ubin
   dibuang saat gambarnya masih di udara. **Perbaikan:** jangan buang sumbernya,
   cukup dibikin tembus pandang (`opacity: 0`).
2. **15 galat tiap tukar gaya peta** (Globe ↔ Satelit) saat kategori ubin aktif.
   **Perbaikan:** lepas lapisan **tepat sebelum** `setStyle`, bukan sesudahnya.
   Diuji bertiga: tanpa lapisan **0** galat · dengan lapisan **15** galat ·
   lepas-dulu **0** galat.
3. **Gaya peta tidak bisa dibandingkan** lewat `getStyle()` (mengembalikan objek
   baru tiap panggilan) → dibandingkan pakai identitas objek `PD.peta.style`.

**Hasil akhir: tukar gaya peta 4 kali → lapisan selalu kembali terlihat, 0 galat.**

### 🐞 Dua bug tersembunyi pada kategori Penerbangan (ditemukan saat uji akhir)

Keduanya **sangat berbahaya** sebab **tidak menampilkan pesan apa pun** —
kategori tampak "diam" saja:

1. **Penjaga "sedang bekerja" tidak pernah dilepas.** Fungsi pengambil data
   memakai `return` **di dalam** blok `try`, sehingga baris `sedangAmbil = false`
   **dilewati**. Akibatnya: **satu kegagalan saja** (mis. kunci salah atau jatah
   habis) membuat pengambilan berikutnya **tidak pernah dijalankan lagi selama
   sisa sesi** — kunci yang benar pun tidak akan menolong. **Perbaikan:** pelepasan
   penjaga dipindah ke blok **`finally`**.
2. **Panggilan ke internet tanpa batas waktu.** Bila AirLabs **menggantung**
   (tidak menjawab sama sekali), bug 1 membuat kategori terkunci **selamanya** dan
   pengguna **tidak pernah mendapat kabar**. **Perbaikan:** `PD.alat.ambil()`
   sekarang memasang **batas waktu 20 detik** dan melaporkan
   *"AirLabs tidak menjawab (waktu habis)"* — jujur, bukan diam.

**Bukti uji:** setelah kegagalan disuntikkan, pengambilan berikutnya **tetap
dijalankan** (sebelumnya terhenti); pencarian `GIA612` mengembalikan
**rute CGK → UPG · maskapai GA · B738 · 10.668 m · 830 km/j · 95°**, dan pencarian
yang gagal (`XXX999`) **tidak** mengunci pencarian berikutnya.

### ☁️ Kategori Awan diperbaiki — dulu "horor", sekarang tampak alami

**Keluhan Bapak:** kategori ☁️ Awan "agak horor" (menyeramkan).

**Penyebabnya ditemukan (diperiksa langsung):** kategori Awan memakai peta warna
resmi NASA `MODIS_Terra_Cloud_Fraction_Day`. Setelah ubinnya **dibongkar dan
dihitung piksel demi piksel**, ternyata paletnya memakai:

- **MERAH MENYALA `rgb(255,0,5)` untuk 46% piksel** (warna terbanyak!)
- **UNGU `rgb(102,0,119)`** — 14% piksel
- biru tua, hijau, kuning, jingga untuk sisanya

Ukuran "kejenuhan warna" (seberapa nyala warnanya): **99% — hampir maksimum.**
Jadi di atas citra satelit tampak seperti peta bahaya yang mengerikan.

**Perbaikan:** diganti dengan **FOTO ASLI satelit**
(`MODIS_Terra_CorrectedReflectance_TrueColor`, tingkat 9). Awan kini terlihat
**putih alami**, persis seperti mata melihatnya.

| Ukuran warna | Sebelum (peta warna NASA) | Sesudah (foto asli) |
|---|---|---|
| **Kejenuhan warna** | **99%** (menyala maksimum) | **18%** (tenang) |
| Kecerahan | 40% | 47% |
| Piksel putih bersih (awan) | **0%** | **17%** |

Tambahan: **kepekatan awan bisa diatur Bapak** sendiri —
tombol **Tipis / Sedang / Tebal** (klik kategori ☁️ Awan). Pilihannya **diingat**,
jadi tidak perlu diatur ulang tiap kali. Sedikit sentuhan **kontras +0,15** dan
**warna −0,15** membuat awan lebih tegas tanpa menutupi peta di bawahnya.

**Bukti uji:** 8 kategori serentak · 4× tukar gaya peta · pengaturan kepekatan
**tetap bertahan** setelah ganti gaya peta maupun setelah dimatikan-dinyalakan ·
**0 galat halaman · 0 galat sumber daya**.

### 📁 Berkas yang berubah

| Berkas | Perubahan |
|--------|-----------|
| `app/js/lapisan/alat.js` | 9.070 → **13.298 byte** (+ `A.lapisan()`, alat lapisan ubin tahan ganti gaya, + batas waktu 20 detik) |
| `app/js/lapisan/hujan.js` | **BARU** — 7.379 byte |
| `app/js/lapisan/penerbangan.js` | **BARU** — 16.559 → **18.421 byte** (lihat perbaikan lanjutan di atas) |
| `app/js/lapisan/suhu.js` | **BARU** — 3.382 byte |
| `app/js/lapisan/awan.js` | **BARU** — 3.100 → **4.921 byte** (ganti sumber ke foto asli + tombol kepekatan Tipis/Sedang/Tebal) |
| `app/js/lapisan/alat.js` | + `opasitas()` & sifat warna `paint` (agar kepekatan awan bisa diatur & tetap bertahan saat ganti gaya) — 13.298 → 14.238 byte |
| `app/css/gaya.css` | + gaya kotak isian & tombol (`.info-kotak`, `.info-tombol`) — 8.148 byte |
| `app/index.html` | + 4 berkas kategori baru · `penerbangan.js?v=20261007-7` · `alat.js?v=20261007-7` · `awan.js?v=20261007-2` |

**Ditemukan & diperbaiki saat uji akhir** (lihat bagian bug di atas):
`app/js/lapisan/penerbangan.js` (pelepasan penjaga → `finally`, pesan waktu habis)
dan `app/js/lapisan/alat.js` (batas waktu 20 detik pada `A.ambil`).

**Backup:** `backups\rapi-dokumen-20261007-141259\` ·
`backups\k17f-penerbangan-20261007-144032\` ·
`backups\akhir-sesi-k17-20261007-162844\` (sebelum perbaikan bug) ·
`backups\akhir-sesi-k17-perbaikan-bug-20261007-170000\` (sesudah perbaikan bug) ·
`backups\akhir-sesi-k17-kunci-nyata-20261007-174500\` (sesudah uji kunci sungguhan) ·
`backups\awan-foto-satelit-20261007-181000\` (sesudah perbaikan kategori Awan)

📄 Berkas: `rencanakerja.md` (catatan akhir sesi), `prompt.md` (tabel sumber data
+ daftar sumber gagal), `agents.md` (aturan baru F11–F13 & pelajaran I1–I7),
`panduan.md` (cara pakai 4 kategori baru + cara mengambil kunci AirLabs)

---

## 6 Oktober 2026 — 🏁 PENUTUP SESI (lanjut besok)

**Bapak menghentikan pekerjaan untuk hari ini.** Sisa pekerjaan sudah dicatat
lengkap di `rencanakerja.md` (tabel **SISA PEKERJAAN K17**).

**Keadaan aplikasi saat itu (6 Oktober) — 4 kategori sudah jalan & sudah diuji:**

| Kategori | Sumber data | Cakupan |
|----------|-------------|---------|
| 🌊 Gempa Bumi | USGS | Seluruh dunia |
| 🔥 Kebakaran Hutan | NASA GIBS WMS + GDACS | Seluruh dunia |
| 🌋 Gunung Vulkanik | Wikidata + GDACS | Seluruh dunia |
| 💨 Angin | Open-Meteo | Seluruh dunia |

**Sudah selesai:** 6 dari 13 butir (a, b1, c, d, e, i).
**Sisa 7 butir:** Penerbangan, Kapal laut, Kereta, Hujan, Suhu, Awan, Uji PC+HP.

**Cara membuka aplikasi:** klik dua kali `app/index.html` — langsung jalan dari
berkas, tanpa perlu server.

**Tiga pelajaran penting hari ini:**

1. Sumber data **wajib** punya header CORS. Kebakaran & Gunung sempat tidak bisa
   dinyalakan karena memakai sumber tanpa CORS.
2. **Jangan** percaya hasil uji browser otomatis soal CORS — browser uji bisa
   longgar sehingga sumber yang diblokir tampak "berhasil".
3. Titik di **balik globe** harus disembunyikan, kalau tidak tampak seperti
   titik nyasar di sisi depan.

📄 Berkas: `rencanakerja.md` (sisa pekerjaan), `prompt.md` (konsep + aturan CORS)

---


## 6 Oktober 2026 — 💨 KATEGORI ANGIN + ANIMASI PARTIKEL

**Permintaan Bapak:** penyebaran kebakaran hutan sangat dipengaruhi arah angin,
jadi arah angin didahulukan.

**Yang sudah selesai dan sudah diuji:**

- ✅ **Kategori Angin** — arah & kecepatan angin permukaan dari **Open-Meteo**,
  **seluruh dunia**, tanpa kunci API.
- ✅ **Animasi partikel mengalir** — ribuan partikel bergerak mengikuti arah angin,
  meninggalkan jejak yang memudar. Warna menurut kecepatan:
  biru (lemah) → hijau → kuning → jingga → merah (badai).
- ✅ **Panah di tiap titik ukur** menunjukkan arah tiupan.
- ✅ **Klik titik angin** → kecepatan, hembusan, arah datang, **bertiup ke mana**,
  koordinat.
- ✅ **Ikut peta**: saat peta digeser/dizoom, data angin diambil ulang untuk
  wilayah yang terlihat.

**Bukti uji nyata:**

- **110 titik ukur** termuat, tercepat **35 km/jam**
- Klik berhasil → *3,4 km/jam (lemah), dari Tenggara (148°), bertiup ke Barat Laut*
- Partikel terbukti **bergerak** (piksel kanvas berubah antar bingkai)
- **Angin + Kebakaran jalan bersamaan** — jadi arah angin bisa dibaca
  berdampingan dengan titik api

**Catatan teknis:**

- Open-Meteo sanggup **300 titik sekaligus** dalam 1,5 detik (116 KB).
  Aplikasi memakai 192 titik (16×12) agar ringan.
- Saat uji awal, saya sempat salah membaca galat "jumlah latitude dan longitude
  tidak sama" — ternyata itu **salah cara uji saya** (pemisah desimal Indonesia
  bercampur dengan pemisah daftar), bukan salah API.

📄 Berkas baru: `app/js/lapisan/angin.js`

---


## 6 Oktober 2026 — 🔧 PERBAIKAN CORS: KEBAKARAN & GUNUNG BISA DINYALAKAN

**Laporan Bapak:** kategori Kebakaran Hutan dan Gunung Vulkanik tidak bisa
diaktifkan sehingga tidak tampil di peta.

**Penyebab sebenarnya (bukan salah Bapak):**

Aplikasi ini dibuka langsung dari berkas (`file://`). Browser **memblokir** data
dari situs yang tidak mengirim izin bernama `Access-Control-Allow-Origin` (CORS).

| Sumber lama | Punya izin CORS? | Akibat |
|---|---|---|
| USGS (gempa) | ✅ ada | jalan |
| GDACS (erupsi) | ✅ ada | jalan |
| **NASA FIRMS (kebakaran)** | ❌ **tidak ada** | **diblokir** |
| **Smithsonian GVP (gunung)** | ❌ **tidak ada** | **diblokir** |

**Kenapa saya tidak melihatnya lebih dulu:** browser uji saya ternyata **longgar**
soal CORS — sumber yang diblokir tampak "berhasil". Saya sudah membuktikannya
(browser uji saya bisa membuka `example.com` yang seharusnya diblokir).
Ini kesalahan cara uji saya, dan sudah saya catat sebagai aturan baru di
`prompt.md` bagian 3.4.

**Perbaikan yang dilakukan:**

- 🔥 **Kebakaran** → ganti ke **NASA GIBS WMS** (punya CORS) yang menyajikan
  citra titik api satelit VIIRS. Titik api dibaca dari piksel citra.
  Ditambah **GDACS** untuk kebakaran besar yang punya nama.
- 🌋 **Gunung** → ganti ke **Wikidata** (punya CORS) untuk daftar gunung api,
  tetap ditambah **GDACS** untuk erupsi terkini.

**Bukti uji setelah perbaikan:**

- Kebakaran: **4.536 titik api terlihat**; klik berhasil → titik api di
  Kalimantan (-2,41 / 116,65), citra tanggal hari ini
- Gunung: **3.139 gunung api** termuat; **175 gunung api tampak** saat dizoom;
  klik Semeru → *🔴 MERAH, gunung api strato, 3.676 m*
- Tiga kategori bersamaan, **tanpa galat dan tanpa permintaan gagal**
- Pemuatan gunung dipercepat dari **77 detik → 9 detik** (erupsi tampil dulu,
  daftar gunung menyusul di latar belakang)

📄 Berkas diubah: `app/js/lapisan/kebakaran.js`, `app/js/lapisan/gunung.js`,
`prompt.md` (aturan CORS baru)

---


## 6 Oktober 2026 — 🌋 KATEGORI GUNUNG VULKANIK

**Dua sumber digabung: daftar semua gunung api + erupsi terkini.**

**Yang sudah selesai dan sudah diuji:**

- ✅ **Kategori Gunung Vulkanik** — **1.214 gunung api** Holosen dari
  **Smithsonian GVP** (101 di antaranya di Indonesia), plus **13 erupsi terkini**
  dari **GDACS** dengan tingkat siaga.
- ✅ **Animasi**: gunung api tampil sebagai **segitiga**; warna menurut kebaruan
  letusan (oranye = ≤5 tahun, kuning = ≤50 tahun, abu = lama).
  Gunung yang sedang erupsi memancarkan **asap/abu naik lalu memudar**,
  dengan **denyut cahaya**; status MERAH dapat **cincin mengembang**.
- ✅ **Klik** → rincian: tingkat siaga, negara, jenis, ketinggian, letusan terakhir,
  wilayah, koordinat.
- ✅ **Simpanan sementara**: server GVP lambat (±44 detik). Data disimpan di
  peramban, jadi pemuatan berikutnya **3 detik** saja.

**Bukti uji nyata:**

- 6 erupsi terkini, **1 berstatus MERAH** (Semeru, Indonesia)
- Dizoom ke Indonesia: **63 gunung api tampak**
- Klik Semeru → *Stratovolcano, 3.657 m, letusan terakhir 2026, Sunda-Banda*
- Klik erupsi Semeru → *🔴 MERAH — bahaya tinggi, sumber DARWIN*
- Tiga kategori (gunung + kebakaran + gempa) jalan bersamaan tanpa galat

**Perbaikan yang ditemukan saat uji:**

- `propertyName` pada permintaan GVP **menghapus geometri**, jadi koordinat harus
  dibaca dari properti `Latitude`/`Longitude`. Sebelum diperbaiki: 0 gunung termuat.
- Penanda erupsi bertumpuk dengan gunungnya, sehingga klik menampilkan kartu
  gunung. Diperbaiki: **erupsi diprioritaskan** saat diklik.

**Catatan jujur:**

- GDACS hanya memuat **erupsi besar**. Letusan kecil tidak muncul di sana.
- Tingkat siaga GDACS berasal dari lembaga pemantau (mis. DARWIN), bukan dari
  aplikasi ini.

📄 Berkas baru: `app/js/lapisan/gunung.js`

---


## 6 Oktober 2026 — 🔥 KATEGORI KEBAKARAN HUTAN

**Data titik api satelit asli, seluruh dunia, tanpa kunci API.**

Bapak minta animasi kebakaran yang bagus. Sumber terbaik (NASA FIRMS) awalnya
tampak terkunci. Setelah diuji teliti, ternyata **berkas CSV titik api global
FIRMS bisa dibaca langsung dari browser** — tanpa kunci API sama sekali.

**Yang sudah selesai dan sudah diuji:**

- ✅ **Kategori Kebakaran Hutan** — **13.068 titik api** 24 jam terakhir dari
  satelit **MODIS** (NASA FIRMS), seluruh dunia.
- ✅ **Animasi**: tiap titik api **berkedip** seperti bara, ukuran & warna
  menurut **kekuatan api (FRP)**. Titik api sangat kuat memancarkan
  **gelombang mengembang**.
- ✅ **Penggabungan otomatis**: saat zoom jauh, titik yang menumpuk digabung
  jadi satu bara lebih besar supaya layar tidak penuh. Saat zoom dekat,
  tiap titik api tampil sendiri.
- ✅ **Klik titik api** → keluar rincian: kekuatan (MW), suhu kecerahan,
  satelit mana, keyakinan, waktu deteksi, siang/malam, koordinat.

**Bukti uji nyata:**

- 5.919 titik api terlihat saat tampilan dunia; **521 di antaranya sangat kuat (FRP ≥ 60 MW)**
- Saat dizoom ke Indonesia: 1.840 titik api terlihat, 152 sangat kuat
- Klik berhasil → *FRP 9,4 MW, MODIS Terra, koordinat 1,0270 / 110,8154 (Kalimantan Barat)*
- Dua kategori (kebakaran + gempa) jalan bersamaan tanpa galat

**Catatan jujur:**

- Titik api ini **deteksi satelit**, bukan laporan resmi petugas. Satelit bisa
  mendeteksi panas dari sumber lain (misalnya industri). Ini sifat asli datanya.
- Data diperbarui **sekali per 10 menit** (bukan tiap detik) karena berkasnya
  besar (987 KB) dan satelitnya sendiri hanya melintas beberapa kali sehari.

📄 Berkas baru: `app/js/lapisan/kebakaran.js`

---

## 6 Oktober 2026 — 🌍 APLIKASI BARU: PETA DUNIA REAL-TIME

**Dimulai aplikasi baru `Peta Dunia`** (kategori K17 di papan order).

Bapak minta: peta dunia realistis, data **real-time dari satelit**, dikelompokkan
**per kategori** yang bisa dipilih, dengan **animasi yang bagus** untuk kebakaran,
cuaca, penerbangan, dan kapal laut.

**Yang sudah selesai dan sudah diuji:**

- ✅ **Peta dasar realistis** — Bumi berbentuk **globe 3D** + **citra satelit** (Esri),
  bisa diputar, dizoom, diganti ke tampilan peta jalan.
- ✅ **Kategori Gempa Bumi** — data **USGS** M≥2,5 tujuh hari.
  Animasi **gelombang mengembang** + klik titik → keluar rincian.
  Uji nyata: 286 gempa termuat, **123 tampak di sisi globe yang menghadap kita**,
  klik berhasil membuka *Gempa M 4,3 di Urakawa, Jepang, kedalaman 71 km*.
- ✅ **Panel kategori** — nyala/mati per kategori, tombol "matikan semua",
  ringkasan status, dan keterangan peta.

**Perbaikan penting yang ditemukan saat uji:**

- Titik di **balik bola dunia** tetap punya koordinat, jadi ikut tergambar (tampak
  seperti titik nyasar). Diperbaiki pakai pemeriksaan sisi globe milik MapLibre.
  Sebelum diperbaiki: **0 dari 286** tampak. Sesudah: **123 dari 286** tampak.

**Catatan jujur tentang ketersediaan data gratis:**

- Gempa, gunung, kebakaran, cuaca, penerbangan, citra satelit → **seluruh dunia**.
- Kapal laut & kereta → sumber gratis hanya **Eropa Utara (Finlandia)**.
  Seluruh dunia butuh layanan berbayar. Ini akan dilaporkan lagi saat tahap g–h.

📄 Berkas: `app/` (index.html, css/gaya.css, js/inti.js, js/lapisan/) · `prompt.md` bagian 3.

---


## 30 September 2026 — 🏁 INISIALISASI PROYEK

**Dasar (fondasi) proyek dibuat dari nol.**

- Folder `C:\data\Peta dunia` disiapkan.
- Backup 5 dokumen salinan lama → `backups\salinan-anodes-20260930-121306`.
- 5 dokumen emptied (isi lama dibuang), lalu diisi sesuai aturan proyek.
- Dibuat `agents.md` = **aturan main AI** (versi 1).
- Dibuat `rencanakerja.md` = **papan order**; kasus pertama: **K01 Data wilayah Indonesia lengkap**.
- Dibuat `prompt.md` = **konsep proyek** (bisa dibangun ulang tanpa AI).
- Dibuat `panduan.md` & `catatanAI.md`.
- ⚠️ **Belum ada aplikasi.** Yang ada sekarang baru **dokumen dasar**.

---
