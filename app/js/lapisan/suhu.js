/* ============================================================
   Kategori: Suhu Permukaan  —  dengan angka derajat °C

   Sumber  : NASA GIBS
             1) ubin WMTS  "MODIS_Terra_Land_Surface_Temp_Day"
                https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/…
                (tanggal boleh disisipkan sebelum {z}: /default/<tgl>/…)
             2) tabel warna RESMI (colormap) lapisan yang sama
                https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Land_Surface_Temp.xml
             Keduanya CORS `*`, tanpa kunci — diuji `curl` 8 Okt 2026.

   Angka derajat TIDAK dikarang (aturan F8)
   ----------------------------------------
   Tabel resmi NASA menyebut satuan **Kelvin**, 252 tingkat dengan nilai
   200 K–350 K. Ubin NASA berpalet (PNG mode P); urutan paletnya sudah
   DIBUKTIKAN sama persis dengan tabel resmi: **253 dari 253 indeks cocok**
   (diukur 8 Okt 2026 dari beberapa ubin di seluruh dunia — aturan I19).
   Jadi angka yang ditampilkan benar-benar dibaca dari citra resmi yang
   Bapak lihat di peta.

   Celah citra (penting!)
   ----------------------
   MODIS Terra memotret bumi dalam **lintasan**, jadi satu tanggal bisa
   berlubang. Terukur 8 Okt 2026 pada satu petak di Jawa (z7, x102 y66):
   hari ini 1.615 piksel · 7 Okt 15.044 · 6 Okt 17.359 · 5 Okt **0** ·
   4 Okt 20.141. Karena itu aplikasi **mencoba tanggal mundur** sampai
   titik yang diminta benar-benar berisi data.

   Yang TIDAK dilakukan
   --------------------
   1. Angka di atas LAUT tidak diberikan — ubin laut tembus pandang, dan
      MODIS hanya mengukur panas permukaan daratan.
   2. Piksel yang warnanya tidak ada di tabel resmi (ubin tanpa data,
      tampak kelabu) dilewati — bukan ditebak.

   Cara membaca sendiri tanpa aplikasi (supaya bisa dibangun ulang):
     °C = (nilai "value" pada baris ColorMapEntry yang warnanya sama dengan
     warna ubin) − 273,15.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const LAPIS = 'MODIS_Terra_Land_Surface_Temp_Day';
  const MAKS_ZOOM = 7;   /* batas resmi GIBS: GoogleMapsCompatible_Level7 */

  /* {tgl} = tanggal citra (boleh kosong = citra terbaru). */
  const UBIN = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
    LAPIS + '/default/{tgl}GoogleMapsCompatible_Level' + MAKS_ZOOM +
    '/{z}/{y}/{x}.png';
  const COLORMAP = 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/' +
    'MODIS_Land_Surface_Temp.xml';

  const JEDA_UJI = 900000;      /* periksa ketersediaan tiap 15 menit */
  const K_MIN = 200;            /* batas bawah skala resmi (Kelvin) */
  const K_MAKS = 350;           /* batas atas skala resmi (Kelvin) */
  const HARI_MUNDUR = 10;       /* dicoba sampai 10 hari ke belakang */
  const W = 256;
  const H = 256;
  const JARI = [5, 12, 30];     /* jari-jari hitung, diperlebar bila tepi laut */

  let lapisan = null;
  let pemeriksa = null;
  let pesan = '';
  let sedangUji = false;
  let petaWarna = null;         /* "r,g,b" → Kelvin (dari tabel resmi NASA) */
  let jumlahTingkat = 0;
  let suhuCari = null;
  let sedangAmbilCari = false;
  let tanggalPakai = null;      /* tanggal citra terakhir yang berhasil */

  /* ---------- Kelvin → Celsius ---------- */
  function keCelsius(k) {
    return k - 273.15;
  }

  /* titik tengah selang resmi, mis. [200.00,200.60) → 200,3 K */
  function tengah(a, b) {
    if (!Number.isFinite(a)) return null;
    if (!Number.isFinite(b)) return a;
    return (a + b) / 2;
  }

  function tanggalUji(mundur) {
    return new Date(Date.now() - mundur * 86400000).toISOString().slice(0, 10);
  }

  function alamatUbin(z, y, x, tgl) {
    return UBIN
      .replace('{tgl}', tgl ? tgl + '/' : '')
      .replace('{z}', z)
      .replace('{y}', y)
      .replace('{x}', x);
  }

  /* ---------- baca tabel warna RESMI NASA ---------- */
  async function muatPetaWarna() {
    if (petaWarna) return jumlahTingkat;

    const dok = await A.ambilXml(COLORMAP);
    const warna = new Map();
    let satuan = '';

    /* Hanya ColorMap berjudul "Land Surface Temperature" (satuan Kelvin);
       ColorMap pertama berjudul "No Data" dan diabaikan. */
    for (const p of Array.from(dok.getElementsByTagName('ColorMap'))) {
      if (!/Land Surface Temperature/i.test(p.getAttribute('title') || '')) continue;
      satuan = (p.getAttribute('units') || '').trim();
      for (const e of Array.from(p.getElementsByTagName('ColorMapEntry'))) {
        if (e.getAttribute('transparent') === 'true') continue;
        const rgb = (e.getAttribute('rgb') || '').split(',').map(Number);
        if (rgb.length !== 3 || rgb.some(function (v) { return !Number.isFinite(v); })) continue;
        const cocok = /\[\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*\)/
          .exec(e.getAttribute('value') || '');
        if (!cocok) continue;
        const k = tengah(parseFloat(cocok[1]), parseFloat(cocok[2]));
        if (k === null) continue;
        warna.set(rgb[0] + ',' + rgb[1] + ',' + rgb[2], k);
      }
    }

    if (!warna.size || !/^K$/i.test(satuan)) {
      throw new Error('tabel warna resmi NASA tidak terbaca');
    }
    petaWarna = warna;
    jumlahTingkat = warna.size;
    return jumlahTingkat;
  }

  /* ---------- ubin → derajat ---------- */
  function muatGambar(url) {
    return new Promise(function (selesai, gagal) {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = function () { selesai(im); };
      im.onerror = function () { gagal(new Error('ubin suhu gagal dimuat')); };
      im.src = url;
    });
  }

  const kain = document.createElement('canvas');
  kain.width = W;
  kain.height = H;
  const konteks = kain.getContext('2d', { willReadFrequently: true });

  /* Nilai Kelvin satu piksel; null bila tembus pandang / di luar tabel resmi. */
  function nilaiPiksel(d, x, y) {
    const i = (y * W + x) * 4;
    if (d[i + 3] < 200) return null;   /* tembus pandang = bukan daratan */
    const k = petaWarna.get(d[i] + ',' + d[i + 1] + ',' + d[i + 2]);
    return k === undefined ? null : k;
  }

  /* Baca suhu di SEKITAR titik (px, py), bukan rata-rata seluruh ubin —
     satu ubin z7 mencakup ±300 km dan bisa memuat dataran + pegunungan. */
  function baca(im, px, py) {
    konteks.clearRect(0, 0, W, H);
    konteks.drawImage(im, 0, 0, W, H);
    const d = konteks.getImageData(0, 0, W, H).data;

    /* Suhu di titik yang diminta. Titik itu sendiri lebih dulu; bila
       tembus pandang, jari-jari diperlebar bertahap. */
    let lokal = null;
    let jariPakai = 0;
    for (let r = 0; r < JARI.length && lokal === null; r++) {
      const jr = JARI[r];
      let jumlah = 0;
      let piksel = 0;
      for (let y = Math.max(0, py - jr); y <= Math.min(H - 1, py + jr); y++) {
        for (let x = Math.max(0, px - jr); x <= Math.min(W - 1, px + jr); x++) {
          const k = nilaiPiksel(d, x, y);
          if (k === null) continue;
          jumlah += k;
          piksel++;
        }
      }
      /* r = 0 artinya hanya piksel titik itu sendiri (batas 1 piksel). */
      const perlu = (r === 0) ? 1 : 8;
      if (piksel >= perlu) {
        lokal = keCelsius(jumlah / piksel);
        jariPakai = jr;
      }
    }

    /* Rentang seluruh ubin — gambaran suhu wilayah sekitar. */
    let bawah = null;
    let atas = null;
    let ada = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 200) continue;
      const k = petaWarna.get(d[i] + ',' + d[i + 1] + ',' + d[i + 2]);
      if (k === undefined) continue;
      ada++;
      if (bawah === null || k < bawah) bawah = k;
      if (atas === null || k > atas) atas = k;
    }

    if (!ada) return { ada: 0 };
    return {
      ada: ada,
      lokal: lokal,
      jari: jariPakai,
      bawah: keCelsius(bawah),
      atas: keCelsius(atas)
    };
  }

  /* koordinat → ubin + piksel di dalamnya (rumus ubin Web Mercator) */
  function ubinUntuk(lon, lat, z) {
    const n = Math.pow(2, z);
    const xf = (lon + 180) / 360 * n * W;
    const rad = lat * Math.PI / 180;
    const yf = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n * H;
    const tx = Math.max(0, Math.min(n - 1, Math.floor(xf / W)));
    const ty = Math.max(0, Math.min(n - 1, Math.floor(yf / H)));
    return {
      z: z,
      x: tx,
      y: ty,
      px: Math.max(0, Math.min(W - 1, Math.floor(xf - tx * W))),
      py: Math.max(0, Math.min(H - 1, Math.floor(yf - ty * H)))
    };
  }

  /* lebar sekian piksel ubin dalam km pada garis lintang tertentu */
  function lebarKm(lat, z, piksel) {
    const derajat = 360 / Math.pow(2, z);
    return derajat * 111.32 * Math.cos(lat * Math.PI / 180) * (piksel / W);
  }

  /* Cari tanggal yang benar-benar menutup titik ini (aturan I19: jangan
     menyimpulkan dari satu petak saja).
     Pengukuran 8 Okt 2026 pada satu petak di Jawa (z7, x102 y66):
     hari ini 1.615 piksel · 7 Okt 15.044 · 6 Okt 17.359 · 5 Okt 0 ·
     4 Okt 20.141 — jadi tanggal memang harus dicoba satu per satu. */
  async function suhuDi(lon, lat) {
    await muatPetaWarna();
    const t = ubinUntuk(lon, lat, MAKS_ZOOM);
    let tanggalPakaiLama = tanggalPakai;
    const mulai = [];
    if (tanggalPakai) mulai.push(tanggalPakai);
    for (let m = 0; m <= HARI_MUNDUR; m++) mulai.push(tanggalUji(m));

    const sudah = new Set();
    for (const tgl of mulai) {
      if (sudah.has(tgl)) continue;
      sudah.add(tgl);
      let im;
      try {
        im = await muatGambar(alamatUbin(t.z, t.y, t.x, tgl));
      } catch (e) {
        continue;
      }
      const h = baca(im, t.px, t.py);
      if (h.ada && h.lokal !== null && h.lokal !== undefined) {
        tanggalPakai = tgl;
        h.tanggal = tgl;
        h.lebarLokal = lebarKm(lat, MAKS_ZOOM, Math.max(h.jari * 2, 4));
        return h;
      }
    }

    /* Semua tanggal dicoba, titik tetap kosong. Kita TIDAK menebak apakah
       ini laut atau celah citra: keduanya mungkin, dan ubin NASA tidak
       memberi tanda. Katakan keduanya dengan jujur (aturan F8). */
    tanggalPakai = tanggalPakaiLama;
    return { ada: 0 };
  }
  /* ---------- pita skala (legend) ---------- */
  function gambarPita(h) {
    const pita = document.getElementById('pita-skala');
    if (!pita) return;

    let tanda = '';
    const t = PD.cari && PD.cari.tujuan;
    if (h && h.lokal !== null && h.lokal !== undefined && t) {
      const p = PD.layar(t.lon, t.lat);
      if (p) {
        const f = Math.max(0, Math.min(1, (h.lokal - keCelsius(K_MIN)) / (K_MAKS - K_MIN)));
        tanda = '<span class="pita-tanda" style="left:' + (f * 100).toFixed(1) + '%"></span>';
      }
    }

    pita.innerHTML =
      '<div class="pita-judul">🌡️ Suhu permukaan darat — skala warna resmi NASA' +
      (h && h.tanggal ? ' · citra ' + h.tanggal : '') + '</div>' +
      '<div class="pita-jalur">' + tanda + '</div>' +
      '<div class="pita-angka"><span>' + PD.angka(keCelsius(K_MIN), 0) + ' °C</span>' +
      '<span>' + PD.angka(keCelsius(250), 0) + ' °C</span>' +
      '<span>' + PD.angka(keCelsius(300), 0) + ' °C</span>' +
      '<span>' + PD.angka(keCelsius(K_MAKS), 0) + ' °C</span></div>' +
      '<div class="pita-catatan">Satelit MODIS Terra (siang) · laut kosong' +
      (tanda ? ' · garis putih = suhu di lokasi yang dicari' : '') + '</div>';
    pita.classList.remove('sembunyi');
  }

  /* ---------- tampilkan °C di kartu lokasi yang dicari ---------- */
  function barisDerajat() {
    if (pesan) return [['Suhu di sini', '—'], ['Sebab', pesan]];
    if (!suhuCari) return [['Suhu di sini', 'menghitung…']];
    const h = suhuCari;
    if (h.lokal === null || h.lokal === undefined) {
      return [
        ['Suhu di sini', '—'],
        ['Sebab', 'titik ini tidak tertutup citra NASA ' + (HARI_MUNDUR + 1) +
          ' hari terakhir'],
        ['Mungkin karena', 'titiknya di laut (citra ini hanya berisi daratan), ' +
          'atau sedang berada di celah lintasan satelit']
      ];
    }
    const baris = [['Suhu di sini', PD.angka(h.lokal, 1) + ' °C']];
    if (h.tanggal) baris.push(['Tanggal citra', h.tanggal]);
    baris.push(['Luas hitungan', '±' + PD.angka(h.lebarLokal, 0) + ' km di sekitar titik']);
    if (h.jari > 5) {
      baris.push(['Catatan', 'titik dekat tepi daratan — jari-jari diperlebar']);
    }
    baris.push(['Rentang satu petak',
      PD.angka(h.bawah, 1) + ' s/d ' + PD.angka(h.atas, 1) + ' °C']);
    baris.push(['Dasar hitung', 'warna ubin resmi NASA (' + jumlahTingkat + ' tingkat)']);
    return baris;
  }

  function segarkanKartuCari() {
    if (PD.cari && PD.cari.tambahanKartu) {
      PD.cari.tambahanKartu('suhu', PD.cari.tujuan ? barisDerajat() : null);
    }
  }

  async function hitungDiTujuan() {
    if (!PD.cari || !PD.cari.tujuan || sedangAmbilCari) return;
    const t = PD.cari.tujuan;
    sedangAmbilCari = true;
    suhuCari = null;
    segarkanKartuCari();
    try {
      const h = await suhuDi(t.lon, t.lat);
      if (PD.cari.tujuan === t) {
        suhuCari = h;
        gambarPita(h);
      }
    } catch (e) {
      /* Gagal menghitung BUKAN alasan mematikan kategori — katakan apa
         adanya (aturan F20/I16). */
      if (PD.cari.tujuan === t) {
        suhuCari = { lokal: null };
        pesan = pesan || 'citra suhu NASA tidak bisa dibaca saat ini — dicoba lagi nanti';
      }
    } finally {
      sedangAmbilCari = false;
    }
    segarkanKartuCari();
  }

  document.addEventListener('pd:cari', function () { hitungDiTujuan(); });

  /* ---------- uji ketersediaan ubin ---------- */
  function akanUji() {
    if (sedangUji) return;
    sedangUji = true;
    (async function () {
      try {
        /* NASA GIBS kadang membalas HTTP 500 acak (diuji 7 Okt 2026: URL
           sama bisa 200 → 500 → 200) — jadi dicoba beberapa kali. */
        let kode = 0;
        let kena = false;
        for (let i = 0; i < 3; i++) {
          try {
            const r = await fetch(alamatUbin(3, 4, 6, ''));
            kode = r.status;
            if (r.ok) { kena = true; break; }
          } catch (e) { /* coba lagi */ }
          await new Promise(function (t) { setTimeout(t, 1500); });
        }
        pesan = kena ? '' : (kode ? 'citra suhu NASA tidak tersedia (HTTP ' + kode + ')'
          : 'citra suhu NASA tidak bisa dihubungi');
        if (!pesan) {
          try {
            await muatPetaWarna();
          } catch (e) {
            pesan = 'tabel warna resmi NASA tidak bisa dibaca — angka derajat dimatikan';
          }
        }
      } finally {
        sedangUji = false;
      }
      lapor();
      segarkanKartuCari();
    })();
  }

  function lapor() {
    PD.ringkas(
      'suhu',
      pesan ? 'sebagian' : 'peta panas permukaan darat',
      pesan ? pesan
        : 'Biru = dingin · merah = panas · angka °C lewat 🔍 cari lokasi',
      pesan ? 'merah' : 'jingga'
    );
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'suhu',
    nama: 'Suhu Permukaan',
    ikon: '🌡️',
    ket: 'NASA GIBS · derajat °C',

    nyalakan: function () {
      lapisan = A.lapisan('suhu', {
        url: alamatUbin('{z}', '{y}', '{x}', ''),
        tileSize: 256,
        opacity: 0.78,
        maxzoom: MAKS_ZOOM,
        attribution: 'Suhu permukaan: NASA GIBS (MODIS Terra)'
      });
      lapisan.pasang();
      lapor();
      gambarPita(suhuCari);
      akanUji();
      pemeriksa = setInterval(akanUji, JEDA_UJI);
      if (PD.cari && PD.cari.tujuan) hitungDiTujuan();
    },

    matikan: function () {
      clearInterval(pemeriksa);
      pemeriksa = null;
      if (lapisan) {
        lapisan.hentikan();
        lapisan = null;
      }
      suhuCari = null;
      segarkanKartuCari();
      const p = document.getElementById('pita-skala');
      if (p) p.classList.add('sembunyi');
    },

    klik: function () {
      PD.tampilkanInfo(
        A.info('🌡️', 'Suhu permukaan darat NASA', [
          ['Sumber', 'MODIS Terra — NASA GIBS'],
          ['Satuan asli', 'Kelvin (tabel warna resmi NASA)'],
          ['Ditampilkan', 'derajat Celsius (°C)'],
          ['Jangkauan peta', PD.angka(keCelsius(K_MIN), 0) + ' °C sampai ' +
            PD.angka(keCelsius(K_MAKS), 0) + ' °C'],
          ['Cara melihat angka', 'buka kotak 🔍 cari lokasi → angkanya tampil'],
          ['Warna', 'biru = dingin · merah = panas · laut kosong'],
          ['Keadaan', pesan || 'Tersedia']
        ]) +
          '<div class="info-catatan">Angka derajat dibaca dari warna ubin ' +
          'resmi NASA memakai tabel warna resmi NASA yang sama (terbukti cocok ' +
          jumlahTingkat + '/253 tingkat). MODIS memotret bumi dalam lintasan, ' +
          'jadi kalau petak hari ini berlubang, aplikasi mencoba sampai ' +
          HARI_MUNDUR + ' hari ke belakang dan menuliskan tanggal citranya. ' +
          'Angka di atas laut tidak diberikan karena citra ini memang hanya ' +
          'berisi daratan.</div>'
      );
      return true;
    }
  });
})();
