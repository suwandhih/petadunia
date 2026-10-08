/* ============================================================
   Kategori: Kebakaran Hutan
   - NASA GIBS WMS : titik api satelit VIIRS (punya CORS)
   - GDACS         : kebakaran besar yang punya nama (punya CORS)
   Catatan: berkas CSV FIRMS TIDAK dipakai karena tanpa header CORS,
   sehingga diblokir browser biasa.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const GIBS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
  const LAPIS = 'VIIRS_SNPP_Thermal_Anomalies_375m_All';
  const GDACS =
    'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=WF';

  let titik = [];
  let besar = [];
  let layar = [];
  let tanggalPakai = null;
  let terakhirAmbil = 0;
  let sedangAmbil = false;

  function tanggalUji(mundur) {
    return new Date(Date.now() - mundur * 86400000).toISOString().slice(0, 10);
  }

  /* ---------- ambil gambar titik api untuk wilayah yang terlihat ---------- */
  async function ambilTitikApi() {
    const peta = PD.peta;
    if (!peta) return;

    const b = peta.getBounds();
    let barat = Math.max(-180, b.getWest() - 3);
    let timur = Math.min(180, b.getEast() + 3);
    let selatan = Math.max(-85, b.getSouth() - 3);
    let utara = Math.min(85, b.getNorth() + 3);
    if (timur <= barat) { barat = -180; timur = 180; }
    if (utara <= selatan) { selatan = -85; utara = 85; }

    const lebar = 2048;
    let tinggi = Math.round((lebar * (utara - selatan)) / (timur - barat));
    tinggi = Math.max(128, Math.min(2048, tinggi));

    const bbox = barat + ',' + selatan + ',' + timur + ',' + utara;
    const pilihan = tanggalPakai ? [tanggalPakai] : [0, 1, 2, 3];

    for (const m of pilihan) {
      const tgl = typeof m === 'string' ? m : tanggalUji(m);
      const url = GIBS +
        '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap' +
        '&LAYERS=' + LAPIS + '&STYLES=&SRS=EPSG:4326' +
        '&FORMAT=image/png&TRANSPARENT=true' +
        '&TIME=' + tgl +
        '&BBOX=' + bbox +
        '&WIDTH=' + lebar + '&HEIGHT=' + tinggi;

      const r = await fetch(url);
      if (!r.ok) continue;
      const bmp = await createImageBitmap(await r.blob());
      const hasil = bacaPiksel(bmp, barat, selatan, timur, utara);
      if (hasil.length) {
        tanggalPakai = tgl;
        titik = hasil;
        terakhirAmbil = Date.now();
        return;
      }
    }
    titik = [];
    terakhirAmbil = Date.now();
  }

  /* ---------- ubah piksel merah menjadi titik koordinat ---------- */
  function bacaPiksel(bmp, barat, selatan, timur, utara) {
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(bmp, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;

    /* gabungkan piksel bertetangga jadi satu titik api */
    const sel = 3;
    const ember = new Map();
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        if (d[i + 3] < 60) continue;
        if (d[i] < 150 || d[i + 1] > 120) continue;
        const kunci = Math.floor(x / sel) + ':' + Math.floor(y / sel);
        let e = ember.get(kunci);
        if (!e) { e = { x: 0, y: 0, n: 0 }; ember.set(kunci, e); }
        e.x += x;
        e.y += y;
        e.n++;
      }
    }

    const hasil = [];
    for (const e of ember.values()) {
      const px = e.x / e.n;
      const py = e.y / e.n;
      const lon = barat + ((px + 0.5) / c.width) * (timur - barat);
      const lat = utara - ((py + 0.5) / c.height) * (utara - selatan);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
      hasil.push({ lon: lon, lat: lat, n: e.n });
    }
    return hasil;
  }

  /* ---------- warna & ukuran menurut banyaknya piksel ---------- */
  function warnaApi(n) {
    if (n >= 12) return '#fff3c4';
    if (n >= 7) return '#ffd166';
    if (n >= 4) return '#ff9f1c';
    if (n >= 2) return '#ff6b1a';
    return '#e8452c';
  }

  function jariApi(n) {
    return Math.min(8, 1.5 + Math.sqrt(n) * 1.15);
  }

  function sebutan(n) {
    if (n >= 12) return 'sangat besar';
    if (n >= 7) return 'besar';
    if (n >= 4) return 'sedang';
    if (n >= 2) return 'kecil';
    return 'sangat kecil';
  }

  /* ---------- kartu rincian ---------- */
  function kartuTitik(t) {
    return A.info('🔥', 'Titik Api Satelit', [
      ['Perkiraan luas', sebutan(t.n) + ' (' + t.n + ' piksel satelit)'],
      ['Sumber', 'Satelit VIIRS (NASA GIBS)'],
      ['Tanggal citra', tanggalPakai || '—'],
      ['Koordinat', PD.angka(t.lat, 4) + ', ' + PD.angka(t.lon, 4)]
    ]);
  }

  function kartuBesar(b) {
    return A.info('🔥', b.nama, [
      ['Tingkat', b.level === 'Red' ? '🔴 MERAH' : b.level === 'Orange' ? '🟠 JINGGA' : b.level || '—'],
      ['Negara', b.negara || '—'],
      ['Luas terbakar', b.luas ? PD.angka(b.luas, 0) + ' ha' : '—'],
      ['Mulai', b.mulai ? PD.waktu(b.mulai) + ' (' + PD.sejak(b.mulai) + ')' : '—'],
      ['Sumber', b.sumber || 'GDACS'],
      ['Koordinat', PD.angka(b.lat, 4) + ', ' + PD.angka(b.lon, 4)]
    ]);
  }

  /* ---------- gambar ---------- */
  function gambar(ctx, dt, waktu) {
    layar = [];
    const peta = PD.peta;
    if (!peta) return;

    const zoom = peta.getZoom();
    const gabung = zoom < 3.6;
    const sel = 26;
    const ember = new Map();
    let tampak = 0;
    let besarKali = 0;

    for (const t of titik) {
      const p = PD.layar(t.lon, t.lat);
      if (!p) continue;
      if (p.x < -40 || p.y < -40 || p.x > innerWidth + 40 || p.y > innerHeight + 40) continue;
      tampak++;

      if (gabung) {
        const kunci = Math.floor(p.x / sel) + ':' + Math.floor(p.y / sel);
        let e = ember.get(kunci);
        if (!e) { e = { x: 0, y: 0, n: 0, contoh: t }; ember.set(kunci, e); }
        e.x += p.x;
        e.y += p.y;
        e.n++;
        if (t.n > e.contoh.n) e.contoh = t;
      } else {
        const r = jariApi(t.n);
        const warna = warnaApi(t.n);
        const fase = (t.lon * 7.3 + t.lat * 3.1) % 6.283;
        const kedip = 0.62 + 0.38 * Math.sin(waktu * 3.1 + fase);
        PD.cahaya(ctx, p.x, p.y, r * 3.4, warna, 0.3 * kedip);
        PD.cahaya(ctx, p.x, p.y, r * 1.5, warna, 0.85 * kedip);
        if (t.n >= 7) {
          const u = (waktu / 2.6 + fase / 6.283) % 1;
          A.gelombang(ctx, p.x, p.y, u, r * 4.2, warna, 1.2);
        }
        layar.push({ x: p.x, y: p.y, r: Math.max(r * 2.2, 9), t: t });
      }
    }

    if (gabung) {
      for (const e of ember.values()) {
        const cx = e.x / e.n;
        const cy = e.y / e.n;
        const r = Math.min(16, 3 + Math.sqrt(e.n) * 1.5);
        const warna = warnaApi(e.contoh.n);
        const kedip = 0.7 + 0.3 * Math.sin(waktu * 2.4 + cx * 0.05);
        PD.cahaya(ctx, cx, cy, r * 2.6, warna, 0.34 * kedip);
        PD.cahaya(ctx, cx, cy, r, warna, 0.9 * kedip);
        layar.push({ x: cx, y: cy, r: Math.max(r * 1.6, 12), t: e.contoh, n: e.n });
      }
    }

    /* kebakaran besar yang punya nama */
    for (const b of besar) {
      const p = PD.layar(b.lon, b.lat);
      if (!p) continue;
      if (p.x < -60 || p.y < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60) continue;
      besarKali++;
      const warna = b.level === 'Red' ? '#ff3b30' : '#ff9f1c';
      const u = (waktu / 3.0 + b.lon * 0.01) % 1;
      A.gelombang(ctx, p.x, p.y, u, 30, warna, 1.8);
      PD.cahaya(ctx, p.x, p.y, 13, warna, 0.55);
      layar.push({ x: p.x, y: p.y, r: 18, besar: b });
    }

    const bagian = [PD.angka(tampak, 0) + ' titik api terlihat'];
    if (besarKali) bagian.push(besarKali + ' kebakaran besar bernama');
    PD.ringkas(
      'kebakaran',
      bagian.join(' · '),
      besarKali ? 'Ada kebakaran besar yang dipantau resmi' : null,
      besarKali ? 'jingga' : null
    );
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'kebakaran',
    nama: 'Kebakaran Hutan',
    ikon: '🔥',
    ket: 'Satelit VIIRS NASA + GDACS',
    jeda: 600000,

    muat: async function () {
      await ambilTitikApi();

      const mulai = new Date(Date.now() - 200 * 86400000).toISOString().slice(0, 10);
      const akhir = new Date().toISOString().slice(0, 10);
      try {
        const g = await A.ambil(GDACS + '&fromDate=' + mulai + '&toDate=' + akhir);
        besar = (g.features || []).map(function (f) {
          const p = f.properties || {};
          const c = f.geometry && f.geometry.coordinates;
          if (!c) return null;
          return {
            nama: p.name || 'Kebakaran',
            level: p.alertlevel || '',
            negara: p.country || '',
            luas: p.severitydata ? p.severitydata.severity : 0,
            mulai: p.fromdate || null,
            sumber: p.source || 'GDACS',
            lon: c[0],
            lat: c[1]
          };
        }).filter(Boolean);
      } catch (e) {
        besar = [];
      }

      if (!titik.length && !besar.length) throw new Error('data kebakaran kosong');
    },

    segarkan: async function () {
      try {
        await ambilTitikApi();
      } catch (e) {
        PD.setStatus('kebakaran: gagal menyegarkan');
      }
    },

    /* ambil ulang saat peta digeser/dizoom, ditahan 1,5 detik */
    pasang: function () {
      const L = this;
      if (L._geser) return;
      L._geser = function () {
        clearTimeout(L._tunda);
        L._tunda = setTimeout(async function () {
          if (sedangAmbil) return;
          if (Date.now() - terakhirAmbil < 4000) return;
          sedangAmbil = true;
          try { await ambilTitikApi(); } catch (e) { /* lewati */ }
          sedangAmbil = false;
        }, 1500);
      };
      PD.peta.on('moveend', L._geser);
    },

    matikan: function () {
      if (this._geser) {
        PD.peta.off('moveend', this._geser);
        this._geser = null;
      }
      clearTimeout(this._tunda);
    },

    gambar: gambar,

    klik: function (x, y) {
      const d = A.bidik(layar, x, y, 16);
      if (!d) return false;
      if (d.besar) {
        PD.tampilkanInfo(kartuBesar(d.besar));
        return true;
      }
      let h = kartuTitik(d.t);
      if (d.n > 1) {
        h = '<div class="info-judul"><span class="info-ikon">🔥</span><span>' +
          d.n + ' titik api berdekatan</span></div>' +
          '<div class="info-catatan">Ditampilkan titik terkuat di kelompok ini.</div>' + h;
      }
      PD.tampilkanInfo(h);
      return true;
    }
  });
})();
