# 🤖 agents.md — ATURAN MAIN PROYEK **PETA DUNIA**

> Lokasi: `C:\data\Peta dunia` · dibuat 7 Oktober 2026 · versi 1
> 📌 **BERKAS INI = ATURAN MAIN AI.** Baca ulang berkas ini **setiap kali sesi dimulai**.
> 🔴 **Isi berkas ini HANYA ATURAN.** Riwayat panjang ❌ TIDAK BOLEH di sini → taruh di `CHANGELOG.md`.

---

## 🔴 4 ATURAN PALING PENTING (ingat ini dulu, selalu)

> ⚡ **1. JANGAN mulai apa pun tanpa aba-aba dari Bapak.**
> ⚡ **2. BACA ULANG seluruh berkas ini SETIAP SESI** — bukan asumsi, bukan "mungkin".
> ⚡ **3. JANGAN sentuh proyek ANodes** (`C:\data\ANodes`). Proyek ini **berdiri sendiri**.
> ⚡ **4. JANGAN tinggalkan sampah di script.** → lihat bagian **G**.

---

## 📚 DAFTAR BERKAS PROYEK

| Berkas | Untuk siapa | Isi |
|--------|-------------|-----|
| **`agents.md`** (akar) | AI | **Hanya aturan** yang harus diingat & dipatuhi setiap sesi |
| **`rencanakerja.md`** (akar) | AI + manusia | **Papan order**: rencana · ide · revisi · catatan. ✅ selesai · ⬜ jadi tugas AI |
| **`prompt.md`** (akar) | manusia / AI lain | **Konsep** proyek — supaya bisa dilanjutkan / **dibangun ulang dari nol tanpa AI** |
| **`panduan.md`** (akar) | manusia | **Cara pakai sistem** — bahasa **biasa, bukan teknis** |
| **`CHANGELOG.md`** | manusia | Rekam **semua kejadian** di aplikasi (apa berubah, kapan, kenapa) |
| **`catatanAI.md`** | AI | **Tempat sementara** script/kode yang perlu disimpan tapi belum dipakai → bagian **G** |
| **`app/`** | — | Aplikasi Peta Dunia: `index.html`, `css/`, `js/inti.js`, `js/lapisan/`, `js/lib/` |
| **`backups/`** | semua | Cadangan berkas sebelum setiap perubahan penting |
| **`catat/`** | — | **Arsip lama** — bukan dokumen aktif, hanya cadangan |

⚠️ **Tidak boleh ada file sampah.** Jelas mana yang dipakai, mana yang tidak.
⚠️ **Tidak boleh ada isi duplikat** di dua tempat — satu isi satu tempat.

---

## A. Aturan tentang BERKAS

| # | Aturan |
|---|--------|
| **A1** | Proyek wajib punya 5 dokumen di atas. Tidak boleh kurang. |
| **A2** | `agents.md` = hanya aturan. |
| **A3** | **`agents.md` tidak boleh ditumbuhi riwayat.** Kalau memanjang → aturan tenggelam & tidak dipatuhi. |
| **A4** | `rencanakerja.md` = papan order. Sudah dikerjakan → **✅**. Masih proses → **tugas AI atas arahan Bapak**. |
| **A5** | `prompt.md` = konsep, supaya proyek **bisa dilanjutkan ATAU dibangun ulang seluruhnya** tanpa AI ini. |
| **A6** | `CHANGELOG.md` = merekam semua kejadian. |
| **A7** | `panduan.md` = panduan manusia, **bahasa biasa, bukan teknis**. |
| **A8** | Tidak boleh ada file sampah. |
| **A9** | Tidak boleh ada isi duplikat. |

---

## B. Aturan tentang CARA KERJA AI

| # | Aturan |
|---|--------|
| **B1** | Baca `agents.md` dulu setiap mulai sesi. |
| **B2** | **Jangan mulai apa pun tanpa aba-aba Bapak.** |
| **B3** | **Order dicatat dulu di `rencanakerja.md`** (butir per butir, status ⬜), **baru dikerjakan SATU PER SATU**. |
| **B4** | Order banyak → dicatat semua dulu, dikerjakan **satu butir per giliran**: selesai → uji → lapor → lanjut. |
| **B5** | **WAJIB beri perkiraan waktu** sebelum mulai ("±3 menit"). Lebih lama → **kabari**, jangan diam. |
| **B6** | **Tampilkan posisi "n dari m"** untuk pekerjaan besar. |
| **B7** | **Fitur baru = tahap dulu** (a, b, c…) → Bapak bilang "proses" → baru dikerjakan. |
| **B8** | **Perbaikan error = langsung kerjakan**, tetap backup dulu. |
| **B9** | Kalau ragu understanding permintaan → **TANYA dulu**, jangan menebak. |
| **B10** | "Rapikan / harusnya sama seperti…" = **perbaiki TINGKAT SETARA**, ❌ bukan menghapus. Permintaan sama ke-2× → **berhenti menambal**, baca ulang. |
| **B11** | **Tiap selesai satu butir → lapor ke Bapak** sebelum lanjut butir berikutnya. |

