# 🧩 prompt.md — KONSEP PROYEK **PETA DUNIA**

> Berkas ini = **konsep**. Tujuannya supaya proyek ini **bisa dilanjutkan ATAU dibangun
> ulang 100%** — oleh Bapak sendiri (tanpa AI) atau AI lain.
> 🔴 **Aturan kerja AI ada di `agents.md`** — bukan di sini. Ini murni **konsep & rancangan**.

---

## 0. KONSEP INTI (baca dulu)

### 0.1 Apa itu Peta Dunia

Aplikasi **peta dunia real-time**. Bumi ditampilkan sebagai **globe 3D** dengan **citra
satelit asli**, lalu di atasnya digambar **data keadaan dunia** yang diambil ulang
otomatis dari sumber resmi. Bapak memilih sendiri mau melihat apa lewat **kategori**.

Empat hal yang jadi inti:

| # | Inti | Artinya |
|---|------|---------|
| 1 | **Bentuk realistis** | Bumi berbentuk **globe 3D** + citra satelit asli, bisa diputar & dizoom |
| 2 | **Real-time** | Data diambil ulang otomatis; angka di layar ikut berubah |
| 3 | **Kategori** | Bapak pilih sendiri mau lihat apa; tiap kategori bisa dinyalakan/dimatikan |
| 4 | **Animasi** | Titik bergerak (pesawat/kapal/kereta), gelombang (gempa), denyut (kebakaran) |

### 0.2 Batasan yang TIDAK BOLEH dilanggar

1. **Harus jalan di PC (70%) dan HP Android (30%)** — dua-duanya.
2. **Tidak boleh bergantung pada server** — harus bisa dibuka langsung dari berkas
   (`file://`, tanpa internet server sendiri).
3. **Nama proyek persis: "Peta Dunia".**
4. **Data TIDAK boleh dikarang** — harus dari sumber yang dipercaya.

---

## 1. ARSITEKTUR

```
Peta Dunia (app/)
├── index.html              → kerangka: peta, bilah atas, panel kategori, panel info
├── css/
│   ├── gaya.css            → tampilan aplikasi
│   └── maplibre-gl.css     → gaya bawaan MapLibre
└── js/
    ├── inti.js             → peta, kanvas animasi, panel kategori, panel info, jam
    ├── lapisan/            → SATU BERKAS = SATU KATEGORI
    │   ├── alat.js         → alat bantu gambar & pengambil data
    │   ├── gempa.js        → 🌊 Gempa Bumi
    │   ├── kebakaran.js    → 🔥 Kebakaran Hutan
    │   ├── gunung.js       → 🌋 Gunung Vulkanik
    │   └── angin.js        → 💨 Angin
    └── lib/
        └── maplibre-gl.js  → disimpan LOKAL (tidak ambil dari internet)
```

### 1.1 Cara kerja inti (`js/inti.js`)

| Bagian | Keterangan |
|--------|-----------|
| Peta | MapLibre GL JS, pusat `[118, -2]`, zoom awal 2,4 · minZoom 0,6 · maxZoom 18 |
| Dua gaya peta | **Satelit** (Esri World Imagery + batas & nama tempat) dan **Vektor** (OpenFreeMap Liberty) |
| Globe / datar | Tombol 🌐 Globe ↔ 🗺️ Datar (proyeksi `globe` ↔ `mercator`) |
| Kanvas animasi | Kanvas terpisah di atas peta (`#kanvas-animasi`), digambar tiap bingkai |
| Panel kategori | `#panel-kategori` — daftar kategori + saklar nyala/mati |
| Panel info | `#panel-info` — muncul saat titik data diklik |
| Jam | `#jam` — waktu WIB, diperbarui tiap detik |

### 1.2 Bentuk satu kategori (WAJIB sama untuk semua)

Tiap berkas kategori mendaftar lewat `PD.daftar({...})` dengan bentuk:

```js
PD.daftar({
  id, nama, ikon, ket, jeda,
  muat(),        // ambil data pertama kali
  segarkan(),    // ambil ulang data berkala (tiap `jeda` milidetik)
  nyalakan(),    // dipanggil saat kategori dinyalakan
  matikan(),     // dipanggil saat kategori dimatikan
  gambar(ctx, dt, waktu),  // menggambar animasi tiap bingkai
  klik(x, y),    // kembalikan true bila ada titik yang diklik
  pasang()       // dipasang ulang setelah gaya peta berganti
});
```

### 1.3 Alat bantu (`PD.alat` di `js/lapisan/alat.js`)

