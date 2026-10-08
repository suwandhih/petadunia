/* ============================================================
   Kategori: Suhu Permukaan
   Sumber  : NASA GIBS — ubin WMTS "MODIS_Terra_Land_Surface_Temp_Day"
             CORS `*`, tanpa kunci, jadi bisa dipanggil dari file://
             (sudah diuji 7 Okt 2026)

   Apa yang ditampilkan
   --------------------
   Peta panas permukaan DARATAN menurut satelit MODIS Terra, siang hari.
   Warnanya: biru = dingin, merah = panas.

   Yang TIDAK dilakukan (aturan F8)
   --------------------------------
   Angka derajat tidak ditampilkan, sebab skala warna resmi NASA tidak
   tersedia untuk dibaca, dan mengarang angka dilarang.
   Laut juga tampak kosong: MODIS mengukur suhu permukaan tanah/air
   lewat panas yang terpancar, dan ubin ini memang disiapkan untuk
   daratan.

   Data ini gambar harian, jadi tidak ada animation dan tidak perlu
   disegarkan sering-sering.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const LAPIS = 'MODIS_Terra_Land_Surface_Temp_Day';
  const MAKS_ZOOM = 7;   /* batas resmi GIBS: GoogleMapsCompatible_Level7 */
  const UBIN = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
    LAPIS + '/default/GoogleMapsCompatible_' + 'Level' + MAKS_ZOOM +
    '/{z}/{y}/{x}.png';

  const JEDA_UJI = 900000;  /* periksa ketersediaan tiap 15 menit */

    let lapisan = null;
    let pemeriksa = null;
    let pesan = '';
    let sedangUji = false;

  function contohUbin() {
    /* satu ubin contoh di atas Indonesia (z3, x6, y4) */
    return UBIN
      .replace('{z}', 3)
      .replace('{y}', 4)
      .replace('{x}', 6);
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
      pesan = kode === 200 ? '' : 'Data suhu tidak tersedia (HTTP ' + kode + ')';
      if (!kode && gagalHubungi) pesan = 'Data suhu tidak bisa dihubungi';
      sedangUji = false;
      lapor();
    }

  function lapor() {
    PD.ringkas(
      'suhu',
      pesan ? 'gagal' : 'peta panas permukaan darat',
      pesan ? pesan : 'Biru = dingin · merah = panas · laut kosong',
      pesan ? 'merah' : 'jingga'
    );
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'suhu',
    nama: 'Suhu Permukaan',
    ikon: '🌡️',
    ket: 'NASA GIBS · panas daratan',

    nyalakan: function () {
      lapisan = A.lapisan('suhu', {
        url: UBIN,
        tileSize: 256,
        opacity: 0.78,
        maxzoom: MAKS_ZOOM,
        attribution: 'Suhu permukaan: NASA GIBS (MODIS Terra)'
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
      PD.tampilkanInfo(
        A.info('🌡️', 'Suhu permukaan darat NASA', [
          ['Sumber', 'MODIS Terra — NASA GIBS'],
          ['Warna', 'Biru = dingin · merah = panas'],
          ['Jenis data', 'Gambar harian (bukan angka)'],
          ['Daratan saja', 'Laut tampak kosong, itu wajar'],
          ['Keadaan', pesan || 'Tersedia']
        ])
      );
      return true;
    }
  });
})();