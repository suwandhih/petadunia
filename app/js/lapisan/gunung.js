/* ============================================================
   Kategori: Gunung Vulkanik
   - Wikidata SPARQL : daftar gunung api (punya CORS)
   - GDACS           : erupsi terkini + tingkat siaga (punya CORS)
   Catatan: Smithsonian GVP TIDAK dipakai karena tanpa header CORS,
   sehingga diblokir browser biasa.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const SPARQL = 'https://query.wikidata.org/sparql';
  const GDACS =
    'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=VO';

  const KUNCI_SIMPAN = 'pd-gunung-v2';
  const UMUR_SIMPAN = 30 * 24 * 3600 * 1000;

  let gunung = [];
  let erupsi = [];
  let layar = [];

  /* ---------- simpanan sementara (Wikidata bisa lambat) ---------- */
  function bacaSimpanan() {
    try {
      const s = localStorage.getItem(KUNCI_SIMPAN);
      if (!s) return null;
      const j = JSON.parse(s);
      if (!j.waktu || Date.now() - j.waktu > UMUR_SIMPAN) return null;
      if (!Array.isArray(j.data) || !j.data.length) return null;
      return j.data;
    } catch (e) {
      return null;
    }
  }

  function tulisSimpanan(data) {
    try {
      localStorage.setItem(KUNCI_SIMPAN, JSON.stringify({ waktu: Date.now(), data: data }));
    } catch (e) { /* penyimpanan penuh — abaikan */ }
  }

  /* ---------- warna ---------- */
  function warnaSiaga(level) {
    if (level === 'Red') return '#ff3b30';
    if (level === 'Orange') return '#ff9f1c';
    if (level === 'Green') return '#3fb950';
    return '#8b9bb0';
  }

  function warnaGunung(tahun) {
    if (tahun === null || tahun === undefined) return 'rgba(150,168,190,0.75)';
    const selisih = new Date().getFullYear() - tahun;
    if (selisih <= 5) return 'rgba(255,159,28,0.95)';
    if (selisih <= 50) return 'rgba(255,209,102,0.85)';
    if (selisih <= 500) return 'rgba(190,205,225,0.7)';
    return 'rgba(140,158,180,0.6)';
  }

  function teksLetusan(tahun) {
    if (tahun === null || tahun === undefined) return 'belum diketahui';
    if (tahun < 0) return Math.abs(tahun) + ' SM';
    return String(tahun);
  }

  /* ---------- kartu rincian ---------- */
  function kartuGunung(g) {
    const baris = [
      ['Negara', g.negara || '—'],
      ['Jenis', g.jenis || '—'],
      ['Ketinggian', g.elevasi ? PD.angka(g.elevasi, 0) + ' m' : '—']
    ];
    if (g.tahun !== null && g.tahun !== undefined) {
      baris.push(['Letusan terakhir', teksLetusan(g.tahun)]);
    }
    baris.push(['Koordinat', PD.angka(g.lat, 4) + ', ' + PD.angka(g.lon, 4)]);
    return A.info('🌋', g.nama, baris);
  }

  function kartuErupsi(e) {
    const baris = [
      ['Tingkat siaga', e.level === 'Red' ? '🔴 MERAH — bahaya tinggi'
        : e.level === 'Orange' ? '🟠 JINGGA — waspada'
        : e.level === 'Green' ? '🟢 HIJAU — normal' : e.level || '—'],
      ['Negara', e.negara || '—'],
      ['Mulai episode', e.mulai ? PD.waktu(e.mulai) + ' (' + PD.sejak(e.mulai) + ')' : '—'],
      ['Sumber', e.sumber || 'GDACS']
    ];
    if (e.diubah) baris.push(['Info diperbarui', PD.sejak(e.diubah)]);
    if (e.gunung) {
      baris.push(['Jenis', e.gunung.jenis || '—']);
      baris.push(['Ketinggian', e.gunung.elevasi ? PD.angka(e.gunung.elevasi, 0) + ' m' : '—']);
    }
    baris.push(['Koordinat', PD.angka(e.lat, 4) + ', ' + PD.angka(e.lon, 4)]);
    return A.info('🌋', e.nama, baris);
  }

  /* ---------- sambungkan erupsi dengan gunung terdekat ---------- */
  function sambungkan() {
    for (const e of erupsi) {
      let dekat = null;
      let jarak = 0.6;
      for (const g of gunung) {
        const d = Math.abs(g.lat - e.lat) + Math.abs(g.lon - e.lon);
        if (d < jarak) { jarak = d; dekat = g; }
      }
      e.gunung = dekat;
    }
  }

  /* ---------- ambil daftar gunung di latar belakang ---------- */
  let sedangMuatDaftar = false;

  async function muatDaftarGunung() {
    if (sedangMuatDaftar) return;
    sedangMuatDaftar = true;
    try {
      const q = 'SELECT ?v ?vLabel ?lat ?lon ?elev ?negara ?negaraLabel ?jenis ?jenisLabel WHERE {' +
        ' ?v wdt:P31/wdt:P279* wd:Q8072 .' +
        ' ?v wdt:P625 ?c .' +
        ' BIND(geof:latitude(?c) AS ?lat)' +
        ' BIND(geof:longitude(?c) AS ?lon)' +
        ' OPTIONAL { ?v wdt:P2044 ?elev }' +
        ' OPTIONAL { ?v wdt:P17 ?negara }' +
        ' OPTIONAL { ?v wdt:P31 ?jenis }' +
        ' SERVICE wikibase:label { bd:serviceParam wikibase:language "id,en". }' +
        ' }';
      const url = SPARQL + '?format=json&query=' + encodeURIComponent(q);
      const j = await A.ambil(url, { headers: { Accept: 'application/sparql-results+json' } });
      const baris = (j.results && j.results.bindings) || [];

      /* satu gunung bisa muncul berkali-kali karena jenisnya banyak */
      const per = new Map();
      for (const r of baris) {
        const nama = r.vLabel ? r.vLabel.value : null;
        const lat = r.lat ? +r.lat.value : NaN;
        const lon = r.lon ? +r.lon.value : NaN;
        if (!nama || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        const kunci = r.v.value;
        let g = per.get(kunci);
        if (!g) {
          g = {
            nama: nama,
            lat: lat,
            lon: lon,
            elevasi: r.elev ? Math.round(+r.elev.value) : 0,
            negara: r.negaraLabel ? r.negaraLabel.value : '',
            jenis: r.jenisLabel ? r.jenisLabel.value : '',
            tahun: null
          };
          per.set(kunci, g);
        } else {
          if (!g.elevasi && r.elev) g.elevasi = Math.round(+r.elev.value);
          if (!g.negara && r.negaraLabel) g.negara = r.negaraLabel.value;
          if (!g.jenis && r.jenisLabel) g.jenis = r.jenisLabel.value;
        }
      }
      gunung = [...per.values()];
      if (gunung.length) {
        tulisSimpanan(gunung);
        sambungkan();
      }
    } catch (e) {
      /* daftar gunung gagal — erupsi tetap tampil */
    }
    sedangMuatDaftar = false;
  }

  /* ---------- gambar ---------- */
  function gambar(ctx, dt, waktu) {
    layar = [];
    const peta = PD.peta;
    if (!peta) return;

    const zoom = peta.getZoom();
    const b = peta.getBounds();
    const bawah = b.getSouth() - 2;
    const atas = b.getNorth() + 2;
    const kiri = b.getWest() - 2;
    const kanan = b.getEast() + 2;
    const lebarPenuh = kanan - kiri >= 350;

    let tampakGunung = 0;
    if (zoom >= 3.8) {
      const r = zoom >= 6 ? 3.4 : 2.4;
      for (const g of gunung) {
        if (g.lat < bawah || g.lat > atas) continue;
        if (!lebarPenuh && (g.lon < kiri || g.lon > kanan)) continue;
        const p = PD.layar(g.lon, g.lat);
        if (!p) continue;
        if (p.x < -20 || p.y < -20 || p.x > innerWidth + 20 || p.y > innerHeight + 20) continue;

        tampakGunung++;
        ctx.fillStyle = warnaGunung(g.tahun);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x + r * 0.9, p.y + r * 0.7);
        ctx.lineTo(p.x - r * 0.9, p.y + r * 0.7);
        ctx.closePath();
        ctx.fill();

        layar.push({ x: p.x, y: p.y, r: 10, jenis: 'gunung', g: g });
      }
    }

    let merah = 0;
    for (const e of erupsi) {
      const p = PD.layar(e.lon, e.lat);
      if (!p) continue;
      if (p.x < -60 || p.y < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60) continue;

      const warna = warnaSiaga(e.level);
      if (e.level === 'Red') merah++;

      /* asap/abu naik lalu memudar */
      const jumlah = e.level === 'Red' ? 18 : 12;
      for (let i = 0; i < jumlah; i++) {
        const fase = (waktu * 0.26 + i / jumlah) % 1;
        const tinggi = fase * 52;
        const sebar = Math.sin(i * 2.399) * fase * 15;
        ctx.globalAlpha = (1 - fase) * (e.level === 'Red' ? 0.55 : 0.4);
        ctx.fillStyle = i % 3 === 0 ? warna : 'rgba(190,196,205,1)';
        ctx.beginPath();
        ctx.arc(p.x + sebar, p.y - tinggi, 2 + fase * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const denyut = 0.6 + 0.4 * Math.sin(waktu * 2.2 + e.lon);
      PD.cahaya(ctx, p.x, p.y, 15, warna, 0.5 * denyut);
      PD.cahaya(ctx, p.x, p.y, 6, warna, 0.95);

      if (e.level === 'Red') {
        A.gelombang(ctx, p.x, p.y, (waktu / 2.2) % 1, 34, warna, 1.8);
      }

      layar.push({ x: p.x, y: p.y, r: 16, jenis: 'erupsi', e: e });
    }

    const bagian = [];
    if (erupsi.length) bagian.push(erupsi.length + ' erupsi terkini');
    if (merah) bagian.push(merah + ' status MERAH');
    if (tampakGunung) bagian.push(PD.angka(tampakGunung, 0) + ' gunung api tampak');

    PD.ringkas(
      'gunung',
      bagian.join(' · ') || 'memuat data gunung api…',
      merah ? 'Ada erupsi berstatus MERAH — bahaya tinggi' : null,
      merah ? 'merah' : 'jingga'
    );
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'gunung',
    nama: 'Gunung Vulkanik',
    ikon: '🌋',
    ket: 'Wikidata + GDACS',
    jeda: 900000,

    muat: async function () {
      /* 1. erupsi terkini — cepat, ditampilkan lebih dulu */
      const mulai = new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10);
      const akhir = new Date().toISOString().slice(0, 10);
      const g2 = await A.ambil(GDACS + '&fromDate=' + mulai + '&toDate=' + akhir);
      const mentah = (g2.features || []).map(function (f) {
        const p = f.properties || {};
        const c = f.geometry && f.geometry.coordinates;
        if (!c) return null;
        return {
          nama: String(p.name || '').replace(/^Eruption\s+/i, '').trim() || 'Erupsi',
          level: p.alertlevel || '',
          negara: p.country || '',
          mulai: p.fromdate || null,
          diubah: p.datemodified || null,
          sumber: p.source || 'GDACS',
          lon: c[0],
          lat: c[1]
        };
      }).filter(Boolean);

      /* satu gunung bisa muncul beberapa kali — ambil yang terbaru */
      const perNama = new Map();
      for (const e of mentah) {
        const lama = perNama.get(e.nama);
        if (!lama || (e.mulai && lama.mulai && e.mulai > lama.mulai)) perNama.set(e.nama, e);
      }
      erupsi = [...perNama.values()];

      /* 2. daftar gunung api — lambat, jadi dijalankan di latar belakang
            supaya kategori bisa langsung dipakai */
      const simpan = bacaSimpanan();
      if (simpan) {
        gunung = simpan;
        sambungkan();
      } else {
        muatDaftarGunung();
      }

      if (!erupsi.length && !gunung.length) throw new Error('data gunung api kosong');
    },

    segarkan: async function () {
      try {
        await this.muat();
      } catch (e) {
        PD.setStatus('gunung: gagal menyegarkan');
      }
    },

    gambar: gambar,

    klik: function (x, y) {
      /* erupsi diprioritaskan: posisinya sering bertumpuk dengan gunungnya */
      const e = A.bidik(layar.filter(function (d) { return d.jenis === 'erupsi'; }), x, y, 16);
      if (e) {
        PD.tampilkanInfo(kartuErupsi(e.e));
        return true;
      }
      const g = A.bidik(layar, x, y, 14);
      if (!g) return false;
      PD.tampilkanInfo(kartuGunung(g.g));
      return true;
    }
  });
})();