| Alat | Guna |
|------|------|
| `aman(teks)` | Membuang `< >` agar data dari internet tak bisa menyisipkan HTML |
| `info(ikon, judul, baris)` | Membuat kartu isi panel informasi |
| `denyut(waktu, periode, fase)` | Denyut halus 0..1 |
| `gelombang(ctx, x, y, umur, rMaks, warna, tebal)` | Cincin mengembang (gempa / letusan) |
| `pesawat(ctx, x, y, hdg, p, warna, alfa)` | Segitiga pesawat dengan arah hadap |
| `kapal(ctx, x, y, hdg, p, warna, alfa)` | Badan kapal dengan arah hadap |
| `kereta(ctx, x, y, hdg, p, warna, alfa)` | Kotak kereta dengan garis rel |
| `label(ctx, x, y, teks, warna, ukuran)` | Label kecil berisi teks |
| `panas(nilai)` | Warna menurut nilai 0..1 (biru → merah) |
| `bidik(daftar, x, y, toleransi)` | Mencari titik terdekat dari posisi klik |
| `ambil(url, opsi)` | Mengambil data JSON dengan penanganan galat |

> ℹ️ Alat gambar **pesawat, kapal, kereta** sudah disiapkan — tinggal dipakai saat
> kategori penerbangan / kapal / kereta dikerjakan.

### 1.4 Alat bantu inti (`PD`)

| Alat | Guna |
|------|------|
| `PD.tampak(lon, lat)` | Apakah titik ada di sisi globe yang menghadap kita |
| `PD.layar(lon, lat)` | Posisi layar sebuah koordinat; `null` bila tak terlihat |
| `PD.cahaya(ctx, x, y, r, warna, alfa)` | Titik bercahaya (sprite di-cache agar cepat) |
| `PD.angka(n, desimal)` | Angka format Indonesia |
| `PD.waktu(iso)` / `PD.sejak(iso)` | Jam WIB / "3 jam lalu" |
| `PD.ringkas(id, teks, tambahan, warna)` | Ringkasan status di kaki panel kategori |
| `PD.tampilkanInfo(html)` / `PD.tutupInfo()` | Buka / tutup panel informasi |

---

## 2. KATEGORI & SUMBER DATA

### 2.1 Sudah jalan (8 kategori)

| Kategori | Berkas | Sumber | Cakupan | Jeda segar |
|----------|--------|--------|---------|-----------|
| 🌊 **Gempa Bumi** | `gempa.js` | **USGS** feed GeoJSON `2.5_week` | Seluruh dunia | 2 menit |
| 🔥 **Kebakaran Hutan** | `kebakaran.js` | **NASA GIBS WMS** (titik api VIIRS) + **GDACS** (WF) | Seluruh dunia | 10 menit |
| 🌋 **Gunung Vulkanik** | `gunung.js` | **Wikidata** SPARQL + **GDACS** (VO) | Seluruh dunia | 15 menit |
| 💨 **Angin** | `angin.js` | **Open-Meteo** forecast · cadangan `historical-forecast-api.open-meteo.com` | Seluruh dunia | 10 menit |
| 🌧️ **Hujan** | `hujan.js` | **RainViewer** radar (ubin + `weather-maps.json`) | Seluruh dunia | 30 menit |
| ✈️ **Penerbangan** | `penerbangan.js` | **AirLabs** `v9/flights` (perlu kunci gratis) | Seluruh dunia | 30 menit |
| 🌡️ **Suhu Permukaan** | `suhu.js` | **NASA GIBS WMTS** `MODIS_Terra_Land_Surface_Temp_Day` | Seluruh dunia | 15 menit |
| ☁️ **Awan** | `awan.js` | **NASA GIBS WMTS** — foto asli `MODIS_Terra_CorrectedReflectance_TrueColor` dengan warna alami | Seluruh dunia | 15 menit |

Catatan tiap kategori:

- **Gempa** — M≥2,5 tujuh hari terakhir. Animasi **gelombang mengembang** untuk gempa
  ≤24 jam; warna menurut magnitudo & umur; gempa M≥5,5 diberi label.
- **Kebakaran** — titik api dibaca dari **piksel citra satelit** GIBS; titik yang
  menumpuk digabung saat zoom jauh; kekuatan api (FRP) menentukan ukuran & warna.
- **Gunung** — daftar gunung api dari Wikidata, erupsi terkini dari GDACS; gunung
  yang sedang erupsi memancarkan asap/abu + denyut cahaya.
- **Angin** — kisi **16 × 12 = 192 titik ukur** (maksimum 300 per permintaan);
  animasi **partikel mengalir** mengikuti arah angin + panah di tiap titik ukur.
