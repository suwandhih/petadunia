/* ============================================================
   Pencarian lokasi — nama tempat → pindah peta ke lokasi itu

   Sumber  : Open-Meteo Geocoding
             https://geocoding-api.open-meteo.com/v1/search
             CORS `*`, tanpa kunci — diuji `curl` 8 Okt 2026
   Cadangan: Nominatim OpenStreetMap
             https://nominatim.openstreetmap.org/search?format=json&q=…
             CORS `*`, tanpa kunci — diuji `curl` 8 Okt 2026

   Yang dilakukan
   --------------
   - Kotak 🔍 di bilah atas. Ketik ≥2 huruf → daftar hasil muncul.
   - Pilih satu hasil → peta bergerak ke lokasi + tanda 📍 dipasang.
   - Nama tempat diambil APA ADANYA dari sumber (aturan F8).

   Catatan penting
   ---------------
   Tanda 📍 digambar sendiri di kanvas, BUKAN memakai Marker MapLibre,
   supaya bisa disembunyikan saat berada di balik bola dunia (aturan F9).

   Kategori lain boleh menyisipkan baris ke kartu lokasi lewat
   PD.cari.tambahanKartu(id, baris) — dipakai 🌡️ Suhu Permukaan untuk
   menampilkan derajat °C. Setiap kali lokasi berubah, kejadian
   `pd:cari` disiarkan supaya kategori yang berminat menghitung ulang.
   ============================================================ */
