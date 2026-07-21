/**
 * config.js
 * GANTI URL di bawah dengan URL Web App hasil deploy Apps Script kamu.
 * Cara ambil: buka project Apps Script -> Deploy -> Manage deployments
 * -> Web app -> copy "Web app URL" (yang berakhiran /exec).
 */
const API_URL = "https://script.google.com/macros/s/GANTI_DENGAN_DEPLOYMENT_ID_KAMU/exec";

/**
 * Logo aplikasi / Super Admin. Dipakai di halaman login, dan di sidebar
 * dashboard dkk saat Super Admin sedang memilih "Semua Masjid" (karena
 * akun Super Admin gak terikat ke satu masjid, jadi gak punya logo masjid
 * sendiri). Boleh diisi path lokal (mis. "assets/logos/superadmin.png")
 * atau link https biasa. Kosongkan ("") kalau belum ada, nanti otomatis
 * fallback ke ikon bulan-bintang.
 */
const APP_LOGO = "";
