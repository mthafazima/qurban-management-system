/**
 * auth.js
 * Sesi disimpan di sessionStorage (bukan localStorage) supaya otomatis
 * hilang saat tab ditutup — cocok buat perangkat scan bersama di lapangan.
 *
 * Pengecualian: kalau dibuka lewat app Android pembungkus (dikenali dari
 * user agent "KuponQurbanApp"), sesi disimpan di localStorage supaya tidak
 * perlu login ulang tiap kali app ditutup/di-swipe dari Recents — device
 * app itu diasumsikan punya masing-masing petugas, bukan device bersama.
 */

const Auth = (function () {

  const KEY = "kupon_session";
  const TARGET_KEY = "kupon_target_masjid";
  const store = /KuponQurbanApp/.test(navigator.userAgent) ? window.localStorage : window.sessionStorage;

  function setSession(data) {
    store.setItem(KEY, JSON.stringify(data));
  }

  function getSession() {
    const raw = store.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    store.removeItem(KEY);
    store.removeItem(TARGET_KEY);
  }

  function setTargetMasjid(idMasjid) {
    if (idMasjid) store.setItem(TARGET_KEY, idMasjid);
    else store.removeItem(TARGET_KEY);
  }

  function getTargetMasjid() {
    const session = getSession();
    if (!session) return "";
    if (session.role !== "SUPER_ADMIN") return "";
    return store.getItem(TARGET_KEY) || "";
  }

  // Panggil di awal setiap halaman terproteksi.
  function requireLogin() {
    const session = getSession();
    if (!session) {
      window.location.href = "index.html";
      return null;
    }
    return session;
  }

  function requireRole(allowedRoles) {
    const session = requireLogin();
    if (!session) return null;
    if (allowedRoles.indexOf(session.role) === -1) {
      window.location.href = "dashboard.html";
      return null;
    }
    return session;
  }

  function logout() {
    clearSession();
    window.location.href = "index.html";
  }

  return {
    setSession, getSession, clearSession,
    setTargetMasjid, getTargetMasjid,
    requireLogin, requireRole, logout
  };
})();