# Logo Masjid (Lokal)

Taruh file logo masing-masing masjid di folder ini. Ini lebih ringan &
stabil dibanding link dari Drive/imgbb — gak gantung koneksi ke server
luar, dan gak akan pernah "broken link" karena kebijakan situs pihak
ketiga berubah.

## Cara pakai

1. Siapkan file logo (PNG dengan background transparan paling bagus,
   ukuran sekitar 200×200px sudah lebih dari cukup — di aplikasi logo
   cuma ditampilkan kecil).
2. Taruh file-nya di folder ini, kasih nama sesuai masjidnya, contoh:
   ```
   assets/logos/al-husniyah.png
   assets/logos/at-taufiq.png
   ```
3. Buka halaman **Kelola Masjid**, isi kolom "URL logo" dengan path
   relatifnya (bukan link https), contoh:
   ```
   assets/logos/al-husniyah.png
   ```
4. Simpan. Logo langsung kepakai di sidebar, dashboard, kelola kupon,
   sampai kartu tiket pas dicetak — tanpa perlu upload ke situs lain.

## Catatan

- Kalau nanti aplikasi ini di-hosting (bukan cuma dibuka lewat Live
  Server lokal), pastikan folder `assets/logos/` ikut ter-upload juga
  ke hosting-nya, supaya path relatifnya tetap valid.
- Nama file bebas asal gak ada spasi (pakai `-` atau `_`), dan
  ekstensinya sesuai format gambarnya (`.png`, `.jpg`, dst).