---

## C. Aturan tentang UJI / DEBUGGING ⏱️

> *"Saya tidak mau menunggu lama tanpa kejelasan."*

| # | Aturan |
|---|--------|
| **C1** | **WAJIB uji sendiri dulu** sebelum minta Bapak tes. |
| **C2** | **Uji HANYA pada bagian yang direvisi** — ❌ bukan seluruh aplikasi. |
| **C3** | **Uji penuh ❌ TIDAK dijalankan tanpa izin Bapak** — sebut perkiraan waktunya dulu. |
| **C4** | Uji hanya blok yang berhubungan dengan revisi. |
| **C5** | **Uji bermasalah & lama → jangan ulangi cara yang sama.** Ganti pendekatan atau hentikan. |
| **C6** | **Lapor** selalu menyebut: blok uji mana + hasilnya ("K17-01…K17-12: 12 uji, 0 gagal"). |
| **C7** | **Uji tampilan pakai `getComputedStyle`**, bukan sekadar "elemennya ada". |
| **C8** | **Uji PC + HP.** Kalau revisi menyentuh tampilan → uji di **keduanya**. |

---

## D. Aturan tentang DOKUMEN

| # | Aturan |
|---|--------|
| **D1** | **❌ Jangan update dokumen di tengah perbaikan.** |
| **D2** | **Update dokumen SEKALI setelah masalah benar-benar selesai** (akhir sesi). |
| **D3** | Aturan/putusan baru → catat **sekali**, bukan berulang. |
| **D4** | **Satu hal hanya boleh muncul di satu tabel** di papan order. |
| **D5** | Papan order **selalu disortir** (yang paling atas = dikerjakan dulu). |

---

## E. Aturan KEAMANAN DATA

| # | Aturan |
|---|--------|
| **E1** | **Backup dulu** sebelum setiap perubahan penting → folder `backups/`. |
| **E2** | **TIDAK PERNAH** menghapus data secara destructive. Perlu hapus → bertahap + backup. |
| **E3** | **Data yang diisi Bapak sendiri = inti aplikasi** → tidak boleh hilang saat ada perubahan. |
| **E4** | **TIDAK PERNAH** cascade delete. Selalu `UPDATE ... WHERE`. |

---

## F. Aturan PROYEK INI (khusus Peta Dunia)

