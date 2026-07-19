# Frontend Kupon Qurban

Frontend statis (HTML/CSS/JS murni, tanpa build tool) untuk backend Google Apps Script yang sudah ada (`Code.gs`, `Auth.gs`, dst). Tinggal buka folder ini di VS Code.

## Struktur
```
index.html        -> halaman login
dashboard.html     -> ringkasan kupon
scan.html          -> scan QR / input nomor untuk tukar kupon
kupon.html         -> tambah, generate massal, hapus, lihat daftar kupon
riwayat.html        -> riwayat penukaran + export CSV
admin.html         -> kelola akun admin (disembunyikan untuk role Petugas Scan)
masjid.html        -> kelola daftar masjid (khusus Super Admin)
assets/css/style.css
assets/js/config.js -> WAJIB diisi URL deployment Apps Script
assets/js/api.js    -> wrapper fetch ke backend
assets/js/auth.js   -> penyimpanan sesi login (sessionStorage)
assets/js/nav.js    -> render sidebar + helper toast/format
```

## Langkah setup

1. **Deploy backend sebagai Web App**
   Di editor Apps Script: `Deploy` -> `New deployment` -> pilih tipe **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (supaya bisa diakses dari frontend terpisah)
   Salin URL yang berakhiran `/exec`.

2. **Isi `assets/js/config.js`**
   ```js
   const API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

3. **Jalankan lokal**
   Buka folder ini di VS Code, pakai extension **Live Server** (klik kanan `index.html` -> "Open with Live Server"), atau jalankan `npx serve .`. Jangan buka `index.html` langsung lewat `file://` — beberapa browser memblokir fetch dari `file://` ke domain lain.

4. **Login**
   Pakai akun yang sudah ada di sheet `ADMIN`. Role menentukan menu yang muncul:
   - `SUPER_ADMIN` — semua menu, termasu bisa pilih/lihat semua masjid via dropdown di kanan atas
   - `ADMIN_MASJID` — semua menu kecuali Kelola Masjid, terbatas ke masjidnya sendiri
   - `ADMIN_SCAN` — Dashboard, Scan, Kelola Kupon, Riwayat saja

## Catatan teknis
- Semua request backend adalah `GET ?action=...` (sesuai router `doGet` di `Code.gs`), jadi tidak perlu server proxy — Apps Script Web App sudah mengizinkan CORS untuk GET.
- Sesi login disimpan di `sessionStorage` (bukan `localStorage`) supaya otomatis logout saat tab ditutup — cocok untuk perangkat scan bersama di lokasi.
- Scan QR pakai library `html5-qrcode` via CDN, otomatis fallback ke input nomor manual kalau kamera tidak tersedia/diizinkan.
- Kalau mau ganti palet warna, semua di `assets/css/style.css` bagian `:root` (nama variabel: `--paper`, `--green`, `--gold`, dst).