- **Hujan** — ubin radar **RainViewer** beranimasi maju-mundur. Ubin **512 px**
  (bukan 256 px) supaya resolusi ganda tanpa menambah permintaan — sebab RainViewer
  membatasi **500 permintaan / 60 detik** per IP. `maxzoom 7`, 13 rangka terakhir.
  Wilayah yang kosong = memang tidak ada hujan terdeteksi, bukan galat.
- **Penerbangan** — **AirLabs** dengan kunci gratis (1.000 kueri/bulan;
  batas resmi **1.000/bulan · 2.500/jam · 250/menit**) yang **ditempelkan Bapak
  sendiri** di panel kategori; kunci disimpan di `localStorage` bernama
  `pd_airlabs_key`, **tidak ditulis di dalam kode**.
  Permintaan per bbox layar; kolom **rute** (asal → tujuan), maskapai, jenis
  pesawat, arah, kecepatan, ketinggian. Ada **kotak cari penerbangan** (1 kueri)
  yang bisa mencari nomor penerbangan siapa pun di dunia, lalu menyorotnya, dan
  **tombol "Segarkan sekarang"**.
  Dua angka dibedakan: **"Pesawat di layar"** (yang benar-benar tampak) dan
  **"Pesawat terambil"** (paling banyak 400, dengan catatan batasnya).
  **Sisa jatah = perkiraan hitungan aplikasi sendiri** (AirLabs tidak
  memberitahukannya) — dinyatakan apa adanya sebagai *"perkiraan …"*.
  ✅ Diuji 7 Okt 2026 dengan kunci sungguhan: 400 terambil · 317 tampak di layar ·
  `AK378` → KUL → DPS (AirAsia A20N, 8.828 m).
- **Suhu & Awan** — ubin **NASA GIBS WMTS**, urutan alamat `{z}/{y}/{x}` (bukan
  `{z}/{x}/{y}`). Suhu `Level7` (maxzoom 7), Awan `Level9` (maxzoom 9).
  Tanpa tanggal = otomatis citra terbaru. Suhu ditampilkan sebagai warna tanpa
  angka derajat; Awan memakai foto asli sehingga tidak menampilkan angka persen.
  Wilayah laut pada lapisan suhu memang kosong (yang diukur hanya permukaan
  daratan).

#### ☁️ Awan: foto satelit realistis

- Satu-satunya tampilan: **foto asli MODIS Terra**
  (`MODIS_Terra_CorrectedReflectance_TrueColor`) dari NASA GIBS WMTS, `Level9`,
  alamat ubin `{z}/{y}/{x}`.
- Warna foto alami: awan tampak putih, bukan palet buatan merah/ungu. Foto juga
  memperlihatkan permukaan; salju dan es turut tampak putih.
- Celah gelap di antara lintasan satelit dapat terlihat. Foto satelit bersifat
  **opak**; menumpuk foto lain tidak menambal celah dan justru dapat membuatnya
  makin gelap.
- **Tidak ada mode peta tutupan awan berpalet warna** pada aplikasi.
- Kepekatan dapat dipilih: **Tipis (0,35) / Sedang (0,55) / Tebal (0,72)**.
  Nilainya disimpan di `localStorage` (`pd_awan_opasitas`).
- Persentase tutupan awan tidak ditampilkan karena lapisan yang dipakai adalah
  foto, bukan data angka persen.

### 2.2 Belum dikerjakan (2 kategori)

| Kategori | Sumber yang direncanakan | Cakupan | Catatan |
|----------|--------------------------|---------|---------|
| 🚢 **Kapal laut** | **Digitraffic** | ⚠️ Eropa Utara saja | Belum ada sumber gratis seluruh dunia |
| 🚆 **Kereta** | **Digitraffic** | ⚠️ Finlandia saja | Belum ada sumber gratis seluruh dunia |

#### ❌ Sudah dicoba & gagal (jangan diulang)

| Sumber | Keperluan | Sebab gagal |
|--------|-----------|-------------|
| **OpenSky Network** | posisi pesawat | `Access-Control-Allow-Origin: https://opensky-network.org` — **bukan `*`** → diblokir dari `file://` |
| `api.adsb.lol`, `opendata.adsb.fi` | posisi pesawat | JSON 200 OK, **tanpa header CORS sama sekali** |
| `api.airplanes.live`, `api.adsb.one` | posisi pesawat | tanpa header CORS |
| `globe.adsb.fi`, `globe.adsb.one`, `globe.adsb.lol`, `globe.adsbexchange.com` | posisi pesawat | tanpa header CORS |
| `globe.airplanes.live/re-api/` | posisi pesawat | **punya CORS `*` + data lengkap**, tetapi **wajib mengirim `Referer`** — tanpa referer 403; dari `file://` browser tidak mengirim Referer |
| FlightRadar24 | posisi pesawat | tanpa header CORS |

