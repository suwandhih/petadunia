/* ============================================================
   Kategori: Hujan
   Sumber  : RainViewer — radar hujan bergerak (CORS `*`)

   Cara kerja
   ----------
   1) Ambil daftar 13 citra radar terakhir dari API RainViewer.
   2) Tiap citra punya alamat ubin sendiri. Gambar ditukar memakai
      sumber.setTiles() supaya ubin yang masih dipakai tidak diambil
      ulang — ini menghemat permintaan ke peladen.
   3) Waktu berjalan maju-mundur seperti animasi cuaca, sehingga
      gerak hujan terlihat.

   Batas peladen (hasil uji 7 Okt 2026)
   ------------------------------------
   - RainViewer membatasi 500 permintaan per 60 detik per alamat IP.
     Karena itu zoom dibatasi 7 (ubin 512 px) supaya satu layar hanya
     mengambil sedikit ubin, dan citra yang sama tidak diminta ulang.
   - Ubin punya `cache-control: max-age=172800` (2 hari), jadi citra
     lama tersimpan di cache peramban dan tidak dihitung ulang.
   - Bila batas itu tetap terlampaui, hujan akan berlubang. Kategori
     ini memeriksa sendiri tiap 30 detik dan memberi tahu di layar,
     supaya tampilan tidak pernah menipu.

   Cakupan
   -------
   Hanya wilayah yang terpantau jaringan radar punya gambar. Wilayah
   tanpa radar (termasuk sebagian besar lautan) tampak kosong — itu
   berarti "tidak terpantau", bukan "tidak hujan".
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const API = 'https://api.rainviewer.com/public/weather-maps.json';
  const UBIN = 'https://tilecache.rainviewer.com';
  const LEBAR_UBIN = 512;    /* resolusi lebih halus, jumlah ubin sama */
  const RESOLUSI = 4;        /* 4 = skema warna resmi RainViewer */
  const HALUS = 1;
  const MAKS_ZOOM = 7;       /* penjaga batas 500 permintaan/menit */
  const JEDA_LANGKAH = 480;  /* milidetik tiap langkah waktu */
  const MAKS_RANGKA = 13;
  const JEDA_PERIKSA = 30000;

  let rangka = [];
  let idx = 0;
  let arah = -1;
  let akhirLangkah = 0;
  let jamJalan = '—';
  let pesan = '';
  let lapisan = null;
  let pemeriksa = null;
  let sedangPeriksa = false;

  function alamat(p) {
    return UBIN + p + '/' + LEBAR_UBIN + '/{z}/{x}/{y}/' + RESOLUSI + '/' + HALUS + '_1.png';
  }

  function waktuJam(unix) {
    try {
      return new Date(unix * 1000).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '—';
    }
  }

  function terapkan() {
    const f = rangka[idx];
    if (!f || !lapisan) return;
    jamJalan = waktuJam(f.waktu);
    lapisan.gantiUbin([alamat(f.path)]);
  }

  /* Uji satu ubin di titik tengah layar. Sekali per 30 detik saja,
     sehingga tidak ikut membebani batas permintaan. */
  async function ujiRadar() {
    if (sedangPeriksa || !PD.peta || !rangka.length) return;
    sedangPeriksa = true;
    try {
      const b = PD.peta.getCenter();
      const z = Math.max(0, Math.min(MAKS_ZOOM, Math.round(PD.peta.getZoom())));
      const n = Math.pow(2, z);
      const x = Math.floor(((b.lng + 180) / 360) * n);
      const r = (b.lat * Math.PI) / 180;
      const y = Math.floor(
        ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n
      );
      const u = alamat(rangka[idx].path)
        .replace('{z}', z)
        .replace('{x}', x)
        .replace('{y}', y);
      const res = await fetch(u);
      pesan = res.ok ? '' : 'Radar tidak bisa diambil (HTTP ' + res.status + ')';
    } catch (e) {
      pesan = 'Radar tidak bisa dihubungi';
    }
    sedangPeriksa = false;
  }

  function bangun() {
    lapisan = A.lapisan('hujan', {
      url: '',
      tileSize: LEBAR_UBIN,
      opacity: 0.85,
      maxzoom: MAKS_ZOOM,
      attribution: 'Radar: RainViewer'
    });
    terapkan();
    lapisan.pasang();   /* tabah: memasang sendiri begitu gaya peta siap */
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'hujan',
    nama: 'Hujan',
    ikon: '🌧️',
    ket: 'Radar RainViewer · bergerak',
    jeda: 600000,

    muat: async function () {
      const j = await A.ambil(API);
      const lalu = (j.radar && j.radar.past) || [];
      rangka = lalu.slice(-MAKS_RANGKA).map(function (f) {
        return { waktu: f.time, path: f.path };
      });
      if (!rangka.length) throw new Error('data radar hujan kosong');

      /* mulai dari citra terbaru, lalu berjalan mundur */
      idx = rangka.length - 1;
      arah = -1;
    },

    segarkan: async function () {
      try {
        const j = await A.ambil(API);
        const lalu = (j.radar && j.radar.past) || [];
        if (!lalu.length) return;
        const baru = lalu.slice(-MAKS_RANGKA).map(function (f) {
          return { waktu: f.time, path: f.path };
        });
        const kunciBaru = baru.map(function (f) { return f.path; }).join('|');
        const kunciLama = rangka.map(function (f) { return f.path; }).join('|');
        if (kunciBaru === kunciLama) return;
        const diUjung = idx >= rangka.length - 1;
        rangka = baru;
        if (idx >= rangka.length) idx = rangka.length - 1;
        if (diUjung) idx = rangka.length - 1;
        terapkan();
      } catch (e) {
        PD.setStatus('hujan: gagal menyegarkan radar');
      }
    },

    nyalakan: function () {
      if (!rangka.length) throw new Error('data radar belum siap');
      bangun();
      ujiRadar();
      pemeriksa = setInterval(ujiRadar, JEDA_PERIKSA);
    },

    matikan: function () {
      clearInterval(pemeriksa);
      pemeriksa = null;
      if (lapisan) {
        lapisan.hentikan();
        lapisan = null;
      }
      jamJalan = '—';
    },

    gambar: function () {
      if (!rangka.length || !lapisan) return;

      /* gerak maju-mundur seperti animasi cuaca */
      const kini = performance.now();
      if (!akhirLangkah) akhirLangkah = kini;
      if (kini - akhirLangkah >= JEDA_LANGKAH) {
        akhirLangkah = kini;
        idx += arah;
        if (idx >= rangka.length - 1) { idx = rangka.length - 1; arah = -1; }
        if (idx <= 0) { idx = 0; arah = 1; }
        terapkan();
      }

      const terbaru = idx >= rangka.length - 1;
      const mundur = Math.round(
        (rangka[rangka.length - 1].waktu - rangka[idx].waktu) / 60
      );

      let tambahan;
      let warna;
      if (pesan) {
        tambahan = pesan;
        warna = 'merah';
      } else if (terbaru) {
        tambahan = 'Citra paling baru';
        warna = 'hijau';
      } else {
        tambahan = 'Animasi mundur ' + mundur + ' menit';
        warna = 'kuning';
      }

      PD.ringkas(
        'hujan',
        jamJalan + ' WIB · citra ke-' + (idx + 1) + ' dari ' + rangka.length,
        tambahan,
        warna
      );
    },

    klik: function () {
      PD.tampilkanInfo(
        A.info('🌧️', 'Radar hujan RainViewer', [
          ['Waktu citra', jamJalan + ' WIB'],
          ['Citra tersedia', rangka.length + ' langkah'],
          ['Cakupan', 'Hanya wilayah yang terpantau radar'],
          ['Wilayah kosong', 'Tidak terpantau atau tidak ada hujan'],
          ['Keadaan', pesan || 'Terhubung']
        ])
      );
      return true;
    }
  });
})();