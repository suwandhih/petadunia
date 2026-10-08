/* ============================================================
   Kategori: Angin — arah & kecepatan angin permukaan
   Sumber: Open-Meteo (punya CORS)
   Animasi: partikel mengalir mengikuti arah angin + panah di titik ukur
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const SUMBER = 'https://api.open-meteo.com/v1/forecast';

    /* Cadangan. Server utama Open-Meteo membatasi jumlah permintaan per hari
       ("Daily API request limit exceeded" — diuji 7 Okt 2026), dan pembatasan itu
       berlangsung sampai besok. Percobaan membuka permintaan itu dari alamat yang
       berbeda TIDAK menolong: jatahnya dihitung per jaringan (IP). Karena itu
       dipakai server Open-Meteo yang lain — datanya sama, hanya alamatnya beda.
       Bila server utama pulih, ia dipakai lagi. */
    const SUMBER_CADANGAN = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

    const KOLOM = 16;
    const BARIS = 12;
    const MAKS_TITIK = 300;
    /* Bila server utama sudah terbukti kehabisan jatah HARI INI, jangan dihubungi
       lagi hari ini — hemat permintaan dan tidak membuat galat berulang. */
    const KUNCI_LELAH = 'pd_angin_utama_lelah';

    function hariIni() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function bacaLelah() {
      try {
        return localStorage.getItem(KUNCI_LELAH) === hariIni();
      } catch (e) {
        return false;
      }
    }

    function catatLelah() {
      try {
        localStorage.setItem(KUNCI_LELAH, hariIni());
      } catch (e) {
        /* diabaikan */
      }
    }

  let kisi = null;          /* { barat, timur, selatan, utara, kolom, baris, titik[] } */
  let partikel = [];
  let layar = [];
  let terakhirAmbil = 0;
  let sedangAmbil = false;
  let kanvasTrail = null;
  let ctxTrail = null;
    /* Pesan gagal yang sudah dimengerti Bapak (bukan pesan teknis server). */
    let pesanGagal = '';
    /* Benar bila data terakhir diambil dari server cadangan. */
    let pakaiCadangan = false;

  /* ---------- warna menurut kecepatan angin (km/jam) ---------- */
  function warnaAngin(kmh) {
    if (kmh >= 90) return '#ff3b30';
    if (kmh >= 62) return '#ff9f1c';
    if (kmh >= 40) return '#ffd166';
    if (kmh >= 24) return '#7ee787';
    if (kmh >= 12) return '#38bdf8';
    return '#8b9bb0';
  }

  function sebutanAngin(kmh) {
    if (kmh >= 118) return 'badai hebat';
    if (kmh >= 90) return 'badai';
    if (kmh >= 62) return 'angin kencang';
    if (kmh >= 40) return 'sedang';
    if (kmh >= 24) return 'sepoi kuat';
    if (kmh >= 12) return 'sepoi';
    return 'lemah';
  }

  /* arah angin: dari mana angin bertiup (derajat) → nama mata angin */
  function mataAngin(derajat) {
    const arah = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
    return arah[Math.round(((derajat % 360) + 360) % 360 / 45) % 8];
  }

  /* ---------- ambil data angin untuk wilayah yang terlihat ---------- */
  async function ambilAngin() {
    const peta = PD.peta;
    if (!peta) return;
      try {
        await ambilAnginDalam();
        pesanGagal = '';
      } catch (e) {
        const t = String(e);
        /* Open-Meteo membatasi jumlah permintaan; bahasa biasa supaya Bapak
           tahu apa yang sedang terjadi (aturan F18). Kegagalan TIDAK
           digagalkan ke atas: kategori tetap menyala dan mencoba lagi,
           sambil berkata jujur lewat ringkasan. */
        pesanGagal =
                t.indexOf('429') >= 0
                  ? 'Open-Meteo kehabisan jatah harian — dicoba lagi nanti'
                  : t.indexOf('408') >= 0 || t.indexOf('batas waktu') >= 0
                    ? 'Open-Meteo tidak menjawab (waktu habis) — coba lagi'
                    : 'data angin gagal diambil';
      }
    }

    async function ambilAnginDalam() {
      const peta = PD.peta;
      if (!peta) return;

    const b = peta.getBounds();
    let barat = Math.max(-180, b.getWest() - 4);
    let timur = Math.min(180, b.getEast() + 4);
    let selatan = Math.max(-85, b.getSouth() - 4);
    let utara = Math.min(85, b.getNorth() + 4);
    if (timur <= barat) { barat = -180; timur = 180; }
    if (utara <= selatan) { selatan = -85; utara = 85; }

    const kolom = KOLOM;
    const baris = BARIS;
    const lat = [];
    const lon = [];
    for (let j = 0; j < baris; j++) {
      for (let i = 0; i < kolom; i++) {
        lon.push(+(barat + ((timur - barat) * i) / (kolom - 1)).toFixed(3));
        lat.push(+(selatan + ((utara - selatan) * j) / (baris - 1)).toFixed(3));
      }
    }
    if (lat.length > MAKS_TITIK) return;

    const kueri =
      '?latitude=' + lat.join(',') +
      '&longitude=' + lon.join(',') +
      '&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m';

        /* Coba server utama dulu; bila jatahnya sedang habis, pindah ke server
           cadangan supaya animasi angin tetap bisa dijalankan. Bila server utama
           sudah terbukti kehabisan jatah hari ini, ia dilewati sama sekali. */
        let j = null;
        let galatTerakhir = null;
        const urutan = bacaLelah() ? [SUMBER_CADANGAN] : [SUMBER, SUMBER_CADANGAN];
        for (const dasar of urutan) {
          try {
            j = await A.ambil(dasar + kueri);
            pakaiCadangan = dasar === SUMBER_CADANGAN;
            if (pakaiCadangan) catatLelah();
            break;
          } catch (e) {
            galatTerakhir = e;
            /* jatah habis (429) = keadaan hari ini, bukan gangguan sesaat */
            if (dasar === SUMBER && String(e).indexOf('429') >= 0) catatLelah();
          }
        }
        if (j === null) throw galatTerakhir || new Error('data angin gagal diambil');

        const daftar = Array.isArray(j) ? j : [j];
        if (daftar.length !== lat.length) throw new Error('jumlah data angin tidak cocok');

    const titik = [];
    for (let k = 0; k < daftar.length; k++) {
      const c = daftar[k].current;
      if (!c) continue;
      titik.push({
        lon: lon[k],
        lat: lat[k],
        cepat: c.wind_speed_10m,
        arah: c.wind_direction_10m,
        hembus: c.wind_gusts_10m
      });
    }

    kisi = {
      barat: barat, timur: timur, selatan: selatan, utara: utara,
      kolom: kolom, baris: baris, titik: titik
    };
    terakhirAmbil = Date.now();
    sebarPartikel();
  }

  /* ---------- hitung vektor angin dalam ruang layar ---------- */
  function vektorLayar(t) {
    /* arah angin = dari mana angin datang, jadi vektor tiup dibalik */
    const rad = ((t.arah + 180) * Math.PI) / 180;
    const u = Math.sin(rad);   /* ke timur */
    const v = Math.cos(rad);   /* ke utara */
    const p = PD.peta.project([t.lon, t.lat]);
    const p2 = PD.peta.project([t.lon + 0.5, t.lat + 0.5]);
    const sx = (p2.x - p.x) / 0.5;   /* piksel per derajat bujur */
    const sy = (p2.y - p.y) / 0.5;   /* piksel per derajat lintang */
    return { x: u * sx, y: -v * sy, cepat: t.cepat, arah: t.arah, hembus: t.hembus };
  }

  /* ---------- ambil vektor angin pada posisi layar (interpolasi) ---------- */
  function anginDi(x, y) {
    if (!kisi || !kisi.titik.length) return null;
    const peta = PD.peta;
    const ll = peta.unproject([x, y]);
    const fx = ((ll.lng - kisi.barat) / (kisi.timur - kisi.barat)) * (kisi.kolom - 1);
    const fy = ((ll.lat - kisi.selatan) / (kisi.utara - kisi.selatan)) * (kisi.baris - 1);
    if (fx < 0 || fy < 0 || fx > kisi.kolom - 1 || fy > kisi.baris - 1) return null;

    const i0 = Math.min(kisi.kolom - 2, Math.floor(fx));
    const j0 = Math.min(kisi.baris - 2, Math.floor(fy));
    const tx = fx - i0;
    const ty = fy - j0;

    const ambil = (i, j) => kisi.titik[j * kisi.kolom + i];
    const a = ambil(i0, j0);
    const b = ambil(i0 + 1, j0);
    const c = ambil(i0, j0 + 1);
    const d = ambil(i0 + 1, j0 + 1);
    if (!a || !b || !c || !d) return null;

    const campur = (kunci) =>
      (a[kunci] * (1 - tx) + b[kunci] * tx) * (1 - ty) +
      (c[kunci] * (1 - tx) + d[kunci] * tx) * ty;

    const cepat = campur('cepat');
    const arah = campur('arah');
    const hembus = campur('hembus');

    const rad = ((arah + 180) * Math.PI) / 180;
    const u = Math.sin(rad);
    const v = Math.cos(rad);
    const p = PD.peta.project([ll.lng, ll.lat]);
    const p2 = PD.peta.project([ll.lng + 0.5, ll.lat + 0.5]);
    const sx = (p2.x - p.x) / 0.5;
    const sy = (p2.y - p.y) / 0.5;
    return { x: u * sx, y: -v * sy, cepat: cepat, arah: arah, hembus: hembus };
  }

  /* ---------- partikel ---------- */
  function sebarPartikel() {
    const n = Math.min(1400, Math.round((innerWidth * innerHeight) / 1100));
    partikel = [];
    for (let i = 0; i < n; i++) {
      partikel.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        umur: Math.random() * 90,
        maks: 60 + Math.random() * 90
      });
    }
  }

  function siapkanTrail() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(innerWidth * dpr);
    const h = Math.round(innerHeight * dpr);
    if (!kanvasTrail) {
      kanvasTrail = document.createElement('canvas');
      ctxTrail = kanvasTrail.getContext('2d');
    }
    if (kanvasTrail.width !== w || kanvasTrail.height !== h) {
      kanvasTrail.width = w;
      kanvasTrail.height = h;
      ctxTrail.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxTrail.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  /* ---------- gambar ---------- */
  function gambar(ctx, dt, waktu) {
    layar = [];
      if (!kisi || !kisi.titik.length) {
        /* Tidak ada data sama sekali: katakan apa adanya, jangan biarkan peta
           tampak "diam tanpa sebab" (aturan F8: jangan mengarang). */
        PD.ringkas('angin', 'belum ada data angin', pesanGagal || 'sedang memuat…', 'merah');
        return;
      }

    siapkanTrail();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* pudarkan jejak lama */
    ctxTrail.globalCompositeOperation = 'destination-out';
    ctxTrail.fillStyle = 'rgba(0,0,0,0.055)';
    ctxTrail.fillRect(0, 0, innerWidth, innerHeight);
    ctxTrail.globalCompositeOperation = 'source-over';

    /* gerakkan partikel */
    ctxTrail.lineWidth = 1.15;
    ctxTrail.lineCap = 'round';
    for (const p of partikel) {
      const a = anginDi(p.x, p.y);
      if (!a) {
        p.x = Math.random() * innerWidth;
        p.y = Math.random() * innerHeight;
        p.umur = 0;
        continue;
      }
      const laju = Math.min(a.cepat, 120) * 0.42;
      const nx = p.x + a.x * laju * dt;
      const ny = p.y + a.y * laju * dt;

      ctxTrail.strokeStyle = warnaAngin(a.cepat);
      ctxTrail.globalAlpha = 0.75;
      ctxTrail.beginPath();
      ctxTrail.moveTo(p.x, p.y);
      ctxTrail.lineTo(nx, ny);
      ctxTrail.stroke();

      p.x = nx;
      p.y = ny;
      p.umur += dt;

      if (p.umur > p.maks || p.x < -20 || p.y < -20 || p.x > innerWidth + 20 || p.y > innerHeight + 20) {
        p.x = Math.random() * innerWidth;
        p.y = Math.random() * innerHeight;
        p.umur = 0;
        p.maks = 60 + Math.random() * 90;
      }
    }
    ctxTrail.globalAlpha = 1;

    /* tempelkan jejak ke kanvas utama */
    ctx.drawImage(kanvasTrail, 0, 0, innerWidth, innerHeight);

    /* panah di titik ukur */
    let tercepat = 0;
    let jumlah = 0;
    for (const t of kisi.titik) {
      const p = PD.layar(t.lon, t.lat);
      if (!p) continue;
      if (p.x < -30 || p.y < -30 || p.x > innerWidth + 30 || p.y > innerHeight + 30) continue;
      jumlah++;
      if (t.cepat > tercepat) tercepat = t.cepat;

      const v = vektorLayar(t);
      const panjang = Math.hypot(v.x, v.y);
      if (panjang < 0.0001) continue;
      const px = v.x / panjang;
      const py = v.y / panjang;
      const L = 7 + Math.min(t.cepat, 100) * 0.11;
      const warna = warnaAngin(t.cepat);

      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = warna;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x - px * L, p.y - py * L);
      ctx.lineTo(p.x + px * L, p.y + py * L);
      ctx.stroke();

      /* ujung panah */
      ctx.beginPath();
      ctx.moveTo(p.x + px * L, p.y + py * L);
      ctx.lineTo(p.x + px * L - px * 4 - py * 3, p.y + py * L - py * 4 + px * 3);
      ctx.lineTo(p.x + px * L - px * 4 + py * 3, p.y + py * L - py * 4 - px * 3);
      ctx.closePath();
      ctx.fillStyle = warna;
      ctx.fill();
      ctx.globalAlpha = 1;

      layar.push({ x: p.x, y: p.y, r: 14, t: t });
    }

    PD.ringkas(
      'angin',
      jumlah + ' titik ukur angin · tercepat ' + PD.angka(tercepat, 0) + ' km/jam',
          pakaiCadangan
            ? 'Sumber utama Open-Meteo kehabisan jatah — sedang memakai server cadangan'
            : tercepat >= 62
              ? 'Ada angin kencang — waspada penyebaran api'
              : null,
          tercepat >= 90 ? 'merah' : tercepat >= 62 ? 'jingga' : pakaiCadangan ? 'kuning' : null
    );
  }

  /* ---------- kartu rincian ---------- */
  function kartu(t) {
    return A.info('💨', 'Angin Permukaan', [
      ['Kecepatan', PD.angka(t.cepat, 1) + ' km/jam — ' + sebutanAngin(t.cepat)],
      ['Hembusan', PD.angka(t.hembus, 1) + ' km/jam'],
      ['Arah datang', mataAngin(t.arah) + ' (' + PD.angka(t.arah, 0) + '°)'],
      ['Bertiup ke', mataAngin(t.arah + 180)],
      ['Koordinat', PD.angka(t.lat, 3) + ', ' + PD.angka(t.lon, 3)]
    ]);
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'angin',
    nama: 'Angin',
    ikon: '💨',
    ket: 'Open-Meteo · arah & kecepatan',
        jeda: 600000,

        muat: async function () {
          /* Kegagalan sementara (mis. Open-Meteo membatasi permintaan) sengaja
             TIDAK menggagalkan kategori: biarkan tetap menyala, katakan apa
             adanya di ringkasan, dan coba lagi pada penjadwalan berikutnya. */
          await ambilAngin();
        },

    segarkan: async function () {
          try {
            await ambilAngin();
                PD.setStatus(pakaiCadangan
                  ? 'angin: diperbarui dari server cadangan (jatah server utama habis)'
                  : 'angin: data diperbarui');
              } catch (e) {
                PD.setStatus('angin: ' + (pesanGagal || 'gagal menyegarkan'));
              }
            },

    pasang: function () {
      const L = this;
      if (L._geser) return;
      L._geser = function () {
        clearTimeout(L._tunda);
        L._tunda = setTimeout(async function () {
          if (sedangAmbil) return;
          if (Date.now() - terakhirAmbil < 5000) return;
          sedangAmbil = true;
          try { await ambilAngin(); } catch (e) { /* lewati */ }
          sedangAmbil = false;
        }, 1200);
      };
      PD.peta.on('moveend', L._geser);
      addEventListener('resize', sebarPartikel);
    },

    matikan: function () {
      if (this._geser) {
        PD.peta.off('moveend', this._geser);
        this._geser = null;
      }
      clearTimeout(this._tunda);
      removeEventListener('resize', sebarPartikel);
      if (kanvasTrail) {
        ctxTrail.clearRect(0, 0, innerWidth, innerHeight);
      }
    },

    gambar: gambar,

    klik: function (x, y) {
      const d = A.bidik(layar, x, y, 18);
      if (!d) return false;
      PD.tampilkanInfo(kartu(d.t));
      return true;
    }
  });
})();
