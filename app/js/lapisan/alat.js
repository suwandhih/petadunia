/* ============================================================
   Peta Dunia — alat bantu gambar untuk semua lapisan
   ============================================================ */
(function () {
  'use strict';

  const A = (window.PD.alat = {});

  /* Buang tanda < > agar data dari internet tak bisa menyisipkan HTML. */
  A.aman = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /* Kartu isi panel informasi. baris = [[label, nilai], ...] */
  A.info = function (ikon, judul, baris) {
    let h =
      '<div class="info-judul"><span class="info-ikon">' + ikon + '</span>' +
      '<span>' + A.aman(judul) + '</span></div><table class="info-tabel">';
    for (const b of baris) {
      if (b[1] === null || b[1] === undefined || b[1] === '') continue;
      h += '<tr><td>' + A.aman(b[0]) + '</td><td>' + b[1] + '</td></tr>';
    }
    return h + '</table>';
  };

  /* Denyut halus 0..1 */
  A.denyut = function (waktu, periode, fase) {
    const f = (waktu / periode + (fase || 0)) % 1;
    return 0.5 - 0.5 * Math.cos(f * Math.PI * 2);
  };

  /* Cincin mengembang untuk gempa / letusan */
  A.gelombang = function (ctx, x, y, umur, rMaks, warna, tebal) {
    if (umur < 0 || umur > 1) return;
    const r = rMaks * (0.15 + 0.85 * umur);
    ctx.globalAlpha = (1 - umur) * 0.75;
    ctx.strokeStyle = warna;
    ctx.lineWidth = tebal || 1.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  /* Segitiga pesawat, hdg = arah dalam derajat (0 = utara) */
  A.pesawat = function (ctx, x, y, hdg, p, warna, alfa) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((hdg * Math.PI) / 180);
    ctx.globalAlpha = alfa === undefined ? 1 : alfa;
    ctx.fillStyle = warna;
    ctx.beginPath();
    ctx.moveTo(0, -p);
    ctx.lineTo(p * 0.6, p * 0.74);
    ctx.lineTo(0, p * 0.36);
    ctx.lineTo(-p * 0.6, p * 0.74);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  /* Badan kapal, hdg = arah dalam derajat */
  A.kapal = function (ctx, x, y, hdg, p, warna, alfa) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((hdg * Math.PI) / 180);
    ctx.globalAlpha = alfa === undefined ? 1 : alfa;
    ctx.fillStyle = warna;
    ctx.beginPath();
    ctx.moveTo(0, -p);
    ctx.lineTo(p * 0.62, p * 0.3);
    ctx.lineTo(p * 0.45, p * 0.82);
    ctx.lineTo(-p * 0.45, p * 0.82);
    ctx.lineTo(-p * 0.62, p * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  /* Kereta: kotak kecil https:// dengan garis rel di belakang */
  A.kereta = function (ctx, x, y, hdg, p, warna, alfa) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((hdg * Math.PI) / 180);
    ctx.globalAlpha = alfa === undefined ? 1 : alfa;
    ctx.fillStyle = warna;
    ctx.fillRect(-p * 0.5, -p, p, p * 2);
    ctx.globalAlpha = (alfa === undefined ? 1 : alfa) * 0.5;
    ctx.strokeStyle = warna;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p * 0.28, 0);
    ctx.lineTo(p * 0.28, 0);
    ctx.stroke();
    ctx.restore();
  };

  /* Lingkaran kecil berisi angka/label */
  A.label = function (ctx, x, y, teks, warna, ukuran) {
    const u = ukuran || 11;
    ctx.font = '600 ' + u + 'px system-ui,sans-serif';
    const w = ctx.measureText(teks).width;
    const px = x + 8;
    const py = y - u * 0.9;
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = 'rgba(4,8,14,0.85)';
    ctx.beginPath();
    ctx.roundRect(px - 4, py - u * 0.85, w + 8, u * 1.7, 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = warna;
    ctx.textBaseline = 'middle';
    ctx.fillText(teks, px, py);
  };

  /* Warna menurut nilai 0..1 dari biru ke merah */
  A.panas = function (v) {
    const t = Math.max(0, Math.min(1, v));
    const r = Math.round(255 * Math.min(1, t * 1.6));
    const g = Math.round(255 * Math.max(0, Math.min(1, 1.3 - Math.abs(t - 0.55) * 2.2)));
    const b = Math.round(255 * Math.max(0, 1 - t * 1.9));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  };

  /* Klik pada titik: pakai daftar layar hasil gambar terakhir */
  A.bidik = function (daftar, x, y, toleransi) {
    const t = (toleransi || 12) * (toleransi || 12);
    let dekat = null;
    let jarak = Infinity;
    for (const d of daftar) {
      const dx = d.x - x;
      const dy = d.y - y;
      const j = dx * dx + dy * dy;
      if (j < t && j < jarak) {
        jarak = j;
        dekat = d;
      }
    }
    return dekat;
  };

  /* ------------------------------------------------------------
       Lapisan gambar di peta (dipakai radar hujan, dsb).

       Aturan yang sudah dibuktikan lewat uji:
       1) Saat gaya peta DIGANTI (tombol Satelit/Peta), lapisan ini harus
          DILEPAS lebih dulu. Kalau tidak, MapLibre melempar galat
          "Cannot read properties of undefined (reading 'bind')" berulang
          dari renderLayer(). Diuji 7 Okt 2026: lepas dulu = 0 galat.
       2) Saat kategori sekadar DIMATIKAN, sumber cukup disembunyikan
          (opacity 0) — tidak perlu dilepas, dan ini menghindari gambar
          diambil ulang dari peladen.
       3) Tukar gambar memakai setTiles() supaya ubin lama yang masih
          dipakai tidak diambil ulang — hemat permintaan ke peladen.
       4) Gaya peta kadang belum selesai dimuat; pemasangan diulang
          sampai gaya benar-benar siap (isStyleLoaded()).
       ------------------------------------------------------------ */
    A.lapisan = function (id, opsi) {
      const o = opsi || {};
      const sumber = 'sumber-' + id;
      const lapis = 'lapis-' + id;
      const alfaAwal = o.opacity === undefined ? 0.8 : o.opacity;
      /* Opasitas yang berlaku sekarang; boleh diubah pemakai lewat opasitas(). */
      let alfa = alfaAwal;
      /* Sifat warna (paint) tambahan, mis. 'raster-contrast'. Dipasang ulang
         setiap kali lapisan dibuat baru, sebab gaya peta bisa diganti. */
      const sifat = o.paint || null;
      let ubin = [];
      let aktif = false;
      let terdaftar = false;

      function susun(u) {
        if (!u) return [];
        return Array.isArray(u) ? u.slice() : [u];
      }

      ubin = susun(o.url || o.tiles);

      function adaSumber() {
        return !!(PD.peta && PD.peta.getSource && PD.peta.getSource(sumber));
      }

      function adaLapis() {
        return !!(PD.peta && PD.peta.getLayer && PD.peta.getLayer(lapis));
      }

      function buat() {
        if (!PD.peta || !PD.peta.addSource || !ubin.length) return false;
        if (!adaSumber()) {
          try {
            PD.peta.addSource(sumber, {
              type: 'raster',
              tiles: ubin,
              tileSize: o.tileSize || 256,
              minzoom: o.minzoom === undefined ? 0 : o.minzoom,
              maxzoom: o.maxzoom === undefined ? 9 : o.maxzoom,
              attribution: o.attribution || ''
            });
          } catch (e) {
            return false;
          }
        }
        if (!adaLapis()) {
          try {
            PD.peta.addLayer({
              id: lapis,
              type: 'raster',
              source: sumber,
              paint: {
                'raster-opacity': alfa,
                'raster-fade-duration': 0
              }
            });
          } catch (e) {
            return false;
          }
        }
        return true;
      }

      function setAlfa(v) {
              alfa = v;
              if (!adaLapis()) return;
              try {
                PD.peta.setPaintProperty(lapis, 'raster-opacity', v);
              } catch (e) { /* lewati */ }
            }

                  /* Pasang sifat warna tambahan sesudah lapisan ada. */
                  function setSifat() {
                    if (!sifat || !adaLapis()) return;
                    for (const nama of Object.keys(sifat)) {
                      try { PD.peta.setPaintProperty(lapis, nama, sifat[nama]); } catch (e) { /* lewati */ }
                    }
                  }

            /* Lepas lapisan + sumber dari peta, tanpa mengubah keadaan aktif. */
            function lepas() {
              if (!PD.peta) return;
              if (adaLapis()) {
                try { PD.peta.removeLayer(lapis); } catch (e) { /* sudah lepas */ }
              }
              if (adaSumber()) {
                try { PD.peta.removeSource(sumber); } catch (e) { /* masih dipakai */ }
              }
            }

      function pasang() {
        if (!PD.peta) return false;
              kaitGantiGaya();
              if (!aktif) return false;
              coba();
              return true;
            }

            function kaitGantiGaya() {
              if (!PD.peta || terdaftar) return;
              terdaftar = true;
              PD.peta.on('styledata', cekGantiGaya);
              PD.peta.on('style.load', ulangGaya);

              /* Pengaman utama: lapisan dilepas TEPAT SEBELUM gaya diganti,
                 bukan sesudahnya. */
              const asli = PD.peta.setStyle;
              if (typeof asli === 'function' && !asli._pdKait) {
                const bungkus = function () {
                  if (aktif) lepas();
                  return asli.apply(PD.peta, arguments);
                };
                bungkus._pdKait = true;
                PD.peta.setStyle = bungkus;
              }
            }

            /* Bila gaya peta berubah (tombol Satelit/Peta, atau MapLibre membangun
               ulang gaya karena sesuatu), lapisan ini harus dilepas lebih dulu.
               Dipakai dua pengaman:
               a) PD.peta.setStyle dikait (lihat kaitGantiGaya) — pelepasan
                  terjadi SEBELUM gaya benar-benar diganti.
               b) 'styledata' + bandingkan identitas objek gaya — jaring
                  pengaman bila gaya berubah tanpa lewat setStyle.
               Perbandingan memakai identitas objek, BUKAN getStyle().sources,
               sebab getStyle() mengembalikan objek baru tiap panggilan. */
            function cekGantiGaya() {
              if (!PD.peta || !aktif) return;
              const s = PD.peta.style;
              if (!s) return;
              if (gayaTerakhir === null) { gayaTerakhir = s; return; }
              if (s !== gayaTerakhir) {
                gayaTerakhir = s;
                lepas();
              }
            }

            let gayaTerakhir = null;

            /* Gaya peta kadang belum selesai dimuat saat lapisan diminta
               (mis. tepat sesudah ganti gaya peta). Menambah sumber pada saat
               itu akan terhapus begitu gaya selesai dimuat, jadi kita TUNGGU
               sampai gaya benar-benar siap, baru dipasang. */
            let sisaCoba = 0;

            function gayaSiap() {
              if (!PD.peta) return false;
              if (typeof PD.peta.isStyleLoaded !== 'function') return true;
              try { return PD.peta.isStyleLoaded(); } catch (e) { return false; }
            }

            function coba() {
              if (!aktif || !PD.peta) return;
              if (!gayaSiap()) {
                if (sisaCoba++ < 240) setTimeout(coba, 250);
                return;
              }
              if (buat()) {
                setAlfa(alfa);
                              setSifat();
                              sisaCoba = 0;
                              return;
                            }
              if (sisaCoba++ < 240) setTimeout(coba, 250);
            }

            function ulangGaya() {
              if (aktif) coba();
            }

      return {
              pasang: function () { aktif = true; return pasang(); },
              /* hanya menyembunyikan — sumber TIDAK dibuang (lihat aturan 1) */
              hentikan: function () { aktif = false; setAlfa(0); },
              /* lepas dari peta tanpa mematikan; dipakai saat gaya peta berganti */
              buang: function () { lepas(); },
              /* hapus benar-benar lalu nonaktifkan */
              tutup: function () { aktif = false; lepas(); },
              /* ubah kepekatan lapisan (0 = hilang, 1 = penuh) */
                            opasitas: setAlfa,
              gantiUbin: function (t) {
                const baru = susun(t);
                if (baru.join('|') === ubin.join('|')) return;
                ubin = baru;
                if (!PD.peta || !adaSumber()) {
                  if (aktif) coba();
                  return;
                }
                const s = PD.peta.getSource(sumber);
                if (s && typeof s.setTiles === 'function') {
                  try { s.setTiles(ubin); } catch (e) { /* biarkan gambar lama */ }
                }
              }
            };
          };

    /* Ambil data JSON dengan penanganan galat yang rapi.
         Batas waktu WAJIB: sumber yang menggantung (tidak menjawab) akan
         mengunci kategori selamanya bila tidak dibatalkan.
         Dipecah dua: ambilBahan (satu tempat untuk batas waktu & galat) lalu
         pengubah bentuk (json/teks/xml). Cara ini menghindari `return` di
         dalam `try` — lihat pelajaran I8. */
      const A_BATAS_MS = 20000;

      async function ambilBahan(url, opsi) {
        const o = Object.assign({}, opsi || {});
        let penghitung = null;

        /* bila pemanggil sudah menyiapkan pembatal sendiri, hormati itu */
        if (!o.signal && typeof AbortController === 'function') {
          const pengawas = new AbortController();
          o.signal = pengawas.signal;
          penghitung = setTimeout(function () { pengawas.abort(); }, A_BATAS_MS);
        }

        let hasil = null;
        let galat = null;
        try {
          const r = await fetch(url, o);
          if (!r.ok) {
            galat = new Error('HTTP ' + r.status + ' ' + url);
          } else {
            hasil = r;
          }
        } catch (e) {
          galat = new Error(String(e && e.name === 'AbortError'
            ? 'HTTP 408 batas waktu (' + A_BATAS_MS + ' ms) ' + url
            : e));
        } finally {
          if (penghitung) clearTimeout(penghitung);
        }

        if (galat) throw galat;
        return hasil;
      }

      A.ambil = async function (url, opsi) {
        const r = await ambilBahan(url, opsi);
        return r.json();
      };

      /* Khusus berkas XML resmi (mis. tabel warna NASA). Diperiksa lebih
         dulu bahwa isinya memang XML, bukan halaman galat — pelajaran dari
         🐛 Kebakaran (NASA menjawab 200 tetapi isinya bukan data). */
      A.ambilXml = async function (url, opsi) {
        const r = await ambilBahan(url, opsi);
        const jenis = r.headers.get('content-type') || '';
        if (!/xml/i.test(jenis)) {
          throw new Error('jawaban bukan XML: ' + (jenis || 'jenis tidak diketahui'));
        }
        const teks = await r.text();
        const dok = new DOMParser().parseFromString(teks, 'text/xml');
        if (dok.getElementsByTagName('parsererror').length) {
          throw new Error('XML tidak bisa dibaca dari ' + url);
        }
        return dok;
      };
    })();
