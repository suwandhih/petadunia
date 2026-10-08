/* ============================================================
   Peta Dunia — inti aplikasi
   Peta globe realistis + kategori data real-time
   ============================================================ */
(function () {
  'use strict';

  const PD = (window.PD = {
    peta: null,
    kanvas: null,
    lapisan: new Map(),
    aktif: new Set(),
    gaya: 'satelit',
    globe: true,
    info: null
  });

  /* ---------- gaya peta ---------- */
  const ATRIB_SATELIT = 'Citra: Esri, Maxar, Earthstar Geographics';
  const ATRIB_VEKTOR = 'Peta: OpenFreeMap · OpenStreetMap';

  const GAYA_SATELIT = {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      satelit: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 19,
        attribution: ATRIB_SATELIT
      },
      label: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      { id: 'latar', type: 'background', paint: { 'background-color': '#070b10' } },
      { id: 'satelit', type: 'raster', source: 'satelit' },
      { id: 'label', type: 'raster', source: 'label', paint: { 'raster-opacity': 0.85 } }
    ]
  };

  const GAYA_VEKTOR = 'https://tiles.openfreemap.org/styles/liberty';

  /* ---------- kanvas animasi ---------- */
  function buatKanvas() {
    const c = document.createElement('canvas');
    c.id = 'kanvas-animasi';
    c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');

    function ukur() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(innerWidth * dpr);
      c.height = Math.round(innerHeight * dpr);
      c.style.width = innerWidth + 'px';
      c.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ukur();
    addEventListener('resize', ukur);
    return { c, ctx, ukur };
  }

  /* ---------- peta ---------- */
  function buatPeta() {
    const peta = new maplibregl.Map({
      container: 'peta',
      style: GAYA_SATELIT,
      center: [118, -2],
      zoom: 2.4,
      minZoom: 0.6,
      maxZoom: 18,
      attributionControl: { compact: true },
      dragRotate: true,
      pitchWithRotate: true
    });

    peta.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-left');
    peta.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');

    peta.on('style.load', () => {
      terapkanProyeksi();
      pasangUlangLapisan();
    });

    peta.on('move', () => { PD.kanvas && PD.kanvas.ukur(); });

    return peta;
  }

  function terapkanProyeksi() {
    if (!PD.peta) return;
    try {
      PD.peta.setProjection({ type: PD.globe ? 'globe' : 'mercator' });
    } catch (e) {
      console.warn('proyeksi tidak didukung', e);
    }
  }

  /* ---------- lapisan ---------- */
  PD.daftar = function (modul) {
    PD.lapisan.set(modul.id, modul);
    gambarKategori();
  };

  function pasangUlangLapisan() {
    for (const id of PD.aktif) {
      const L = PD.lapisan.get(id);
      if (L && L.pasang) {
        try { L.pasang(); } catch (e) { console.warn('pasang ' + id, e); }
      }
    }
  }

  async function nyalakan(id) {
    const L = PD.lapisan.get(id);
    if (!L || PD.aktif.has(id)) return;
    PD.aktif.add(id);
    gambarKategori();
    setStatus('memuat ' + L.nama + '…');
    try {
      if (L.muat && !L.siap) { await L.muat(); L.siap = true; }
      if (L.nyalakan) L.nyalakan();
      setStatus(L.nama + ' aktif');
    } catch (e) {
      console.error(e);
      setStatus('gagal: ' + L.nama);
      PD.aktif.delete(id);
      gambarKategori();
      return;
    }
    gambarKategori();
  }

  function matikan(id) {
    const L = PD.lapisan.get(id);
    if (!L || !PD.aktif.has(id)) return;
    PD.aktif.delete(id);
    try { if (L.matikan) L.matikan(); } catch (e) { console.warn(e); }
    gambarKategori();
    gambarRingkas();
    setStatus(L.nama + ' dimatikan');
  }

  PD.nyalakan = nyalakan;
  PD.matikan = matikan;

  /* ---------- panel kategori ---------- */
  function gambarKategori() {
    const wadah = document.getElementById('daftar-kategori');
    if (!wadah) return;
    wadah.innerHTML = '';

    for (const [id, L] of PD.lapisan) {
      const aktif = PD.aktif.has(id);
      const el = document.createElement('div');
      el.className = 'kartu' + (aktif ? ' aktif' : '');
      el.dataset.id = id;
      el.innerHTML =
        '<span class="ikon">' + L.ikon + '</span>' +
        '<span class="nama">' + L.nama + '<small>' + (L.ket || '') + '</small></span>' +
            '<span class="tombol-kartu" title="buka pengaturan ' + aman(L.nama) + '">⋯</span>' +
            '<span class="saklar"></span>';
          el.addEventListener('click', () => (aktif ? matikan(id) : nyalakan(id)));
          /* Titik tiga membuka kartu pengaturan kategori (tempat kunci, pencarian,
             dan pengatur kepekatan). Tanpa ini, kartu hanya bisa dibuka lewat
             klik peta — dan itu sering keburu dipakai kategori lain. */
          const titik = el.querySelector('.tombol-kartu');
          titik.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            if (!PD.aktif.has(id)) await nyalakan(id);
            try {
              if (L.klik && L.klik(0, 0)) return;
            } catch (e) { /* lewati */ }
            /* Sebagian kategori hanya bisa membuka kartunya lewat satu titik data
               (mis. gempa, gunung). Supaya tombol ini SELALU menghasilkan sesuatu,
               tampilkan kartu keterangan + petunjuknya. */
            PD.tampilkanInfo(
              PD.alat.info(L.ikon, L.nama, [
                ['Sumber', L.ket || '—'],
                ['Keadaan', PD.aktif.has(id) ? 'aktif' : 'mati'],
                ['Melihat rincian', 'ketuk titik datanya di peta']
              ]) +
                '<div class="info-catatan">Kategori ini tidak punya pengaturan; ' +
                'rinciannya terbuka saat titik datanya diketuk di peta.</div>'
            );
          });
          wadah.appendChild(el);
        }

    const n = document.getElementById('jumlah-aktif');
    if (n) n.textContent = PD.aktif.size;
  }

  function setStatus(t) {
    const el = document.getElementById('status-data');
    if (el && !el.dataset.ringkas) el.textContent = t;
  }
  PD.setStatus = setStatus;

  /* ---------- ringkasan per kategori ---------- */
  const ringkasan = new Map();

  PD.ringkas = function (id, teks, tambahan, warna) {
    ringkasan.set(id, { teks: teks, tambahan: tambahan, warna: warna });
    gambarRingkas();
  };

  function gambarRingkas() {
    const el = document.getElementById('status-data');
    if (!el) return;
    const aktif = [];
    for (const k of PD.aktif) {
      const r = ringkasan.get(k);
      const L = PD.lapisan.get(k);
      if (r && L) aktif.push({ L: L, r: r });
    }
    if (!aktif.length) {
      el.dataset.ringkas = '';
      el.textContent = 'siap — pilih kategori';
      el.classList.remove('ingat');
      return;
    }
    let h = '';
    for (const a of aktif) {
      h += '<div class="baris-ringkas">' +
        '<span class="titik-ringkas ' + (a.r.warna || '') + '"></span>' +
        '<span><b>' + aman(a.L.nama) + '</b> — ' + aman(a.r.teks) + '</span>' +
        '</div>';
      if (a.r.tambahan) {
        h += '<div class="baris-ringkas peringatan">' + aman(a.r.tambahan) + '</div>';
      }
    }
    el.dataset.ringkas = '1';
    el.classList.add('ingat');
    el.innerHTML = h;
  }

  /* ---------- klik pada titik data ---------- */
  function pasangKlik() {
    PD.peta.on('click', (e) => {
      const x = e.point.x;
      const y = e.point.y;
      for (const id of PD.aktif) {
        const L = PD.lapisan.get(id);
        if (!L || !L.klik) continue;
        try {
          if (L.klik(x, y)) return;
        } catch (err) { /* lewati */ }
      }
      PD.tutupInfo();
    });
    PD.peta.on('dragstart', PD.tutupInfo);
  }

  /* ---------- panel info ---------- */
  PD.tampilkanInfo = function (html) {
    const p = document.getElementById('panel-info');
    document.getElementById('isi-info').innerHTML = html;
    p.classList.remove('sembunyi');
  };

  PD.tutupInfo = function () {
    document.getElementById('panel-info').classList.add('sembunyi');
  };

  /* ---------- jam ---------- */
  function jalankanJam() {
    const el = document.getElementById('jam');
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      el.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' WIB';
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- alat bantu ---------- */
  PD.titik = (lon, lat) => PD.peta.project([lon, lat]);

  function aman(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  PD.angka = function (n, desimal) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return Number(n).toLocaleString('id-ID', {
      minimumFractionDigits: desimal || 0,
      maximumFractionDigits: desimal || 0
    });
  };

  PD.waktu = function (iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    const p = (n) => String(n).padStart(2, '0');
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ' WIB';
  };

  PD.sejak = function (iso) {
    if (!iso) return '—';
    const detik = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (detik < 60) return Math.round(detik) + ' detik lalu';
    if (detik < 3600) return Math.round(detik / 60) + ' menit lalu';
    if (detik < 86400) return Math.round(detik / 3600) + ' jam lalu';
    return Math.round(detik / 86400) + ' hari lalu';
  };

  /* ---------- titik bercahaya (sprite di-cache agar cepat) ---------- */
  const simpanSprite = new Map();

  PD.sprite = function (warna, r) {
    const kunci = warna + '|' + r;
    let s = simpanSprite.get(kunci);
    if (s) return s;
    const d = Math.max(2, Math.round(r * 2));
    s = document.createElement('canvas');
    s.width = s.height = d;
    const g = s.getContext('2d');
    const gr = g.createRadialGradient(d / 2, d / 2, 0, d / 2, d / 2, d / 2);
    gr.addColorStop(0, 'rgba(255,255,255,0.95)');
    gr.addColorStop(0.28, warna);
    gr.addColorStop(0.7, warna);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.beginPath();
    g.arc(d / 2, d / 2, d / 2, 0, Math.PI * 2);
    g.fill();
    simpanSprite.set(kunci, s);
    return s;
  };

  PD.cahaya = function (ctx, x, y, r, warna, alfa) {
    if (r <= 0) return;
    ctx.globalAlpha = alfa === undefined ? 1 : alfa;
    ctx.drawImage(PD.sprite(warna, 32), x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  };

  /* ---------- sisi globe ----------
     Titik di balik bola dunia tetap punya koordinat proyeksi,
     jadi harus disembunyikan manual. */
  let LngLatKelas = null;

  PD.tampak = function (lon, lat) {
    const t = PD.peta && PD.peta.transform;
    if (!t || typeof t.isLocationOccluded !== 'function') return true;
    if (!LngLatKelas) {
      LngLatKelas = (window.maplibregl && window.maplibregl.LngLat) || null;
      if (!LngLatKelas) return true;
    }
    try {
      return !t.isLocationOccluded(new LngLatKelas(lon, lat));
    } catch (e) {
      return true;
    }
  };

  /* posisi layar sebuah koordinat; null bila tak terlihat */
  PD.layar = function (lon, lat) {
    if (!PD.peta) return null;
    if (PD.globe && !PD.tampak(lon, lat)) return null;
    const p = PD.peta.project([lon, lat]);
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
    return p;
  };

  /* ---------- putaran animasi ---------- */
  let akhir = performance.now();
  let idleAkhir = 0;

  function putar(now) {
    const dt = Math.min((now - akhir) / 1000, 0.1);
    akhir = now;
    const waktu = now / 1000;
    const ctx = PD.kanvas.ctx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const id of PD.aktif) {
      const L = PD.lapisan.get(id);
      if (L && L.gambar) {
        try { L.gambar(ctx, dt, waktu); } catch (e) { /* lewati */ }
      }
    }

    if (now - idleAkhir >= 1000) {
      idleAkhir = now;
      for (const id of PD.aktif) {
        const L = PD.lapisan.get(id);
        if (!L || !L.segarkan || !L.jeda) continue;
        if (!L.akhirSegar || Date.now() - L.akhirSegar >= L.jeda) {
          L.akhirSegar = Date.now();
          try { L.segarkan(); } catch (e) { /* lewati */ }
        }
      }
    }

    requestAnimationFrame(putar);
  }

  /* ---------- tombol ---------- */
  function pasangTombol() {
    document.getElementById('tombol-globe').addEventListener('click', (e) => {
      PD.globe = !PD.globe;
      e.currentTarget.classList.toggle('nyala', PD.globe);
      e.currentTarget.textContent = PD.globe ? '🌐 Globe' : '🗺️ Datar';
      terapkanProyeksi();
    });

    document.getElementById('tombol-gaya').addEventListener('click', (e) => {
      PD.gaya = PD.gaya === 'satelit' ? 'vektor' : 'satelit';
      const satelit = PD.gaya === 'satelit';
      e.currentTarget.classList.toggle('nyala', satelit);
      e.currentTarget.textContent = satelit ? '🛰️ Satelit' : '🎨 Peta';
      PD.peta.setStyle(satelit ? GAYA_SATELIT : GAYA_VEKTOR);
      document.getElementById('keterangan-peta').textContent = satelit ? ATRIB_SATELIT : ATRIB_VEKTOR;
    });

    document.getElementById('tombol-semua-mati').addEventListener('click', () => {
      for (const id of [...PD.aktif]) matikan(id);
    });

    document.getElementById('tutup-info').addEventListener('click', PD.tutupInfo);

    document.getElementById('tombol-panel').addEventListener('click', () => {
      document.getElementById('panel-kategori').classList.toggle('terbuka');
    });
  }

  /* ---------- mulai ---------- */
  function mulai() {
    PD.kanvas = buatKanvas();
    PD.peta = buatPeta();
    PD.peta.on('load', () => {
      terapkanProyeksi();
      document.getElementById('tombol-globe').classList.add('nyala');
      document.getElementById('tombol-gaya').classList.add('nyala');
      document.getElementById('keterangan-peta').textContent = ATRIB_SATELIT;
      setStatus('siap — pilih kategori');
    });
    jalankanJam();
    pasangTombol();
    pasangKlik();
    gambarKategori();
    requestAnimationFrame(putar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();