| # | Aturan |
|---|--------|
| **F1** | Nama proyek persis: **Peta Dunia**. UI = **globe 3D + citra satelit + data real-time**. |
| **F2** | **HARUS jalan di PC (70%) dan HP Android (30%)** — dua-duanya. |
| **F3** | Karena harus jalan di HP ⇒ **tidak boleh bergantung pada server**. Harus bisa dibuka langsung dari berkas (`file://`). |
| **F4** | Data disusun **per kategori** (gempa, kebakaran, gunung, angin, hujan, suhu, awan, penerbangan, kapal, kereta). Tiap kategori bisa dinyalakan/dimatikan sendiri. |
| **F5** | **Satu kategori = satu berkas** di `app/js/lapisan/`. Ditambah/dimatikan tanpa mengganggu yang lain. |
| **F6** | 🔴 **Setiap sumber data baru WAJIB diuji header CORS-nya lebih dulu** — `curl -D - -H "Origin: null" <url>` → cari `access-control-allow-origin`. **Jangan** percaya hasil uji browser otomatis. Rincian di `prompt.md` bagian 4. |
| **F7** | 🔴 **JANGAN menyentuh `C:\data\ANodes`.** Proyek ini **dibangun dari nol**, tidak bergantung ANodes. |
| **F8** | 🔴 **Data TIDAK boleh dikarang / ditulis dari ingatan.** Harus **diambil dari sumber yang dipercaya**. Kalau sumber tidak tersedia → **tanya Bapak**, jangan mengarang. |
| **F9** | **Titik di balik globe harus disembunyikan** — pakai `PD.tampak(lon,lat)` / `PD.layar(lon,lat)`, kalau tidak tampak seperti titik nyasar. |
| **F10** | **MapLibre GL JS disimpan lokal** di `app/js/lib/` — aplikasi tidak bergantung CDN. |
| **F11** | 🔴 **Kategori yang butuh lapisan ubin raster WAJIB memakai `PD.alat.lapisan()`** di `app/js/lapisan/alat.js` — jangan menulis MapLibre langsung. Semua jebakan MapLibre (bagian I) sudah diselesaikan di sana. |
| **F12** | 🔴 **Kunci API tidak pernah ditulis di dalam kode.** Kode hanya menyediakan **kotak isian**; kunci disimpan di `localStorage` (mis. `pd_airlabs_key`) dan ditempelkan Bapak sendiri. |
| **F13** | 🔴 **Sumber data yang sudah terbukti gagal CORS dicatat** di `prompt.md` bagian 2.2 (daftar "sudah dicoba & gagal") supaya **tidak diuji ulang** oleh AI berikutnya. |
| **F14** | 🔴 **Sebelum memakai lapisan peta/ubin baru dari NASA (atau sumber sejenis), WAJIB memeriksa warnanya lebih dulu**: unduh satu ubin, baca chunk `PLTE`/`tRNS`, hitung warna yang paling banyak dipakai. Bila paletnya menyala keras (mis. merah/ungu menyala), **coba dulu foto aslinya** (`..._CorrectedReflectance_TrueColor`). Kesan "horor" pada pengguna = cacat, bukan selera. |
| **F15** | 🔴 **Lapisan foto (opak) tidak boleh menutupi peta dasar.** Pakai opasitas sedang, dan **sediakan pengatur kepekatan** (Tipis/Sedang/Tebal) yang **diingat** di `localStorage`. |
| **F16** | 🔴 **Setelah menguji, WAJIB membersihkan `localStorage` yang dipakai uji** (`pd_airlabs_key`, `pd_awan_opasitas`, dsb). Kunci/nilai **palsu sisa uji pernah tertinggal di peramban Bapak** dan membuat kategori Penerbangan berbunyi *"Unknown api_key"* — Bapak jadi mengira kuncinya yang rusak. |
| **F17** | 🔴 **Nilai yang datang dari sumber wajib diperiksa "ada isinya atau tidak" — jangan percaya `Number(x)`.** Di JavaScript `Number(null)` = **0**, sehingga data kosong berubah jadi angka 0 karangan (mis. *"Kecepatan 0 km/j"*). Pakai pemeriksa khusus `keAngka()`, dan tampilkan **"—"** bila tidak ada data. |
| **F18** | 🔴 **Pesan galat harus bisa dimengerti Bapak, bukan pesan teknis server.** Contoh: `AirLabs: Unknown api_key` ⇒ *"Kunci AirLabs tidak dikenali — tempel ulang kuncinya"*. Bila yang salah **bentuk** masukan, periksa bentuknya **lebih dulu** dan hentikan sebelum dikirim ke server. |
| **F19** | 🔴 **Kartu pengaturan kategori harus punya jalan masuk yang PASTI**, jangan hanya mengandalkan klik peta — klik peta **diperebutkan seluruh kategori yang aktif** (yang pertama menang). Tombol **`⋯`** pada baris kategori dipakai untuk itu, dan bila kategori tidak punya pengaturan, tombol itu menampilkan **kartu keterangan** (jangan biarkan tombol tidak menghasilkan apa pun). |
| **F20** | 🔴 **Kegagalan SEMENTARA sumber data (HTTP 429 batas laju, 500 sesaat, waktu habis) TIDAK boleh menggagalkan kategori.** Biarkan kategori tetap menyala, **katakan sebabnya dengan bahasa biasa**, dan coba lagi nanti. Melempar galat dari `muat()` untuk hal sementara membuat kategori mati dengan pesan menyesatkan seperti *"data kosong"* (lihat pelajaran I16). |
| **F21** | 🔴 **Setiap sumber data yang punya jatah/batas laju sebaiknya punya ALAMAT CADANGAN yang setara** (contoh: Open-Meteo → `historical-forecast-api.open-meteo.com`). Coba yang utama dulu, pindah ke cadangan bila habis, dan **beri tahu Bapak** bahwa sedang memakai cadangan. ⚠️ Membuka permintaan dari alamat internet berbeda **tidak** menambah jatah — jatah dihitung **per jaringan/IP**. |
| **F22** | 🔴 **"Animasi hilang" belum tentu bug.** Browser **menjeda `requestAnimationFrame`** pada halaman yang tidak terlihat (`document.visibilityState === 'hidden'`). Sebelum menyalahkan kode, periksa dulu: (a) `visibilityState` halaman, (b) apakah fungsi `gambar()` benar-benar dipanggil, (c) keadaaan sumber datanya dengan `curl`. Terbukti 7 Okt 2026: halaman yang ditinggalkan Bapak tidak terlihat → **0 bingkai** dijalankan → kategori animasi "hilang". |
| **F23** | 🔴 **Lapisan foto satelit bersifat OPAK — menumpuk beberapa foto TIDAK bisa menambal celahnya.** Lapisan atas menutupi lapisan bawah, bukan mengisi bagian yang kosong. Terukur 7 Okt 2026 (10 ubin bercelah): Terra 49,2% gelap → Terra+Aqua 68,4% → Terra+Aqua+SNPP **99,0%** — makin ditumpuk makin gelap. **Yang bisa ditambal hanya PNG berkanal alfa** (mis. peta tutupan awan `*_Cloud_Fraction_*`): di situ "tembus pandang" = tidak ada data, sehingga lapisan berikutnya mengisinya. Sebelum menjanjikan "celah bisa ditutup", **periksa dulu apakah ubinnya punya kanal alfa** — jangan mengandalkan penglihatan. |
| **F24** | 🔴 **Jangan menghapus warna palet dengan `raster-saturation: -1`.** Palet NASA memakai **warna** untuk membedakan tingkat (ungu → biru → hijau → kuning → merah), bukan kecerahan. Terukur 7 Okt 2026 pada palet `MODIS_Cloud_Fraction`: pada `-0,85` sudah muncul **9 pasang warna kembar**, `-0,5` → 28, dan `-1` → **146 dari 5.050 pasangan** — artinya tingkat yang berbeda tampak sama. Pakai pengurangan **sedang (± -0,4 s/d -0,5)** supaya "horor" berkurang tapi tingkatnya masih terbaca. |