**Kesimpulan:** **tidak ada satu pun sumber posisi pesawat gratis tanpa kunci
yang punya CORS.** Karena itu **AirLabs** (berkunci, gratis 1.000 kueri/bulan)
yang dipakai. Pembanding lain yang **punya CORS** tetapi kuotanya kecil/trial:
Aviationstack (100 kueri/bulan), FlightLabs (uji 7 hari),
ADSBExchange lewat RapidAPI (kunci, `ACAO: null` — khusus `file://`).

#### 📞 Rincian AirLabs (yang dipakai & yang berguna untuk memeriksa)

| Keperluan | Alamat |
|-----------|--------|
| Posisi pesawat per wilayah layar | `https://airlabs.co/api/v9/flights?api_key=<KUNCI>&bbox=<selatan,barat,utara,timur>&zoom=<0-11>&_view=array&_fields=<daftar>` |
| Cari satu penerbangan (seluruh dunia) | `.../flights?api_key=<KUNCI>&_view=array&_fields=<daftar>&flight_iata=GA612` (bisa juga `flight_icao`, `flight_number`, `hex`) |
| **Periksa kunci & baca batas resmi** | `https://airlabs.co/api/v9/ping?api_key=<KUNCI>` → jawaban berisi `limits_by_month`, `limits_by_hour`, `limits_by_minute`, `expired`, `type` |

- **`_view=array` mengembalikan LARIK BERISI LARIK** (posisional, sesuai urutan
  `_fields`), **bukan** larik berisi objek. Kode sudah menanganinya di
  `bacaBaris()` — jangan "memperbaiki" yang sudah benar.
- **`_view=object`** juga bisa, dan **menyertakan bagian `request`** (batas kunci),
  sedangkan `_view=array` tidak.
- **`_fields_extra=quota` TIDAK berfungsi** (tidak menambah apa pun) — sisa jatah
  **tidak pernah** dikirim AirLabs. Karena itu aplikasi menghitung sendiri.
- Satuan: **`alt` = meter**, `speed` = km/jam, `dir` = derajat.
- Batas resmi paket free (dibaca 7 Okt 2026): **1.000/bulan · 2.500/jam ·
  250/menit**, berlaku s/d **7 Nov 2026**.
- 🔴 **Bentuk kunci AirLabs wajib diperiksa lebih dulu** sebelum dikirim:
  `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
  (36 karakter: 32 angka/huruf heksadesimal + 4 tanda hubung).
  Contoh sah (karangan, **bukan kunci siapa pun**): `a1b2c3d4-5e6f-7890-abcd-ef1234567890`.
  Bila salah tempel, AirLabs menjawab **`Unknown api_key`** — pesan itu **tidak
  jelas** bagi Bapak, jadi aplikasi menolak lebih dulu dengan pesan
  *"bentuknya salah"*. **Jangan menunggu jawaban server.**
- ⚠️ **`Unknown api_key` BUKAN berarti kunci mati.** Periksa dengan `curl` ke
  endpoint `ping`: bila jawabannya `pong`, kuncinya **masih sah** — berarti yang
  dikirim aplikasi kunci yang **berbeda** (pernah terjadi: kunci **palsu sisa uji**
  tertinggal di `localStorage`, lihat pelajaran **I13**).

### 2.3 Peta dasar & citra

| Bagian | Sumber | Cakupan |
|--------|--------|---------|
| Citra satelit | **Esri** World Imagery | Seluruh dunia |
| Batas & nama tempat | **Esri** World Boundaries and Places | Seluruh dunia |
| Peta vektor | **OpenFreeMap** (gaya Liberty) | Seluruh dunia |

---

## 3. ATURAN TEKNIS (agar bisa dibangun ulang)

1. **MapLibre GL JS disimpan lokal** di `app/js/lib/` — aplikasi tidak bergantung CDN.
2. **Satu berkas = satu kategori** di `app/js/lapisan/`. Ditambah/dimatikan tanpa
   mengganggu yang lain.
3. Animasi digambar di **kanvas terpisah** di atas peta (`#kanvas-animasi`), bukan di
   dalam gaya peta.
4. **Titik di balik globe harus disembunyikan** — pakai `PD.tampak(lon,lat)` /
   `PD.layar(lon,lat)`. Kalau tidak, titik tampak seperti nyasar di sisi depan.