(function () {
  'use strict';

  /* A diambil SAAT DIPAKAI, bukan saat berkas dimuat — supaya urutan
     pemuatan berkas di index.html tidak bisa membuat kategori ini bisu. */
  function alat() {
    return PD.alat;
  }

  const SUMBER = 'https://geocoding-api.open-meteo.com/v1/search';
  const CADANGAN = 'https://nominatim.openstreetmap.org/search?format=json&limit=8&q=';

  const cari = (PD.cari = {
    tujuan: null,
    pasang: pasang,
    gambar: gambarPenanda,
    tambahanKartu: tambahanKartu
  });

  /* Titik tujuan, ditanyakan kategori lain (mis. Suhu). Fungsi, bukan
     nilai, supaya selalu yang terbaru. */
  cari.titik = function () {
    return cari.tujuan ? { lon: cari.tujuan.lon, lat: cari.tujuan.lat } : null;
  };

  let kotak = null;
  let daftar = null;
  let tunda = null;
  let urutan = 0;

  /* ---------- ubah jawaban sumber jadi daftar sederhana ---------- */
  function dariOpenMeteo(j) {
    return (j.results || []).map(function (t) {
      const wilayah = [t.admin2, t.admin1, t.country].filter(Boolean);
      return {
        nama: t.name,
        rinci: wilayah.join(', '),
        negara: t.country || '',
        lat: t.latitude,
        lon: t.longitude,
        tinggi: typeof t.elevation === 'number' ? t.elevation : null,
        dari: 'Open-Meteo Geocoding'
      };
    });
  }

  function dariNominatim(j) {
    return (j || []).map(function (t) {
      const bagian = String(t.display_name || '').split(',');
      const nama = (bagian[0] || '').trim();
      const rinci = bagian.slice(1).join(',').trim();
      const potong = rinci.split(',');
      return {
        nama: nama || '—',
        rinci: rinci,
        negara: (potong[potong.length - 1] || '').trim(),
        lat: parseFloat(t.lat),
        lon: parseFloat(t.lon),
        tinggi: null,
        dari: 'Nominatim (OpenStreetMap)'
      };
    }).filter(function (t) {
      return Number.isFinite(t.lat) && Number.isFinite(t.lon);
    });
  }

  /* ---------- cari di sumber: utama dulu, cadangan bila gagal ---------- */
  let memakaiCadangan = false;

  async function cariTempat(kata) {
    try {
      const j = await alat().ambil(SUMBER + '?name=' + encodeURIComponent(kata) +
        '&count=8&language=id');
      memakaiCadangan = false;
      return dariOpenMeteo(j);
    } catch (e) {
      /* Sumber utama tidak menjawab (mis. jatah habis) → pindah ke cadangan
         dan BERI TAHU bahwa sedang memakai cadangan (aturan F21). */
      PD.setStatus('sumber utama tidak menjawab — memakai sumber cadangan…');
      const j = await alat().ambil(CADANGAN + encodeURIComponent(kata));
      memakaiCadangan = true;
      return dariNominatim(j);
    }
  }

  /* ---------- daftar hasil ---------- */
  function tutupDaftar() {
    if (!daftar) return;
    daftar.hidden = true;
    daftar.innerHTML = '';
  }

  function tampilkanDaftar(hasil, kata) {
    daftar.innerHTML = '';
    const baris = [];

    if (!hasil.length) {
      const k = document.createElement('div');
      k.className = 'cari-kosong';
      k.textContent = 'Tidak ada tempat bernama “' + kata + '”';
      baris.push(k);
    } else {
      for (const t of hasil) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cari-hasil';
        b.innerHTML = '<b>' + alat().aman(t.nama) + '</b>' +
          '<small>' + alat().aman(t.rinci || '—') + '</small>';
        b.addEventListener('click', function () { pilih(t); });
        baris.push(b);
      }
    }
    for (const b of baris) daftar.appendChild(b);
    daftar.hidden = false;
  }

  /* ---------- pindah peta ke lokasi yang dipilih ---------- */
  function pilih(t) {
    cari.tujuan = t;
    kotak.value = t.nama;
    tutupDaftar();
    PD.peta.flyTo({
      center: [t.lon, t.lat],
      zoom: Math.max(PD.peta.getZoom(), 7),
      speed: 0.7,
      essential: true
    });
    PD.setStatus('📍 ' + t.nama + (t.rinci ? ' — ' + t.rinci : ''));
    PD.ringkas('cari', '📍 ' + t.nama, t.rinci || null, 'hijau');
    tampilkan();
    /* beri tahu kategori lain (mis. 🌡️ Suhu) bahwa lokasi berubah */
    document.dispatchEvent(new CustomEvent('pd:cari', { detail: t }));
  }

  /* ---------- kartu keterangan lokasi ---------- */
  const tambahan = [];

  function tambahanKartu(id, baris) {
    const lama = tambahan.findIndex(function (x) { return x.id === id; });
    if (lama >= 0) tambahan.splice(lama, 1);
    if (baris && baris.length) tambahan.push({ id: id, baris: baris });
    /* segarkan kartu hanya bila kartunya memang sedang terbuka */
    const panel = document.getElementById('panel-info');
    if (cari.tujuan && panel && !panel.classList.contains('sembunyi')) tampilkan();
  }

  function tampilkan() {
    const t = cari.tujuan;
    if (!t) return;
    const baris = [
      ['Wilayah', t.rinci || '—'],
      ['Negara', t.negara || '—'],
      ['Koordinat', PD.angka(t.lat, 4) + ', ' + PD.angka(t.lon, 4)],
      ['Tinggi tempat', t.tinggi === null ? '—' : PD.angka(t.tinggi, 0) + ' m']
    ];
    for (const x of tambahan) {
      for (const b of x.baris) baris.push(b);
    }
    baris.push(['Sumber', t.dari]);
    if (memakaiCadangan) {
      baris.push(['Catatan', 'Memakai sumber cadangan (Nominatim)']);
    }
    PD.tampilkanInfo(alat().info('📍', t.nama, baris));
  }

  /* ---------- tanda 📍 di peta ---------- */
  function gambarPenanda(ctx) {
    const t = cari.tujuan;
    if (!t || !PD.peta) return;
    const p = PD.layar(t.lon, t.lat);
    if (!p) return;   /* di balik globe → disembunyikan (aturan F9) */
    if (p.x < -60 || p.y < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60) return;

    const kedip = 0.55 + 0.45 * Math.abs(Math.sin(performance.now() / 700));
    PD.cahaya(ctx, p.x, p.y, 26, '#38bdf8', 0.26 * kedip);
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 6.2832);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.stroke();
    ctx.globalAlpha = 1;
    alat().label(ctx, p.x, p.y, t.nama, '#e6edf3', 12);
  }

  /* ---------- kotak cari di bilah atas ---------- */
  function pasang() {
    const kanan = document.querySelector('#bilah-atas .kanan');
    if (!kanan || kotak) return;

    const wadah = document.createElement('div');
    wadah.id = 'cari-lokasi';

    kotak = document.createElement('input');
    kotak.type = 'search';
    kotak.id = 'cari-kotak';
    kotak.placeholder = '🔍 Cari lokasi…';
    kotak.autocomplete = 'off';
    kotak.setAttribute('aria-label', 'Cari lokasi');

    daftar = document.createElement('div');
    daftar.id = 'cari-daftar';
    daftar.hidden = true;

    wadah.appendChild(kotak);
    wadah.appendChild(daftar);
    kanan.insertBefore(wadah, kanan.firstChild);

    kotak.addEventListener('input', function () {
      clearTimeout(tunda);
      const kata = kotak.value.trim();
      if (kata.length < 2) {
        tutupDaftar();
        return;
      }
      /* ditahan sebentar supaya tidak memanggil sumber tiap ketukan */
      tunda = setTimeout(function () { jalankan(kata); }, 350);
    });

    kotak.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        tutupDaftar();
        kotak.blur();
      }
    });

    document.addEventListener('click', function (ev) {
      if (!wadah.contains(ev.target)) tutupDaftar();
    });

    if (PD.peta) PD.peta.on('dragstart', tutupDaftar);
  }

  async function jalankan(kata) {
    const kini = ++urutan;
    PD.setStatus('mencari “' + kata + '”…');
    let hasil;
    try {
      hasil = await cariTempat(kata);
    } catch (e) {
      /* Pencarian gagal bukan gangguan mematikan — katakan apa adanya. */
      PD.setStatus('pencarian gagal: sumber tidak bisa dihubungi — coba lagi');
      tutupDaftar();
      return;
    }
    if (kini !== urutan) return;   /* sudah ada pencarian yang lebih baru */
    tampilkanDaftar(hasil, kata);
    PD.setStatus(hasil.length
      ? hasil.length + ' tempat ditemukan untuk “' + kata + '”'
      : 'tidak ada tempat bernama “' + kata + '”');
  }
})();