---

## G. 🗑️ ATURAN SAMPAH DI SCRIPT

> *"Jika ada revisi/perbaikan, **tidak meninggalkan sampah pada script**. Jika ada script
> yang perlu disimpan, buatkan file baru `catatanAI.md` — jadi script AI bisa ditempatkan
> pada file itu **untuk sementara**."*

| # | Aturan | Pelaksanaan |
|---|--------|-----------|
| **H1** | ❌ **DILARANG** meninggalkan kode lama di script dengan alasan *"supaya bisa revert"* | Kode tak terpakai **harus dihapus** dari script |
| **H2** | Kalau memang perlu disimpan | **Pindahkan ke `catatanAI.md`** — buat berkasnya kalau belum ada |
| **H3** | Fitur dihapus permanen | Arsipkan ke `backups/` — ❌ jangan tinggalkan di script utama |
| **H4** | Hapus harus **menyeluruh** | Kode + gaya + uji + catatan dokumen yang menyebutnya ikut dibersihkan |
| **H5** | Catatan dokumen yang **bertentangan** dengan keadaan nyata | Wajib dibersihkan |

⚠️ **Kenapa:** kode tak terpakai yang tertinggal di script ⇒ AI berikutnya akan **meniru**-nya ⇒
sistem makin lama makin rusak tanpa disadari.

---

## H. Aturan PAPAN ORDER (`rencanakerja.md` bagian 0)

Tanda: ✅ selesai · 🔨 sedang · ⬜ belum · ⚠️ bermasalah · ⏳ antre · 🟡 perlu diperdalam ·
⚪ belum diputuskan · ⏸️ ditahan · ❌ dibuang

| Tabel | Isi |
|-------|-----|
| **A. KASUS BELUM SELESAI** | per kasus + butir ✅/⬜ + tanggal |
| **B. ANTREAN KERJA** | sudah disetujui, belum mulai, **bersortir** |
| **C. IDE** | 🟡 perlu diperdalam · ⏸️ ditahan · ❌ dibuang |
| **D. SELESAI** | arsip + tanggal, terbaru di atas |

1. Selesai satu **butir** → ✅ + **tanggal**.
2. Butir **terakhir** ✅ → kasusnya dipindah ke **D. SELESAI**.
3. **Ide disetujui** → pindah ke **B**, barisnya **dihapus dari C**.
4. **Dibatalkan** → pindah ke ❌ dibuang + alasan.
5. **Satu hal hanya boleh muncul di satu tabel.**

Perintah Bapak: `papan` · `kerjakan X` · `tunda X` · `buang X` · `selesai X`

---

## I. 🧠 PELAJARAN TEKNIS WAJIB (mahal didapat — jangan diulang)

Pelajaran ini didapat dari bug nyata **7 Oktober 2026** dan semuanya **sudah
diselesaikan** di `PD.alat.lapisan()`. Kategori baru **wajib** memakai alat itu
(aturan **F11**).

