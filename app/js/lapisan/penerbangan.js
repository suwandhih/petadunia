/* ============================================================
   Kategori: Penerbangan
   Sumber  : AirLabs (https://airlabs.co) — CORS `*`, jadi bisa
             dipanggil langsung dari berkas (file://)

   Kenapa AirLabs, bukan OpenSky
   -----------------------------
   OpenSky memang gratis tanpa kuota, TETAPI header CORS-nya hanya
   mengizinkan https://opensky-network.org sehingga peramban menolak
   halaman file://. Sudah diuji 7 Okt 2026:
     Access-Control-Allow-Origin: https://opensky-network.org
   Sumber gratis tanpa kunci lain (adsb.lol, adsb.fi, airplanes.live,
   adsb.one, globe.adsbexchange.com) semuanya TIDAK punya header CORS.
   AirLabs punya `Access-Control-Allow-Origin: *`.

   Kunci API
   ---------
   Kunci TIDAK ditulis di dalam berkas ini (aturan F8/F5: jangan
   simpan rahasia di kode). Bapak menempelkannya lewat kotak isian
   di panel, dan kunci disimpan di localStorage peramban sendiri.

   Jatah gratis hanya 1.000 kueri/bulan
   ------------------------------------
   Karena itu:
   - penyegaran berkala dibuat JARANG (tiap 30 menit), bukan tiap menit;
   - ada tombol "Segarkan" untuk memanggil saat Bapak mau;
   - wilayah yang diminta dibatasi kotak layar (bbox) + tingkat zoom,
     supaya satu panggilan pun langsung berguna.
   Hitungan kasar: 1 hari ≤ 16 pemakaian (bila kategori terus menyala),
   jadi kira-kira 1 bulan pemakaian normal masih di dalam jatah.
   ============================================================ */
