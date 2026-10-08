/* ============================================================
   Kategori: Gempa Bumi — data USGS (7 hari terakhir)
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;
  const SUMBER =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

  let daftar = [];
  let layar = [];

  function jariJari(mag) {
    return Math.max(3, 2 + Math.pow(Math.max(mag, 2.5) - 2.4, 1.55) * 0.9);
  }

  function warnaGempa(p) {
    const umurJam = (Date.now() - p.time) / 3600000;
    const mag = Math.max(2.5, p.mag || 2.5);
    const t = (mag - 2.5) / 4.5;
    if (umurJam > 72) return 'rgba(190,205,225,0.95)';
    return t > 0.62 ? '#ff4d4d' : t > 0.26 ? '#ffb020' : '#ffd95e';
  }

  function keterangan(p) {
    const umur = (Date.now() - p.time) / 3600000;
    if (umur > 72) return 'lebih dari 3 hari lalu';
    if (umur > 24) return 'hari ini sebelumnya';
    if (umur > 6) return 'beberapa jam lalu';
    return 'baru saja';
  }

  function kartu(p) {
    const c = p.geometry.coordinates;
    const jarak = c[2] === null || c[2] === undefined ? '—' : PD.angka(c[2], 1) + ' km';
    return A.info('🌊', 'Gempa M ' + PD.angka(p.properties.mag, 1), [
      ['Tempat', p.properties.place || '—'],
      ['Waktu', PD.waktu(new Date(p.properties.time).toISOString()) + ' (' + PD.sejak(new Date(p.properties.time).toISOString()) + ')'],
      ['Kedalaman', jarak],
      ['Koordinat', PD.angka(c[1], 3) + ', ' + PD.angka(c[0], 3)],
      ['Status', keterangan(p.properties)]
    ]);
  }

  function gambar(ctx, dt, waktu) {
    layar = [];
    const peta = PD.peta;
    if (!peta || !daftar.length) return;

    const peringatan = [];

    for (const f of daftar) {
      const c = f.geometry && f.geometry.coordinates;
      if (!c) continue;
      const p = PD.layar(c[0], c[1]);
      if (!p) continue;

      const p2 = f.properties;
      const r = jariJari(p2.mag);
      const warna = warnaGempa(p2);
      const umurJam = (Date.now() - p2.time) / 3600000;

      if (umurJam <= 24) {
        const fase = (p2.time / 3600000) % 1;
        for (let k = 0; k < 2; k++) {
          const u = ((waktu / 3.2 + fase + k * 0.5) % 1);
          A.gelombang(ctx, p.x, p.y, u, r * 5.5, warna, 1.5);
        }
      }

      PD.cahaya(ctx, p.x, p.y, r * 2.4, warna, 0.55);
      ctx.fillStyle = warna;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.62, 0, Math.PI * 2);
      ctx.fill();

      layar.push({ x: p.x, y: p.y, r: Math.max(r * 2, 10), f: f });

      if (p2.mag >= 5.5 && umurJam <= 24) {
        A.label(ctx, p.x, p.y, 'M ' + PD.angka(p2.mag, 1), warna, 12);
        peringatan.push(p2.mag);
      }
    }

    const semua = daftar.length;
    PD.ringkas(
      'gempa',
      layar.length + ' tampak dari ' + semua + ' gempa M≥2,5 (7 hari)',
      peringatan.length ? peringatan.length + ' gempa kuat 24 jam terakhir' : null,
      peringatan.length ? 'merah' : null
    );
  }

  PD.daftar({
    id: 'gempa',
    nama: 'Gempa Bumi',
    ikon: '🌊',
    ket: 'USGS · M≥2,5 · 7 hari',
    jeda: 120000,

    muat: async function () {
      const j = await A.ambil(SUMBER);
      daftar = (j.features || []).filter((f) => f.geometry && f.geometry.coordinates);
    },

    segarkan: async function () {
      try {
        await this.muat();
      } catch (e) {
        PD.setStatus('gempa: gagal menyegarkan');
      }
    },

    gambar: gambar,

    klik: function (x, y) {
      const d = A.bidik(layar, x, y);
      if (!d) return false;
      PD.tampilkanInfo(kartu(d.f));
      return true;
    }
  });
})();