| # | Jebakan | Akibat kalau dilanggar | Perbaikan |
|---|---------|------------------------|-----------|
| **I1** | Membuang sumber ubin saat gambarnya masih di udara | MapLibre mogok: `Cannot read properties of undefined (reading 'bind')` dari `renderLayer()` — kategori jadi mati | **Jangan buang sumbernya** — cukup `setPaintProperty(..., 'raster-opacity', 0)`. Ganti alamat ubin pakai `setTiles()` |
| **I2** | Ganti gaya peta (`setStyle`) saat sumber tambahan aktif | **15 galat** yang sama seperti I1, berulang tiap tukar gaya | **Lepas lapisan TEPAT SEBELUM `setStyle`** (bukan sesudahnya), lewat kait yang membungkus `setStyle`, + jaring pengaman pada peristiwa `styledata`. Diuji: tanpa lapisan 0 galat · dengan lapisan 15 galat · lepas-dulu **0 galat** |
| **I3** | Membandingkan gaya peta pakai `PD.peta.getStyle()` | Perbandingan **selalu salah** — `getStyle()` mengembalikan **objek BARU** tiap panggilan | Bandingkan **identitas objek** `PD.peta.style` (`sebelum !== sesudah`) |
| **I4** | Menambah sumber sebelum gaya selesai dimuat | Sumber **terhapus diam-diam** begitu gaya selesai dimuat | Tunggu `isStyleLoaded()` benar-benar `true` |
| **I5** | Menganggap `isStyleLoaded()` pasti `true` | Bisa **`false` berkepanjangan** bila konteks WebGL halaman jenuh (halaman uji lama + sering tukar gaya) | **Coba berulang** sampai ±60 detik (240 × 250 ms), jangan menyerah sekali coba |
| **I6** | Mengandalkan pesan galat di layar | Galat di dalam `gambar()` dan `muat()` **ditelan diam-diam** oleh inti (`catch (e) { /* lewati */ }`) → bug tampak seperti "tidak terjadi apa-apa" | Setiap kategori **wajib melaporkan sendiri** kegagalannya lewat `PD.setStatus()` / `PD.ringkas()` |
| **I7** | Menambah permintaan ubin tanpa memikirkan batas sumber | Sumber kena HTTP 429 (mis. RainViewer: **500 permintaan / 60 detik** per IP) | Ubin **512 px** alih-alih 256 px (resolusi ganda, jumlah permintaan sama), batasi `maxzoom`, dan **jangan** minta ubin baru tiap bingkai |
| **I8** | Memakai `return` **di dalam** `try` pada fungsi yang memasang penjaga "sedang bekerja" | Baris pelepasan penjaga (`sedangAmbil = false`) **dilewati** → **satu kegagalan saja mengunci kategori SELAMANYA**, tanpa pesan apa pun. Terbukti: setelah AirLabs menjawab galat, pengambilan berikutnya tidak pernah dijalankan lagi | Pasang pelepasan penjaga di blok **`finally`**, bukan di ujung `try`. Jangan `return` di dalam `try` |
| **I9** | `fetch` tanpa batas waktu | Bila sumber **menggantung** (tidak menjawab sama sekali), penjaga di I8 tetap terkunci dan pengguna **tidak pernah mendapat kabar** — kategori tampak "diam" selamanya | `PD.alat.ambil()` sudah memasang **batas waktu 20 detik** (`AbortController`) dan melempar `HTTP 408 batas waktu`. Kategori baru **jangan** memanggil `fetch` langsung — pakai `A.ambil` |
| **I10** | Memilih lapisan peta NASA langsung dari daftar tanpa memeriksa warnanya | Bisa dapat palet yang **menyala keras** (mis. tutupan awan: **merah `rgb(255,0,5)` 46% + ungu 14%**, kejenuhan **99%**) → di atas citra satelit tampak **"horor"** seperti peta bahaya | Unduh **satu ubin**, baca chunk **`PLTE`/`tRNS`** PNG-nya, dan **hitung warna mana yang paling banyak dipakai**. Untuk citra "biasa", **coba dulu `..._CorrectedReflectance_TrueColor`** (foto asli) — kejenuhan hanya **18%**. **Jangan menebak dari penglihatan saja** (aturan F6/F8) |
| **I11** | Lapisan **foto** (opak 100%) dipasang dengan opasitas tinggi | **Menutupi** peta dasar — 97% piksel berubah, peta jalan/satelit tidak terbaca lagi | Pakai **opasitas sedang** (mis. 0,72), dan **sediakan pengatur kepekatan** supaya Bapak bisa memilih (Tipis/Sedang/Tebal). Pilihan disimpan di `localStorage` |
| **I12** | Sifat warna (`raster-contrast`, `raster-saturation`) dipasang sekali saat lapisan dibuat | Sifat itu **hilang** begitu lapisan dipasang ulang **setelah ganti gaya peta** (kategori jadi tampak beda tanpa sebab) | Berikan lewat opsi **`paint: {...}`** pada `A.lapisan()`, atau panggil ulang sesudah `buat()`. `A.lapisan()` sudah mengurus ini |
| **I13** | Menyimpan **kunci/nilai palsu** ke `localStorage` saat menguji, lalu **tidak dibersihkan** | **Tinggal di peramban Bapak.** Kategori Penerbangan berbunyi *"AirLabs: Unknown api_key"*, Bapak mengira kuncinya rusak dan mencarinya berjam-jam — padahal sebabnya sisa uji kita sendiri | Sesudah uji **selalu** bersihkan `localStorage.removeItem('pd_airlabs_key')` dsb. Bila Bapak melaporkan galat aneh, **periksa isi `localStorage` lebih dulu** — bukti `curl` ke server menentukan kunci asli masih sah atau tidak |
| **I14** | Menghitung jumlah titik yang tampak dengan `PD.layar()` **saja** | Hasilnya **berbeda** dari jumlah yang benar-benar digambar, sebab animasi **juga** menyaring titik di luar tepi layar (`x < -40 … > innerWidth + 40`). Kartu menulis **400**, ringkasan menulis **387** — Bapak wajar curiga | Satu perhitungan untuk semua: pakai **syarat yang sama persis** dengan fungsi gambar (lihat `hitungDiLayar()` di `penerbangan.js`). **Angka di kartu dan di ringkasan WAJIB sama** |
| **I15** | Memperbaiki ubin yang gagal dengan **`source.setTiles()`** di tengah jalan | **Menghidupkan ulang bugs I1** — `Cannot read properties of undefined (reading 'bind')` **muncul kembali** (terbukti: 2 galat halaman). Memperbaiki kosmetik dengan risiko mematikan kategori | **Jangan** panggil `setTiles()` untuk memuat ulang ubin. Ubin yang ditolak server (mis. NASA GIBS 500 sesaat) akan **terisi sendiri** saat peta digeser. Cukup **jangan tampilkan angka palsu** |
| **I16** | Membuat `muat()` **melempar galat** untuk kegagalan **sementara** (mis. batas laju `HTTP 429`) | Kategori **gagal dinyalakan** dan hanya berbunyi *"data kosong"* — Bapak mengira aplikasinya rusak. Terbukti pada 💨 Angin (Open-Meteo 429) | Kegagalan sementara → **penjelasan**, bukan penolakan: biarkan kategori tetap menyala, tulis sebabnya dengan bahasa biasa (*"Open-Meteo kehabisan jatah harian — dicoba lagi nanti"*), dan coba lagi pada penjadwalan berikutnya |
| **I17** | Menganggap `HTTP 429` = "terlalu sering sebentar lagi" | Ada dua jenis 429: **batas laju sesaat** dan **jatah harian habis**. Open-Meteo membalas *"Daily API request limit exceeded. Please try again tomorrow."* — itu **berlangsung sampai besok**, bukan sebentar. Menunggu beberapa menit tidak menolong | **Baca isi jawabannya**, jangan hanya kodenya. Bila jatah harian → pindah ke **alamat cadangan** yang setara, dan **catat di `localStorage` bahwa sumber utama habis HARI INI** supaya ia tidak dihubungi lagi sampai besok (menghindari 429 berulang) |
| **I18** | Mencoba menolong batas/jatah dengan **membuka permintaan dari alamat internet berbeda** (ganti jaringan, mode penyamaran, alamat halaman lain) | **Tidak menolong.** Jatah Open-Meteo dihitung **per jaringan (IP)**, bukan per alamat web atau per profil peramban. Uji 7 Okt 2026: 429 tetap 429 walau dari alamat berbeda | Tukar **penyedia/alamat servernya**, bukan alamat halaman. Alternatif yang terbukti sehat: `historical-forecast-api.open-meteo.com` (data sama, `200`, CORS `*`) |
| **I19** | Menyimpulkan "lapisan ini tidak punya celah" dari **satu-dua ubin contoh** | Kesimpulan **terbalik** dan sudah **dua kali** terjadi di sesi 7 Okt 2026: (a) dikatakan peta tutupan awan "tanpa celah" → ternyata **punya celah sama** (terukur cocok **97–100%** dengan hitam di foto); (b) dikatakan "menumpuk beberapa foto bisa menambal celah" → ternyata **tidak bisa** (foto opak) | **Ukur dari banyak ubin, dan bandingkan berpasangan.** Ambil **seluruh** ubin satu tingkat zoom (256 ubin z4) atau **minimal 3 wilayah × 4 tanggal**, lalu **hitung persentase** kosong/gelap. Angka pendukung wajib ada sebelum menyimpulkan |
| **I20** | Menumpuk beberapa lapisan **raster foto** (TrueColor) untuk menambal celah | **Tidak menambal — justru makin gelap.** Lapisan foto **opak** (tanpa kanal alfa), jadi lapisan atas menutupi lapisan bawah. Terukur (10 ubin z4 bercelah): Terra **49,2%** gelap → Terra+Aqua **68,4%** → Terra+Aqua+SNPP **99,0%** | Menambal celah **hanya bisa** dengan ubin **berkanal alfa** (mis. `*_Cloud_Fraction_*`). Contoh yang terbukti: satu permintaan WMS dengan 4 lapisan `Aqua_Night,Terra_Night,Aqua_Day,Terra_Day` (urutan menentukan siapa diambil dulu) → sisa kosong **0,0%–2,4%** (Terra sendiri **33,8%**) |
| **I21** | Menganggap `Access-Control-Allow-Origin: *` di **satu** alamat NASA GIBS berarti **semua** alamatnya aman | Ada **dua** jenis alamat yang berbeda dan **wajib diuji sendiri-sendiri**: ubin WMTS `.../wmts/epsg3857/best/...` dan panggilan WMS `.../wms/epsg3857/best/wms.cgi?SERVICE=WMS...`. Keduanya `*` (diuji `curl` 7 Okt 2026), tetapi **jangan menganggap salah satu mewakili yang lain** (F6) | Uji **tiap alamat** dengan `curl -D - -H "Origin: null"`. Ingat juga: WMTS `.../best/` tanpa `default/<tanggal>/` → **HTTP 400**; peta tutupan awan hanya ada di `GoogleMapsCompatible_Level6` (level lain **400**) |
| **I22** | Menganggap WMS NASA GIBS lebih lambat daripada WMTS | Terukur 7 Okt 2026: **keduanya ±1,0–1,2 detik per ubin**, dan **keduanya** selalu `X-Cache: Miss` (`Cache-Control: max-age=0, no-store, no-cache, must-revalidate`) — jadi ubin populer pun tidak di-cache peladen. Mode "Rapi" (1 permintaan = 4 lapisan) karena itu **tidak lebih lambat** daripada mode foto (1 permintaan = 1 lapisan); 4 lapisan terpisah justru butuh **4 permintaan** | Jangan menolak WMS karena "takut lambat" — **ukur dulu**. Yang benar-benar berbeda dari WMTS: **batas zoom** (Level6 vs Level9) dan **ukuran berkas** (ubin berbeda piksel 27–72%), bukan kecepatan |
| **I23** | Mengambil `PD.alat` **saat berkas dimuat** (`const A = PD.alat;` di awal) di berkas yang dimuat **sebelum** `alat.js` | Berkas jadi **bisu total tanpa satu pun pesan galat** — fitur tampak "tidak ada", padahal kodenya benar. Terbukti 8 Okt 2026: `cari.js` dipasang sebelum `alat.js` ⇒ kotak cari tidak bereaksi sama sekali, konsol bersih | Susun **urutan** di `index.html`: `inti.js` → `alat.js` → berkas lain. Dan sebagai pengaman, berkas yang ragu mengambil `PD.alat` **saat dipakai** (`function alat(){ return PD.alat; }`), bukan saat dimuat |
| **I24** | Memakai `PD.angka()` untuk **menyusun URL** atau menyimpan angka | `PD.angka()` memakai format Indonesia ⇒ **koma** desimal (`-6,9222`), sehingga sumber menolak: **HTTP 400 Bad Request**. Terbukti 8 Okt 2026 pada Open-Meteo | Untuk URL pakai **`toFixed(4)`** / `String(numb)`; `PD.angka()` **hanya** untuk ditampilkan ke manusia |
| **I25** | Menganggap satu ubin NASA GIBS "berisi seluruh wilayah" | Ubin berisi selalu **mode P berpalet**; ubin **tanpa data** berubah jadi **mode `LA`/`RGB` kelabu** (mis. `(247,247,247)`), dan **bisa berlubang sebagian** karena satelit memotret **dalam lintasan**. Terukur pada satu petak z7 di Jawa: hari ini 1.615 piksel · 7 Okt 15.044 · 5 Okt **0** · 4 Okt 20.141 | **Periksa mode/palet** dan **buang piksel yang warnanya tidak ada di tabel resmi** (jangan ditebak jadi angka). Untuk titik yang jatuh di lubang, **coba tanggal mundur** (aturan 🐛 Kebakaran) dan **tuliskan tanggal citra** yang dipakai |
| **I26** | Membaca nilai dari **gambar legenda PNG** NASA | Palet PNG legenda **berbeda** dari palet ubin: terukur **0 dari 7.545** piksel ubin cocok dengan tabel hasil baca PNG. Jadi legenda PNG **tidak boleh** dipakai sebagai sumber angka | Pakai berkas **XML colormap** resmi: `gibs.earthdata.nasa.gov/colormaps/v1.3/<nama_colormap>.xml` (CORS `*`). Untuk suhu: `MODIS_Land_Surface_Temp.xml` — 253 tingkat, satuan **Kelvin**, 200–350 K; °C = K − 273,15. Palet ubin terbukti **253/253 indeks sama persis** dengan berkas itu |
| **I27** | Menganggap "titik tidak berisi data" **pasti** berarti laut | Ubin NASA **tidak memberi tanda** apakah tembus pandang itu laut atau celah lintasan. Terukur 8 Okt 2026: data Open-Meteo pun **tidak bisa** dipakai pembeda — Maladewa (pulau karang) membalas **30,2 °C tinggi 0 m**, sama seperti tengah Samudra Pasifik (**24,3 °C**) | **Jangan menebak.** Tuliskan **kedua kemungkinan** dengan bahasa biasa (*"titiknya di laut, atau sedang di celah lintasan satelit"*). Menebak satu sebab = melanggar aturan F8 |
| **I28** | Menganggap tampilan HP sudah cukup tanpa mengukur **lebar sempit** | Bilah atas **meluber** di bawah ±340 px (tombol ☰ terdorong keluar layar), dan **daftar hasil pencarian terpotong** tepi layar. Keduanya nyata terjadi 8 Okt 2026 | Uji di **beberapa lebar** (288/360/390/412 px) dengan **ukur** `getBoundingClientRect()`, bukan dilihat. Perbaikan: elemen `flex` diberi `min-width:0` + `min-width:0` pada anaknya, dan elemen melayang dipaku **kiri–kanan** (`left:8px;right:8px`) alih-alih `right:-46px` |