(function () {
  'use strict';

  const A = PD.alat;

  const API = 'https://airlabs.co/api/v9/flights';
  const KUNCI_SIMPAN = 'pd_airlabs_key';
  const BIDANG =
    'hex,flag,lat,lng,dir,alt,speed,flight_iata,flight_icao,' +
    'aircraft_icao,status,dep_iata,arr_iata,airline_iata';
  const JEDA_SIMPAN = 1800000; /* 30 menit — penjaga jatah 1.000 kueri */
  const JEDA_MIN = 20000; /* sekurang-kurangnya 20 detik antar panggilan */
  const MAKS_KAPAL = 400; /* batasi jumlah titik agar ringan */
  const ZOOM_MIN = 1; /* di bawah ini terlalu luas, hemat jatah */
  const ZOOM_MAKS = 9;

  let pesawat = [];
  let layar = [];
  let dicari = null; /* pesawat hasil pencarian, selalu ditampilkan */
  let kunci = '';
  let pesan = '';
  let terakhirAmbil = 0;
  let sedangAmbil = false;
  let siap = false;
  const JEDA_UCAP = 600000; /* pemberitahuan jatah: paling sering 10 menit sekali */
  const JATAH_BULAN = 1000; /* jatah gratis AirLabs (batas resmi paket free) */
  const JALUR_HITUNG = 'pd_airlabs_hitung'; /* catatan pemakaian kueri */
  /* Bila AirLabs bilang kuncinya tidak dikenali, kunci yang tersimpan
     pasti salah — jangan biarkan Bapak bingung mencari sebabnya. */
  let pesanSalahKunci = false;

  /* AirLabs tidak mengirim sisa jatah, jadi dihitung sendiri oleh aplikasi.
     Angka ini catatan kita sendiri — bukan angka resmi AirLabs. */
  let pemakaian = { bulan: '', kueri: 0 };
  let terakhirUcap = 0;

  /* ---------- kunci ---------- */
  /* Kunci AirLabs yang benar berbentuk kode panjang seperti ini:
     a1b2c3d4-5e6f-7890-abcd-ef1234567890 (32 angka/huruf dengan tanda hubung).
     Kunci "tidak dikenali" biasanya karena salah tempel — jadi diperiksa
     bentuknya LEBIH DULU sebelum dikirim, supaya Bapak langsung tahu. */
  const BENTUK_KUNCI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function bentukKunciOk(v) {
    return BENTUK_KUNCI.test(String(v || '').trim());
  }

  function bacaKunci() {
    try {
      return localStorage.getItem(KUNCI_SIMPAN) || '';
    } catch (e) {
      return '';
    }
  }

  function bulanIni() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function bacaPemakaian() {
    const b = bulanIni();
    try {
      const t = JSON.parse(localStorage.getItem(JALUR_HITUNG) || '{}');
      pemakaian =
        t && t.bulan === b ? { bulan: b, kueri: Number(t.kueri) || 0 } : { bulan: b, kueri: 0 };
    } catch (e) {
      pemakaian = { bulan: b, kueri: 0 };
    }
  }

  function catatKueri(n) {
    if (pemakaian.bulan !== bulanIni()) pemakaian = { bulan: bulanIni(), kueri: 0 };
    pemakaian.kueri += n;
    try {
      localStorage.setItem(JALUR_HITUNG, JSON.stringify(pemakaian));
    } catch (e) {
      /* diabaikan */
    }
  }

  function sisaPerkiraan() {
    return Math.max(0, JATAH_BULAN - pemakaian.kueri);
  }

  function simpanKunci(v) {
    try {
      localStorage.setItem(KUNCI_SIMPAN, v);
    } catch (e) {
      /* diabaikan */
    }
  }

  /* ---------- ambil data ---------- */
  function kotak() {
    const peta = PD.peta;
    if (!peta) return null;
    const b = peta.getBounds();
    const selatan = Math.max(-85, b.getSouth());
    const utara = Math.min(85, b.getNorth());
    if (utara <= selatan) return null;
    return [selatan, b.getWest(), utara, b.getEast()]
      .map(function (n) {
        return Math.round(n * 100) / 100;
      })
      .join(',');
  }

  /* Ubah nilai dari AirLabs menjadi angka. PENTING: Number(null) bernilai 0,
     jadi nilai kosong harus dianggap "tidak ada data", bukan angka 0 —
     supaya tidak ada angka karangan di kartu (mis. "Kecepatan 0 km/j"). */
  function keAngka(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function rapikan(d) {
    const a = Number(d.lat);
    const o = Number(d.lng);
    if (!Number.isFinite(a) || !Number.isFinite(o)) return null;
    const tinggi = keAngka(d.alt);
    const cepat = keAngka(d.speed);
    const arah = keAngka(d.dir);
    const asal = String(d.dep_iata || '').trim();
    const tujuan = String(d.arr_iata || '').trim();
    return {
      id: String(d.hex || d.flight_icao || Math.random()),
      nama: String(d.flight_iata || d.flight_icao || d.hex || 'Tanpa nama').trim(),
      jenis: d.aircraft_icao ? String(d.aircraft_icao).trim() : '',
      maskapai: d.airline_iata ? String(d.airline_iata).trim() : '',
      asal: asal,
      tujuan: tujuan,
      rute: asal && tujuan ? asal + ' → ' + tujuan : '',
      negara: d.flag ? String(d.flag).trim() : '',
      status: d.status ? String(d.status).trim() : '',
      /* arah 0 dipakai menggambar bila tidak ada data (pesawat tetap harus
         punya arah) — tapi di kartu tetap ditulis "—", bukan angka palsu */
      arah: arah === null ? 0 : arah,
      arahAda: arah !== null,
      cepat: cepat,
      tinggi: tinggi !== null && tinggi > 0 ? tinggi : null,
      lon: o,
      lat: a
    };
  }

  async function ambilPesawat(diam) {
    if (sedangAmbil || !PD.peta) return;
    if (!kunci) {
      pesan = 'Kunci AirLabs belum diisi';
      return;
    }
    if (!bentukKunciOk(kunci)) {
      pesan = 'Kunci AirLabs bentuknya salah — tempel ulang kuncinya';
      return;
    }
    const z = PD.peta.getZoom();
    if (z < ZOOM_MIN) {
      pesan = 'Perbesar peta dulu (zoom ' + ZOOM_MIN + '+), wilayahnya terlalu luas';
      return;
    }
    if (diam && Date.now() - terakhirAmbil < JEDA_MIN) return;

    const b = kotak();
    if (!b) return;

    sedangAmbil = true;
    try {
      const url =
        API +
        '?api_key=' +
        encodeURIComponent(kunci) +
        '&bbox=' +
        b +
        '&zoom=' +
        Math.max(0, Math.min(ZOOM_MAKS, Math.round(z))) +
        '&_view=array' +
        '&_fields=' +
        BIDANG;
      catatKueri(1);
      const j = await A.ambil(url);

      if (j && j.error) {
        const m = String(j.error.message || j.error);
        const kunciSalah = /api_key|api key|not found|unknown/i.test(m);
        pesan = kunciSalah
          ? 'Kunci AirLabs tidak dikenali — tempel ulang kuncinya'
          : 'AirLabs: ' + m.slice(0, 90);
        if (kunciSalah) pesanSalahKunci = true;
        pesawat = [];
      } else {
        pesanSalahKunci = false;
        pesawat = bacaBaris(j).slice(0, MAKS_KAPAL);
        terakhirAmbil = Date.now();
        pesan = pesawat.length ? '' : 'Tidak ada pesawat terdeteksi di wilayah ini';
        siap = true;
      }
    } catch (e) {
      const t = String(e);
      pesan =
        t.indexOf('429') >= 0
          ? 'Jatah AirLabs habis — coba lagi nanti'
          : t.indexOf('408') >= 0 || t.indexOf('batas waktu') >= 0
            ? 'AirLabs tidak menjawab (waktu habis) — coba lagi'
            : 'Gagal mengambil data penerbangan';
      ucapJatah(t.indexOf('429') >= 0);
    } finally {
      /* wajib: kalau tidak, satu kegagalan akan mengunci pengambilan berikutnya */
      sedangAmbil = false;
    }
  }

  /* Beri tahu Bapak di bilah bawah — tapi tidak lebih dari sekali / 10 menit,
     supaya tidak jadi gangguan. */
  function ucapJatah(habis) {
    if (!habis && sisaPerkiraan() > 50) return;
    if (Date.now() - terakhirUcap < JEDA_UCAP) return;
    terakhirUcap = Date.now();
    PD.setStatus(
      habis
        ? 'jatah AirLabs habis — tunggu bulan berikutnya atau buat kunci baru'
        : 'perkiraan sisa jatah AirLabs ' + PD.angka(sisaPerkiraan(), 0) + ' kueri'
    );
  }

  /* AirLabs bisa menjawab dalam bentuk larik (array view) atau objek. */
  function bacaBaris(j) {
    const baris = Array.isArray(j) ? j : j && Array.isArray(j.response) ? j.response : [];
    const namaBidang = BIDANG.split(',');
    const hasil = [];
    for (const b of baris) {
      let o;
      if (Array.isArray(b)) {
        o = {};
        namaBidang.forEach(function (n, i) {
          o[n] = b[i];
        });
      } else {
        o = b;
      }
      const p = rapikan(o);
      if (p) hasil.push(p);
    }
    return hasil;
  }

  /* Cari satu penerbangan menurut nomornya (mis. GIA612 atau GA612).
         AirLabs mencari di SELURUH dunia, jadi 1 kueri saja — sangat hemat
         jatah. Bila nomor penerbangan tak ada, dicoba sebagai kode ICAO24
         (hex) pesawat. */
  async function cariPenerbangan(tanya) {
    if (!kunci) {
      pesan = 'Kunci AirLabs belum diisi';
      return;
    }
    if (sedangAmbil) return;
    const q = String(tanya || '')
      .trim()
      .toUpperCase();
    if (!q) {
      pesan = 'Tulis dulu nomor penerbangannya';
      return;
    }

    sedangAmbil = true;
    pesan = 'Mencari ' + q + '…';
    try {
      const dasar =
        API + '?api_key=' + encodeURIComponent(kunci) + '&_view=array&_fields=' + BIDANG;

      /* nomor penerbangan IATA (mis. GA612) lebih dulu, sebab
         dianggap paling mungkin dipakai Bapak */
      let hasil = bacaBaris(await A.ambil(dasar + '&flight_iata=' + encodeURIComponent(q)));
      catatKueri(1);
      if (!hasil.length) {
        hasil = bacaBaris(await A.ambil(dasar + '&flight_icao=' + encodeURIComponent(q)));
        catatKueri(1);
      }
      if (!hasil.length) {
        hasil = bacaBaris(await A.ambil(dasar + '&flight_number=' + encodeURIComponent(q)));
        catatKueri(1);
      }
      if (!hasil.length) {
        hasil = bacaBaris(await A.ambil(dasar + '&hex=' + encodeURIComponent(q)));
        catatKueri(1);
      }

      if (!hasil.length) {
        dicari = null;
        pesan = q + ' tidak ditemukan (bisa jadi belum terbang atau nomornya keliru)';
        return;
      }

      dicari = hasil[0];
      if (dicari.lat && dicari.lat !== 0) {
        PD.peta.flyTo({ center: [dicari.lon, dicari.lat], zoom: 7, speed: 1.4 });
      }
      pesan = '';
      terakhirAmbil = Date.now();
      PD.setStatus('menampilkan ' + dicari.nama);
      PD.tampilkanInfo(kartuPesawat(dicari));
    } catch (e) {
      const t = String(e);
      pesan =
        t.indexOf('429') >= 0
          ? 'Jatah AirLabs habis — coba lagi nanti'
          : t.indexOf('408') >= 0 || t.indexOf('batas waktu') >= 0
            ? 'AirLabs tidak menjawab (waktu habis) — coba lagi'
            : 'Pencarian gagal';
      ucapJatah(t.indexOf('429') >= 0);
    } finally {
      /* wajib: kalau tidak, satu pencarian gagal akan mengunci pencarian berikutnya */
      sedangAmbil = false;
    }
  }

  function layout() {
    layar = [];
  }

  /* Hitung berapa pesawat yang benar-benar tampak di layar saat ini.
     Dipakai syarat yang SAMA dengan animasi (lihat gambarSatu), supaya angka
     di kartu tidak pernah berbeda dari yang Bapak lihat di peta. */
  function hitungDiLayar() {
    if (!PD.peta || typeof PD.layar !== 'function') return 0;
    let n = 0;
    for (const p of pesawat) {
      const c = PD.layar(p.lon, p.lat);
      if (!c) continue;
      if (c.x < -40 || c.y < -40 || c.x > innerWidth + 40 || c.y > innerHeight + 40) continue;
      n++;
    }
    return n;
  }

  /* ---------- tampilan ---------- */
  function kartuDaftar() {
    bacaPemakaian();
    const punya = !!bacaKunci();
    let h = A.info('✈️', 'Penerbangan — AirLabs', [
      ['Keadaan', pesan ? pesan : punya ? 'Siap' : 'Kunci belum diisi'],
      ['Pesawat di layar', punya ? PD.angka(hitungDiLayar(), 0) : '—'],
      ['Pesawat terambil', punya ? PD.angka(pesawat.length, 0) : '—'],
      ['Sedang disorot', dicari ? dicari.nama : '—'],
      ['Jeda segar', '30 menit (penjaga jatah 1.000/bulan)'],
      [
        'Sisa jatah',
        'perkiraan ' + PD.angka(sisaPerkiraan(), 0) + ' dari ' + JATAH_BULAN + ' (hitungan sendiri)'
      ]
    ]);
    if (punya && pesawat.length >= MAKS_KAPAL) {
      h +=
        '<div class="info-catatan">Dibatasi ' +
        MAKS_KAPAL +
        ' pesawat ' +
        'terdekat saja agar peta tetap ringan. Perbesar peta untuk wilayah ' +
        'yang lebih sempit.</div>';
    }
    if (punya && pesanSalahKunci) {
      h +=
        '<div class="info-catatan" style="color:#ffb4b4">Kunci yang tersimpan ' +
        'tidak dikenali AirLabs. Tempel ulang kunci yang benar di kotak di ' +
        'bawah.</div>';
    }
    h +=
      '<button id="segarkan-penerbangan" class="info-tombol">Segarkan sekarang</button>' +
      '<div class="info-catatan">Kunci gratis dari airlabs.co. Kunci hanya ' +
      'disimpan di peramban Bapak sendiri, tidak dikirim ke mana pun selain ' +
      'AirLabs.</div>' +
      '<input id="kunci-airlabs" class="info-kotak" type="text" ' +
      'placeholder="tempelkan API key di sini (32 huruf/angka dengan tanda hubung)" ' +
      'value="' +
      A.aman(punya ? kunci : '') +
      '">' +
      (punya
        ? '<button id="hapus-kunci" class="info-tombol pudar">Hapus kunci</button>'
        : '') +
      '<button id="simpan-kunci" class="info-tombol">Simpan &amp; ambil data</button>' +
      '<button id="tutup-kunci" class="info-tombol pudar">Tutup</button>';

    if (punya) {
      h +=
        '<div class="info-catatan" style="margin-top:10px">Cari penerbangan ' +
        'tertentu (contoh: GIA612). Hanya perlu 1 kueri, jadi hemat jatah.</div>' +
        '<input id="cari-penerbangan" class="info-kotak" type="text" ' +
        'placeholder="nomor penerbangan / kode pesawat">' +
        '<button id="tombol-cari" class="info-tombol">Cari &amp; sorot</button>' +
        '<button id="tombol-lepas-cari" class="info-tombol pudar">Lepas sorotan</button>';
    }

    PD.tampilkanInfo(h);

    const el = document.getElementById('kunci-airlabs');
    const simpan = document.getElementById('simpan-kunci');
    const tutup = document.getElementById('tutup-kunci');
    const segarkan = document.getElementById('segarkan-penerbangan');
    const hapus = document.getElementById('hapus-kunci');
    if (tutup) tutup.addEventListener('click', PD.tutupInfo);
    if (segarkan) {
      segarkan.addEventListener('click', function () {
        terakhirAmbil = 0;
        PD.setStatus('mengambil data penerbangan…');
        ambilPesawat(false).then(kartuDaftar);
      });
    }
    if (hapus) {
      hapus.addEventListener('click', function () {
        kunci = '';
        pesanSalahKunci = false;
        pesawat = [];
        pesan = 'Kunci AirLabs belum diisi';
        try { localStorage.removeItem(KUNCI_SIMPAN); } catch (e) { /* diabaikan */ }
        PD.setStatus('kunci AirLabs dihapus');
        kartuDaftar();
      });
    }
    if (simpan && el) {
      simpan.addEventListener('click', function () {
        const v = String(el.value || '').trim();
        if (!v) {
          PD.setStatus('kunci AirLabs masih kosong');
          return;
        }
        /* Kunci AirLabs harus berbentuk kode panjang bertanda hubung. Kalau
           tidak, hentikan lebih dulu supaya jelas salahnya di mana. */
        if (!bentukKunciOk(v)) {
          kunci = v;
          simpanKunci(v);
          pesanSalahKunci = true;
          pesan = 'Kunci AirLabs bentuknya salah — tempel ulang kuncinya';
          PD.setStatus('kunci AirLabs bentuknya salah (contoh yang benar: ' +
            'a1b2c3d4-5e6f-7890-abcd-ef1234567890)');
          kartuDaftar();
          return;
        }
        kunci = v;
        simpanKunci(v);
        terakhirAmbil = 0;
        pesanSalahKunci = false;
        PD.setStatus('kunci tersimpan — mengambil data…');
        ambilPesawat(false).then(kartuDaftar);
      });
    }

    const cari = document.getElementById('cari-penerbangan');
    const tombolCari = document.getElementById('tombol-cari');
    const lepasCari = document.getElementById('tombol-lepas-cari');
    if (tombolCari && cari) {
      tombolCari.addEventListener('click', function () {
        cariPenerbangan(cari.value);
      });
      cari.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') cariPenerbangan(cari.value);
      });
    }
    if (lepasCari) {
      lepasCari.addEventListener('click', function () {
        dicari = null;
        PD.setStatus('sorotan dilepas');
      });
    }
  }

  function kartuPesawat(p) {
    return A.info('✈️', A.aman(p.nama), [
      ['Rute', p.rute ? A.aman(p.rute) : '—'],
      ['Maskapai', A.aman(p.maskapai || p.negara) || '—'],
      ['Jenis pesawat', A.aman(p.jenis) || '—'],
      ['Ketinggian', p.tinggi === null ? '—' : PD.angka(p.tinggi, 0) + ' m'],
      ['Kecepatan', p.cepat === null ? '—' : PD.angka(p.cepat, 0) + ' km/j'],
      ['Arah terbang', p.arahAda ? PD.angka(p.arah, 0) + '°' : '—'],
      ['Keadaan', A.aman(p.status) || '—'],
      ['Koordinat', PD.angka(p.lat, 3) + ', ' + PD.angka(p.lon, 3)]
    ]);
  }

  /* ---------- modul ---------- */
  PD.daftar({
    id: 'penerbangan',
    nama: 'Penerbangan',
    ikon: '✈️',
    ket: 'AirLabs · posisi langsung',
    jeda: JEDA_SIMPAN,

    muat: async function () {
      kunci = bacaKunci();
      if (!kunci) {
        /* belum ada kunci: tetap boleh dinyalakan, langsung minta kunci */
        pesan = 'Kunci AirLabs belum diisi';
        return;
      }
      await ambilPesawat(false);
      const ada = pesawat.length > 0;
      if (!ada && pesan && pesan.indexOf('Jatah') >= 0) {
        throw new Error(pesan);
      }
    },

    segarkan: async function () {
      await ambilPesawat(true);
    },

    nyalakan: function () {
      if (!kunci) kartuDaftar();
    },

    matikan: function () {
      dicari = null;
      /* peringatan kunci bentuk salah jangan nyangkut ke sesi berikutnya */
      pesanSalahKunci = false;
    },

    gambar: function (ctx, dt, waktu) {
      layar = [];
      const arus = Math.max(6, ctx.canvas.width / (window.devicePixelRatio || 1) / 130);

      function gambarSatu(p, sorot) {
        const c = PD.layar(p.lon, p.lat);
        if (!c) return;
        if (!sorot && (c.x < -40 || c.y < -40 || c.x > innerWidth + 40 || c.y > innerHeight + 40))
          return;

        /* pesawat tampak terbang maju pelan: gambar digeser sedikit
               searah arah terbang, lalu ditarik balik tiap 3 detik supaya
               tidak pernah menyimpang jauh dari posisi sebenarnya.
               Ketinggian (p.tinggi) tidak dipakai menebak posisi — data
               selalu data, bukan karangan. */
        const geser = ((waktu % 3) / 3) * arus;
        const rad = (p.arah * Math.PI) / 180;
        const x = c.x + Math.sin(rad) * geser;
        const y = c.y - Math.cos(rad) * geser;

        const tinggiRendah = p.tinggi !== null && p.tinggi < 3000;
        const warna = sorot ? '#ff5ea8' : tinggiRendah ? '#ffd166' : '#67e8f9';

        if (sorot) {
          const denyut = 0.55 + 0.45 * Math.sin(waktu * 3);
          A.gelombang(ctx, x, y, 1 - ((waktu / 1.6) % 1), 26, warna, 2);
          PD.cahaya(ctx, x, y, 16, warna, 0.5 * denyut);
        }
        A.pesawat(ctx, x, y, p.arah, sorot ? 9 : 6.5, warna, 0.95);
        if (sorot) {
          A.label(ctx, x, y, p.nama + (p.rute ? '  ' + p.rute : ''), warna, 12);
        }
        layar.push({ x: x, y: y, r: 13, p: p });
      }

      for (const p of pesawat) gambarSatu(p, false);
      if (dicari) gambarSatu(dicari, true);

      let teks;
      if (!kunci) {
        teks = 'kunci AirLabs belum diisi';
      } else if (dicari) {
        teks =
          'menyorot ' +
          dicari.nama +
          (pesawat.length ? ' · ' + PD.angka(hitungDiLayar(), 0) + ' pesawat di layar' : '');
      } else if (pesawat.length) {
        teks = PD.angka(layar.length, 0) + ' pesawat tampak dari ' + PD.angka(pesawat.length, 0);
      } else {
        teks = 'belum ada pesawat';
      }

      const saat = terakhirAmbil ? PD.sejak(new Date(terakhirAmbil).toISOString()) : null;

      PD.ringkas(
        'penerbangan',
        teks,
        pesan ? pesan : saat ? 'Data diambil ' + saat : null,
        pesan ? 'merah' : dicari ? 'jingga' : terakhirAmbil ? 'hijau' : null
      );
    },

    klik: function (x, y) {
      /* hasil pencarian didahulukan supaya mudah diketuk */
      if (dicari) {
        const c = PD.layar(dicari.lon, dicari.lat);
        if (c) {
          const dx = c.x - x;
          const dy = c.y - y;
          if (dx * dx + dy * dy < 20 * 20) {
            PD.tampilkanInfo(kartuPesawat(dicari));
            return true;
          }
        }
      }
      const d = A.bidik(layar, x, y, 14);
      if (d) {
        PD.tampilkanInfo(kartuPesawat(d.p));
        return true;
      }
      /* ketuk di tempat kosong: buka pencarian + pengaturan kunci */
      kartuDaftar();
      return true;
    }
  });
})();
