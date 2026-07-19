/**
 * api.js
 * Wrapper fetch ke backend Apps Script. Semua endpoint backend adalah
 * doGet(?action=...&param=...), jadi kita selalu kirim GET dengan
 * query string. username selalu ikut otomatis dari sesi supaya
 * backend bisa validasi lewat getAdminContext().
 */

const Api = (function () {

  function buildUrl(action, params) {
    const url = new URL(API_URL);
    url.searchParams.set("action", action);

    const session = Auth.getSession();
    if (session && session.username) {
      url.searchParams.set("username", session.username);
    }

    // SUPER_ADMIN yang sedang "melihat" masjid tertentu
    const targetMasjid = Auth.getTargetMasjid();
    if (targetMasjid) {
      url.searchParams.set("id_masjid_target", targetMasjid);
    }

    Object.keys(params || {}).forEach(function (key) {
      const val = params[key];
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, val);
      }
    });

    return url.toString();
  }

  async function call(action, params) {
    if (!API_URL || API_URL.indexOf("GANTI_DENGAN") !== -1) {
      throw new Error(
        "URL API belum diatur. Buka assets/js/config.js dan isi API_URL dengan URL deployment Apps Script kamu."
      );
    }

    const res = await fetch(buildUrl(action, params));

    if (!res.ok) {
      throw new Error("HTTP_ERROR_" + res.status);
    }

    return res.json();
  }

  async function callCsv(action, params) {
    const res = await fetch(buildUrl(action, params));
    if (!res.ok) throw new Error("HTTP_ERROR_" + res.status);
    return res.text();
  }

  return { call, callCsv, buildUrl };
})();