**Jangan tertipu:** **NASA GIBS kadang menjawab HTTP 500 sementara** untuk beberapa
ubin (bukan bug aplikasi — diuji ulang dengan `curl`: URL **yang sama** bisa menjawab
**200 → 500 → 200**). Ubin itu kosong sesaat lalu terisi sendiri saat peta digeser.
Jangan "memperbaiki" kode hanya karena ini — dan **jangan** mencoba memuat ulang
pakai `setTiles()` (lihat **I15**, itu menghidupkan kembali bugs I1).

**Cara menguji** jebakan di atas: buka aplikasi, **tukar gaya peta 4 kali**
(🌐 Globe ↔ Satelit) dengan kategori ubin aktif, lalu **hitung galat di konsol**.
Harus **0 galat** dan lapisan harus **selalu kembali terlihat**.

⚠️ **Beri jeda wajar antar-tekan** (±4–6 detik). Menekan 🌐 Globe beruntun sangat
cepat akan memunculkan peringatan
`proyeksi tidak didukung Error: Style is not done loading.` — itu **sudah
ditangani** (hanya `console.warn`, bukan galat nyata).

**Hasil uji akhir 7 Okt 2026 (halaman baru):** 8 kategori aktif · 3 lapisan ubin
(`lapis-hujan` 0.85 · `lapis-suhu` 0.78 · `lapis-awan` 0.72) **selalu kembali
terpasang** setelah 4× tukar gaya · **0 galat halaman** · **0 galat sumber daya**.

