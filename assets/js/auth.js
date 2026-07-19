/**
 * auth.js
 * Sesi disimpan di sessionStorage (bukan localStorage) supaya otomatis
 * hilang saat tab ditutup — cocok buat perangkat scan bersama di lapangan.
 */

const Auth = (function () {

  const KEY = "kupon_session";
  const TARGET_KEY = "kupon_target_masjid";

  function setSession(data) {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  }

  function getSession() {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(TARGET_KEY);
  }

  function setTargetMasjid(idMasjid) {
    if (idMasjid) sessionStorage.setItem(TARGET_KEY, idMasjid);
    else sessionStorage.removeItem(TARGET_KEY);
  }

  function getTargetMasjid() {
    const session = getSession();
    if (!session) return "";
    if (session.role !== "SUPER_ADMIN") return "";
    return sessionStorage.getItem(TARGET_KEY) || "";
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