5. **Jangan mengarang data** — kalau sumber gagal, tampilkan gagal (aturan F8 di `agents.md`).
6. Data dari internet **selalu dilewatkan `PD.alat.aman()`** sebelum ditampilkan.

---

## 4. 🔴 WAJIB: sumber data harus punya header CORS

Aplikasi ini dibuka langsung dari berkas (`file://`). Browser **memblokir** data dari
situs yang tidak mengirim header `Access-Control-Allow-Origin`. Karena itu:

1. **Setiap sumber baru WAJIB diuji header CORS-nya lebih dulu**, dengan
   `curl -D - -H "Origin: null" <url>` lalu cari baris `access-control-allow-origin`.
2. **Jangan percaya hasil uji di browser otomatis** — di lingkungan ini browser uji
   **tidak menegakkan CORS**. Terbukti: ia berhasil membaca `api.adsb.lol` dan
   `opendata.adsb.fi` yang curl buktikan **tanpa** header CORS. Hasil fetch browser
   soal CORS **tidak sahih**; hanya curl yang sahih.
3. Sumber yang **sudah terbukti punya CORS (`*`)**: USGS, GDACS, NASA GIBS
   (WMS dan WMTS), Wikidata SPARQL, Open-Meteo, RainViewer (API **dan** ubinnya),
   Esri, OpenFreeMap, `api.adsbdb.com` (metadata callsign, bukan posisi),
   `hexdb.io` (metadata pesawat, bukan posisi), **AirLabs** (perlu kunci),
   Aviationstack (perlu kunci, 100 kueri/bln), FlightLabs (perlu kunci, uji 7 hari).

   ⚠️ **NASA GIBS punya DUA alamat yang berbeda dan wajib diuji sendiri-sendiri**
   (jangan anggap satu mewakili yang lain, pelajaran **I21**):

   | Alamat | Bentuk | CORS | Catatan |
   |--------|--------|------|---------|
   | `gibs.earthdata.nasa.gov/wmts/epsg3857/best/...` | ubin `{z}/{y}/{x}` | `*` | butuh `default/<tanggal>/`; tanpa itu **HTTP 400** |
   | `gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi` | `BBOX={bbox-epsg-3857}` | `*` | bisa **menggabung beberapa lapisan** dalam satu permintaan |

   Keduanya membalas `Cache-Control: max-age=0, no-store` dan selalu
   `X-Cache: Miss` (±1,0–1,2 detik/ubin) — jadi kecepatannya **setara**.

   **Open-Meteo punya beberapa alamat dengan data yang sama** — penting untuk
   berjaga bila jatah habis (jatah dihitung **per jaringan/IP**, jadi ganti alamat
   halaman **tidak** menolong):

   | Alamat | Keadaan 7 Okt 2026 | CORS |
   |--------|--------------------|------|
   | `api.open-meteo.com` | ❌ jatah harian habis (`429`, *"try again tomorrow"*) | `*` |
   | **`historical-forecast-api.open-meteo.com`** | ✅ `200`, data lengkap | `*` |
   | `archive-api.open-meteo.com` | ✅ `200` (data arsip) | `*` |
   | `ensemble-api.open-meteo.com` | ❌ `400` (tidak mendukung `best_match`) | — |
   | `customer-api.open-meteo.com` | ❌ `401` (perlu kunci) | — |

   Dipakai aplikasi: utama lalu **cadangan** `historical-forecast-api`. Bila yang
   utama terbukti habis, catatan *"habis hari ini"* disimpan di `localStorage`
   (`pd_angin_utama_lelah`) agar ia tidak dihubungi lagi sampai besok.
4. Sumber yang **terbukti TIDAK punya CORS** (jangan dipakai): **OpenSky Network**
   (kirim `ACAO: https://opensky-network.org`, bukan `*`), `api.adsb.lol`,
   `opendata.adsb.fi`, `api.airplanes.live`, `api.adsb.one`,
   `globe.adsbexchange.com`, `globe.adsb.fi`, `globe.adsb.one`, `globe.adsb.lol`,
   NASA FIRMS (CSV), Smithsonian GVP, OpenRailwayMap, FlightRadar24.
5. **`globe.airplanes.live/re-api/`** — kasus khusus: **punya CORS `*`** dan data
   79 KB, tetapi **mewajibkan header `Referer: https://globe.airplanes.live/`**
   (tanpa itu 403, referer asing juga 403). Dari `file://` browser tidak pernah
   mengirim `Referer` → **tidak bisa dipakai**, walau CORS-nya lolos.

