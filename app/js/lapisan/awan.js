/* ============================================================
   Kategori: Awan
   Sumber  : Foto MODIS Terra asli dari NASA GIBS
   Tampilan: Warna alami; awan tampak putih. Salju dan es juga putih.
   CORS `*` dan akses tanpa kunci telah diuji 7 Okt 2026.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;
  const MAKS_ZOOM = 9;
  const UBIN =
    'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
    'MODIS_Terra_CorrectedReflectance_TrueColor/default/' +
    'GoogleMapsCompatible_Level' +
    MAKS_ZOOM +
    '/{z}/{y}/{x}.jpg';

  const JEDA_UJI = 900000;

  /* Pilihan kepekatan. Awan menutup peta dasar, jadi Bapak perlu bisa
       mengatur seberapa kuat lapisannya. */
  const PILIHAN = [
    { nilai: 0.35, nama: 'Tipis' },
    { nilai: 0.55, nama: 'Sedang' },
    { nilai: 0.72, nama: 'Tebal' }
  ];
  const KEKAL = 'pd_awan_opasitas';
  const JENIS_LAMA = 'pd_awan_jenis';

  let lapisan = null;
  let pemeriksa = null;
  let pesan = '';
  let sedangUji = false;
  let kepekatan = 0.72;

  function bacaKepekatan() {
    try {
      const v = Number(localStorage.getItem(KEKAL));
      if (
        PILIHAN.some(function (p) {
          return p.nilai === v;
        })
      )
        kepekatan = v;
    } catch (e) {
      /* pakai bawaan */
    }
  }

  function simpanKepekatan(v) {
    kepekatan = v;
    try {
      localStorage.setItem(KEKAL, String(v));
    } catch (e) {
      /* diabaikan */
    }
  }

  function hapusPilihanJenisLama() {
    try {
      localStorage.removeItem(JENIS_LAMA);
    } catch (e) {
      /* penyimpanan mungkin tidak tersedia */
    }
  }

  function contohUbin() {
    return UBIN.replace('{z}', 3).replace('{y}', 4).replace('{x}', 6);
  }

  async function uji() {
    if (sedangUji) return;
    sedangUji = true;
    /* Server NASA GIBS kadang membalas HTTP 500 secara acak (diuji 7 Okt
       2026: URL sama bisa 200 → 500 → 200). Satu percobaan saja bisa
       memunculkan kabar "gagal" palsu, jadi dicoba beberapa kali dulu. */
    let kode = 0;
    let gagalHubungi = false;
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(contohUbin());
        kode = r.status;
        if (r.ok) break;
      } catch (e) {
        gagalHubungi = true;
      }
      await new Promise(function (t) {
        setTimeout(t, 1500);
      });
    }
    pesan = kode === 200 ? '' : 'Data awan tidak tersedia (HTTP ' + kode + ')';
    if (!kode && gagalHubungi) pesan = 'Data awan tidak bisa dihubungi';
    sedangUji = false;
    lapor();
  }
  function lapor() {
    const p = PILIHAN.find(function (x) {
      return x.nilai === kepekatan;
    });
    PD.ringkas(
      'awan',
      pesan ? 'gagal' : 'awan (foto satelit)',
      pesan ? pesan : 'Kepekatan ' + (p ? p.nama : '') + ' — tombol ⋯ untuk mengubah',
      pesan ? 'merah' : 'jingga'
    );
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'awan',
    nama: 'Awan',
    ikon: '☁️',
    ket: 'NASA GIBS · foto satelit realistis',

    nyalakan: function () {
      bacaKepekatan();
      hapusPilihanJenisLama();
      lapisan = A.lapisan('awan', {
        url: UBIN,
        tileSize: 256,
        opacity: kepekatan,
        maxzoom: MAKS_ZOOM,
        paint: { 'raster-contrast': 0.15, 'raster-saturation': -0.15 },
        attribution: 'Awan: NASA GIBS (MODIS Terra, foto asli)'
      });
      lapisan.pasang();
      lapor();
      uji();
      pemeriksa = setInterval(uji, JEDA_UJI);
    },

    matikan: function () {
      clearInterval(pemeriksa);
      pemeriksa = null;
      if (lapisan) {
        lapisan.hentikan();
        lapisan = null;
      }
    },

    klik: function () {
      pasangKartu();
      return true;
    }
  });

  /* Isi kartu pengaturan kepekatan. */
  function isiKartu() {
    let kepekatanBaris = '';
    for (const p of PILIHAN) {
      const nyala = p.nilai === kepekatan ? ' class="info-tombol"' : ' class="info-tombol pudar"';
      kepekatanBaris +=
        '<button' + nyala + ' data-awan="' + p.nilai + '">' + p.nama + '</button>';
    }
    return (
      A.info('☁️', 'Awan — foto satelit realistis', [
        ['Sumber', 'MODIS Terra — NASA GIBS'],
        ['Cara baca', 'Awan tampak putih alami; salju dan es juga putih'],
        ['Jenis data', 'Foto satelit asli, bukan peta warna atau angka persen'],
        ['Cakupan', 'Perekaman harian, siang hari'],
        ['Keadaan', pesan || 'Tersedia']
      ]) +
      '<div class="info-catatan">Foto satelit menampilkan awan dengan warna alami, ' +
      'bukan warna buatan. Celah gelap di antara lintasan satelit dapat terlihat. ' +
      'Salju dan es juga tampak putih.</div>' +
      '<div class="info-catatan">Atur kepekatan lapisan. Makin tipis, makin ' +
      'jelas peta di bawahnya.</div>' +
      kepekatanBaris
    );
  }

  function pasangKartu() {
    PD.tampilkanInfo(isiKartu());

    for (const tombol of document.querySelectorAll('[data-awan]')) {
      tombol.addEventListener('click', function () {
        const v = Number(tombol.getAttribute('data-awan'));
        simpanKepekatan(v);
        if (lapisan) lapisan.opasitas(v);
        lapor();
        pasangKartu();
        PD.setStatus('kepekatan awan: ' + tombol.textContent);
      });
    }
  }
})();