⚠️ **Pelajaran tentang kartu pengaturan (F19):** kartu kategori dulu **hanya** bisa
dibuka lewat klik peta, sedangkan klik itu **diperebutkan** seluruh kategori aktif
(yang pertama mengenali titik, dia yang menang) — jadi Bapak sering mendapat kartu
kategori lain, bukan yang dimaksud. Diuji: 8 klik berturut-turut hanya **4** yang
membuka kartunya. Karena itu tiap baris kategori diberi tombol **`⋯`**. Setelah
tombol itu ada, kartu apa pun **selalu** bisa dibuka.

⚠️ **Pelajaran tentang uji CORS (ini paling penting):** **browser uji otomatis di
lingkungan ini TIDAK menegakkan CORS.** Terbukti ia berhasil membaca `api.adsb.lol`
dan `opendata.adsb.fi` yang `curl` buktikan **tanpa** header CORS. → **Hanya hasil
`curl -D - -H "Origin: null"` yang sahih.** Jangan sekali-kali menyimpulkan
"CORS-nya aman" dari hasil fetch browser.

⚠️ **Pelajaran tentang sumber pesawat:** **tidak ada satu pun sumber posisi pesawat
gratis tanpa kunci yang punya CORS.** Sudah diuji 9 sumber (daftar lengkap di
`prompt.md` bagian 2.2). Dua kasus paling menjebak:
- **OpenSky** mengirim `Access-Control-Allow-Origin: https://opensky-network.org`
  — kelihatan seperti "punya CORS", padahal **bukan `*`** → tetap diblokir dari `file://`.