⚠️ **Pelajaran nyata:** kategori Kebakaran & Gunung sempat tidak bisa dinyalakan di
komputer Bapak karena memakai FIRMS dan GVP yang tanpa CORS. Browser uji AI tidak
menampakkan masalah itu. Sudah diganti ke GIBS WMS dan Wikidata.

⚠️ **Kunci API tidak pernah ditulis di dalam kode.** Bila sebuah sumber butuh kunci
(mis. AirLabs), kode hanya menyediakan **kotak isian**; Bapak menempelkan kuncinya
sendiri, dan kunci disimpan di `localStorage` (untuk AirLabs: `pd_airlabs_key`).

### 🔴 WAJIB: penjaga "sedang bekerja" & batas waktu permintaan

Dua kesalahan ini **tidak menampilkan galat apa pun** — kategori cuma tampak
"diam", sehingga sangat sulit ditemukan. Wajib dipatuhi kategori mana pun:

1. **Penjaga `sedangAmbil` (atau apa pun namanya) WAJIB dilepas di blok `finally`.**
   Jangan pernah `return` di dalam `try` sebelum baris pelepasan penjaga —
   satu kegagalan akan mengunci kategori **selamanya**.
2. **Setiap permintaan internet WAJIB punya batas waktu.** `PD.alat.ambil()` sudah
   memasang **20 detik** (`AbortController`) dan melaporkan
   *"tidak menjawab (waktu habis)"*. Kategori baru **jangan** memanggil `fetch`
   langsung — pakai `A.ambil()`.

⚠️ **Jangan tertipu:** **NASA GIBS kadang menjawab HTTP 500 sementara** untuk
beberapa ubin (diuji ulang dengan `curl` → **200**). Itu galat sementara peladen
NASA, bukan bug aplikasi. Yang penting: kategori **tidak menampilkan angka palsu**
saat ubin gagal dimuat.

---

## 4b. 🧠 PELAJARAN MAPLIBRE (mahal, jangan diulang)

1. **Membuang sumber ubin saat gambarnya masih di udara → MapLibre mogok** dengan
   `Cannot read properties of undefined (reading 'bind')` dari `renderLayer()`
   (ini yang dulu membuat kategori Hujan mati). **Perbaikan:** jangan buang
   sumbernya; cukup `setPaintProperty(..., 'raster-opacity', 0)`. Ganti ubin
   memakai `setTiles()`, bukan buang-lalu-buat.
2. **Ganti gaya peta (`setStyle`) saat ada sumber tambahan aktif → 15 galat**
   yang sama. Urutan yang salah: ganti gaya dulu, lepas sesudahnya.
   **Perbaikan yang terbukti:** **lepas lapisan TEPAT SEBELUM `setStyle`**,
   lewat kait yang membungkus `PD.peta.setStyle`, ditambah jaring pengaman pada
   peristiwa `styledata`. Hasil uji: tanpa kategori 0 galat; dengan lapisan
   15 galat; lepas-dulu **0 galat**.
3. **`PD.peta.getStyle()` mengembalikan objek BARU setiap dipanggil** → tidak bisa
   dipakai untuk membandingkan "apakah gayanya sudah berubah". Harus membandingkan
   **identitas objek `PD.peta.style`** (`sebelum !== sesudah`).
4. **Menambah sumber saat gaya belum selesai dimuat akan terhapus** saat gaya
   selesai dimuat. Wajib menunggu `isStyleLoaded()` benar-benar `true`.
5. `isStyleLoaded()` bisa **`false` berkepanjangan** bila konteks WebGL halaman
   sudah jenuh (mis. halaman uji yang dibuka terlalu lama dan sering tukar gaya).
   Karena itu pemasangan lapisan **dicoba berulang** sampai ±60 detik (240 × 250 ms).
6. **Galat di dalam `gambar()` dan `muat()` ditelan diam-diam** oleh inti
   (`catch (e) { /* lewati */ }`). Ini membuat bug tampak seperti "tidak terjadi
   apa-apa" — jadi saat kategori tidak muncul, **curigai galat yang tertelan**,
   dan pastikan kegagalan **dilaporkan sendiri** lewat `PD.setStatus()`.
7. **Peringatan `proyeksi tidak didukung Error: Style is not done loading.`** akan
   muncul di konsol bila tombol 🌐 Globe ditekan **saat gaya peta sedang dimuat**.
   Ini **sudah ditangani** `inti.js` (dibungkus `try/catch`, hanya `console.warn`)
   dan **bukan galat** — proyeksi tinggal tidak berubah saat itu, bisa ditekan
   lagi sesudah peta tenang. Muncul hanya bila tombol ditekan beruntun cepat.