- **`globe.airplanes.live/re-api/`** punya CORS `*` **dan** data lengkap, tetapi
  **mewajibkan header `Referer`** (tanpa referer 403). Dari `file://` browser tidak
  pernah mengirim Referer → **tidak bisa dipakai**. Jangan tertipu oleh CORS-nya.

⚠️ **Pelajaran tentang kunci API (F12) & kejujuran angka (F8):**
- Kunci **hanya** di `localStorage`; jangan pernah ditulis di kode atau dokumen —
  **termasuk sebagai "contoh"**. Pelanggaran ini pernah terjadi (kunci asli Bapak
  tertulis sebagai contoh bentuk), lalu dibersihkan dan diganti contoh karangan.
  Contoh bentuk yang aman: `a1b2c3d4-5e6f-7890-abcd-ef1234567890`.
- Bila sumber **tidak** memberi sebuah angka (mis. AirLabs tidak memberi **sisa
  jatah**, NASA GIBS tidak memberi **skala warna**), maka:
  1. **jangan mengarang**; dan
  2. bila aplikasi **menghitung sendiri**, **katakan** bahwa itu hitungan sendiri
     (contoh: *"perkiraan … (hitungan sendiri)"*).
- Sebelum memakai kunci baru, periksa dulu ke endpoint `ping` untuk membaca
  **batas resmi** dan masa berlakunya — jangan menebak batas dari dokumen lama.

---

## 📌 PESAN UNTUK AI BERIKUTNYA

1. **Baca berkas ini utuh** sebelum kerja apa pun.
2. **Jangan mulai tanpa aba-aba** Bapak.
3. **Backup → kerjakan → uji bagian yang berubah → lapor → update dokumen sekali di akhir sesi.**
4. Kalau ragu → **tanya**, jangan menebak. Jangan karang data (F8).
5. Riwayat yang sudah selesai ❌ **jangan ditulis di sini** → tulis di `CHANGELOG.md`.
6. **Sebelum memakai sumber data baru** → uji CORS dengan `curl` (F6), lalu **catat hasilnya**
   di `prompt.md` bagian 2.2 (sumber gagal) / bagian 4 (daftar sumber CORS) — ini menghemat
   waktu besar, karena sesi 7 Okt 2026 menghabiskan **berjam-jam** menguji 9 sumber pesawat
   yang ternyata semuanya gagal.
7. **Kalau butuh lapisan ubin raster** → pakai `PD.alat.lapisan()`, jangan tulis MapLibre
   langsung (F11) — semua jebakan MapLibre sudah diselesaikan di sana (bagian I).
8. **Jangan pernah menulis kunci API di dalam kode** (F12) — sediakan kotak isian saja.
9. **Wajib sebut perkiraan waktu** sebelum mengerjakan sesuatu (aturan B5).