Alat `PD.alat.lapisan()` di `app/js/lapisan/alat.js` adalah tempat semua pelajaran
di atas sudah diselesaikan — kategori baru yang butuh lapisan ubin **wajib**
memakainya, jangan menulis MapLibre langsung.

---

## 4c. 🧩 CARA MEMBUAT KATEGORI BARU (resep baku)

Agar AI berikutnya tidak mengulangi kesalahan yang sama:

1. **Uji CORS sumbernya dulu** (bagian 4) dengan `curl`. Gagal → catat di
   bagian 2.2 lalu cari sumber lain. **Jangan** percaya browser.
2. Buat **satu berkas** di `app/js/lapisan/` (aturan F5), daftarkan lewat
   `PD.daftar({id, nama, ikon, ket, jeda, muat, segarkan, nyalakan, matikan,
   gambar, klik, pasang})`.
3. Titik data → **wajib** pakai `PD.layar(lon,lat)`; `null` = di balik globe (F9).
4. Lapisan ubin raster → **wajib** `PD.alat.lapisan()` (F11).
5. Ambil data → **wajib** `PD.alat.ambil()` (punya batas waktu 20 detik).
6. Penjaga "sedang bekerja" → **wajib** dilepas di `finally` (bagian 4).
7. Teks dari internet → lewatkan `PD.alat.aman()` lebih dulu.
8. Kegagalan → **selalu laporkan sendiri** lewat `PD.setStatus()` / `PD.ringkas()`,
   sebab galat di `gambar()` dan `muat()` **ditelan diam-diam** oleh inti.
9. **Jangan mengarang angka** (F8). Bila sumber tidak memberi skalanya,
   tampilkan **warna saja** dan beri tahu alasannya di `panduan.md`.
10. **Lapisan ubin dari NASA — periksa warnanya dulu** (F14): unduh satu ubin,
    baca chunk `PLTE`/`tRNS`, hitung warna terbanyak. Lapisan "biasa" sebaiknya
    memakai **foto asli** (`..._CorrectedReflectance_TrueColor`), bukan peta warna
    yang menyala keras. Lapisan foto **wajib** diberi opasitas sedang + pengatur
    kepekatan yang diingat (F15).
11. Daftarkan berkasnya di `app/index.html` dengan **penanda versi yang dinaikkan**
    (mis. `?v=20261007-7`), kalau tidak peramban akan memakai berkas lama.
12. Uji: nyalakan **bersama 7 kategori lain**, lalu **tukar gaya peta 4 kali**
    (🌐 Globe ↔ Satelit) dan hitung galat di konsol — harus **0 galat** dan
    lapisan harus **selalu kembali terlihat**.
13. **Jangan tinggalkan kode/perkakas yang belum dipakai** (aturan H1). Bila
    menambah kemampuan ke `PD.alat`, pastikan **ada kategori yang benar-benar
    memakainya** — kalau tidak, hapus sebelum menutup sesi.

---

## 5. BELUM DITENTUKAN

_(diisi bersama saat dibahas)_

- Sumber gratis untuk **kapal laut** & **kereta** seluruh dunia (sekarang hanya Eropa Utara).
- Apakah perlu kategori tambahan di luar daftar di atas.

---

## 6. 📱 MENJALANKAN DI HP ANDROID (konsep — dipelajari dari ANodes 8 Okt 2026)

### 6.1 Chrome Android + `file://`

| Keadaan | Bisa? |
|---------|-------|
| Mengetik `file:///…/index.html` di **bilah alamat** Chrome Android | ❌ tidak bisa |
| Membuka dari **aplikasi pengelola berkas** (`Files`/File Manager) → *Buka dengan Chrome* | ✅ **bisa** |

ANodes membuktikannya: `ANodes-1berkas.html` **jalan di Chrome Android** lewat
`file://` (tercatat di berkasnya dan sudah dipakai Bapak).

### 6.2 Aturan penting: di `file://` halaman TIDAK BOLEH membaca berkas lain

Chrome melarang `fetch`/`XHR` dari halaman `file://` untuk membaca **berkas lain
di folder yang sama**. Yang diizinkan hanya pemuatan lewat `<script src>`.
Akibatnya:

1. **Kirim hanya `index.html` ke HP = rusak** (css/js tidak ikut).
   → Karena itu ANodes membuat **satu berkas** (`ANodes-1berkas.html`).
2. **Data JSON tidak bisa dibaca langsung.** Caranya (dipakai ANodes): data
   **dibungkus menjadi berkas `.js`** yang menulis ke variabel global, contoh
   `tools/siapkan-dokumen.js`:

   ```js
   window.ANodesDokumen = { daftar: [ … ] };   // isi berkas .md sebagai teks
   ```

   lalu dimuat seperti berkas biasa (`<script src="js/dokumen-data.js">`) di PC,
   atau **disatukan ke dalam satu berkas** untuk HP.

### 6.3 Apakah Peta Dunia BUTUH cara JSON itu? **Tidak.**

Seluruh data Peta Dunia diambil **dari internet** (USGS, NASA GIBS, GDACS,
Wikidata, Open-Meteo, RainViewer, AirLabs) — **tidak ada** data JSON lokal yang
perlu dibaca dari folder. Jadi larangan "baca berkas lain" **tidak menghambat**
aplikasi ini.

Yang tetap dibutuhkan dari konsep ANodes: **versi SATU BERKAS** supaya bisa
dikirim ke HP (css + MapLibre + 10 berkas js disatukan jadi satu `.html`).

### 6.4 Yang perlu diperhatikan

1. **Pemuatan `file://` tidak stabil di HP** ⇒ versi satu berkas lebih cepat dan
   lebih aman dibuka.
2. Bila `localStorage` kosong di HP, kunci AirLabs dan pengaturan perlu ditempel
   ulang sekali. ANodes memakai **IndexedDB** untuk data besar — pola itu bisa
   ditiru bila perlu.
3. Berkas jadi besar (MapLibre 955 KB + kode ≈ 1,2 MB); ANodes sendiri 27 MB dan
   tetap jalan.

### 6.5 Cara memindahkan PC → HP (rencana Bapak: Google Drive, manual)

1. Di PC: unggah berkas **satu berkas** (`…-1berkas.html`) ke Google Drive.
2. Di HP: buka Google Drive → berkas itu → **Unduh** (atau *Buat tersedia
   offline*) supaya tersimpan di perangkat.
   ⚠️ **Jangan** dibuka langsung dari dalam aplikasi Drive — Drive Android tidak
   menjalankan berkas HTML dari awan.
3. Di HP: buka aplikasi **Files** (pengelola berkas) → cari berkas yang sudah
   diunduh → **Buka dengan Chrome**.
4. Agar bisa dibuka lagi tanpa Drive: **pindahkan berkasnya** dari folder unduhan
   Drive ke folder biasa (mis. `Documents/PetaDunia/`) supaya tidak terhapus
   otomatis dan mudah dibuka lewat pintasan Chrome.

⚠️ Kalau yang dikirim hanya `index.html`, css/js **tidak ikut** ⇒ tampilan rusak
(sama seperti catatan di `tools/buat-1-berkas.js` milik ANodes). Karena itu versi
**satu berkas** tetap diperlukan untuk cara apa pun.

### 6.6 Tata letak Git & GitHub Pages (disiapkan 8 Okt 2026)

```
C:\data\Peta dunia\        ← AKAR repostori Git
├── .git/                  ← dibuat: git init -b main
├── .gitignore             ← backups/ · catat/ · unggah-ke-github.zip diabaikan
├── .nojekyll              ← agar GitHub tidak memproses berkas dengan Jekyll
├── unggah-ke-github.zip   ← berkas siap-unggah (isi commit HEAD, 22 berkas)
├── app/                   ← APLIKASI (index.html + css/ + js/)
├── agents.md · catatanAI.md · CHANGELOG.md · panduan.md · prompt.md ·
│   rencanakerja.md
├── backups/               ← ❌ tidak diunggah (104 MB) · tetap utuh di komputer
└── catat/                 ← ❌ tidak diunggah (79 MB) · tetap utuh di komputer
```

| Butir | Keterangan |
|-------|-----------|
| Alamat aplikasi | `https://<nama-akun>.github.io/petadunia/app/index.html` |
| Cara memasang | unggah `unggah-ke-github.zip` → *Add file → Upload files* (GitHub membuka ZIP sendiri) |
| Cabang | `main` (repo kosong langsung dibuat dengan `git init -b main`) |
| Login saat `git push` | memakai **Git Credential Manager** (sudah tersedia) → izin lewat jendela peramban |
| Isi repo | 22 berkas: 14 aplikasi + 6 dokumen + `.gitignore` + `.nojekyll` |
| Kunci API | **tidak ada** di dalam repo — sisa hanya contoh karangan `a1b2c3d4-…` |

⚠️ **Jangan** menghapus dua baris `backups/` dan `catat/` dari `.gitignore`
kecuali memang ingin mengunggah 183 MB arsip.
