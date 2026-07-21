/**
 * nav.js
 * Membangun sidebar dari template, disesuaikan dengan role admin yang
 * sedang login. Dipanggil dari setiap halaman lewat renderShell(active).
 */

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>',
  kupon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 1 0 4 2 2 0 0 0-2 2h18a2 2 0 0 0-2-2 2 2 0 0 1 0-4 2 2 0 0 0 2-2H3Z"/><path d="M13 8v8" stroke-dasharray="2 2"/></svg>',
  riwayat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v5h5"/><path d="M3.1 13a9 9 0 1 0 2.6-6.6L3 8.5"/><path d="M12 7v5l3 3"/></svg>',
  admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c.7-3.2 3-5 5.5-5s4.8 1.8 5.5 5"/><path d="M16 4.5c1.6.4 2.7 1.8 2.7 3.5S17.6 11.1 16 11.5M18 15c1.9.4 3.2 1.9 3.5 5H19"/></svg>',
  masjid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V11l8-6 8 6v10"/><path d="M9 21v-6h6v6"/><path d="M12 5V2M10 3h4"/></svg>'
};

// Kalau URL logo yang disimpan bukan direct-link ke file gambar (mis. link
// viewer Google Drive, bukan link file .jpg/.png langsung), <img> akan gagal
// dimuat. Daripada nampilin ikon gambar-rusak, otomatis balik ke ikon SVG
// (bukan karakter Unicode ☪, karena itu suka nyaris gak kelihatan / gak
// konsisten dirender di berbagai font & printer/PDF).
const LOGO_FALLBACK_SVG =
  '<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor">' +
  '<path d="M14.8 3.6a8.8 8.8 0 1 0 5.8 15A9.8 9.8 0 0 1 14.8 3.6z"/>' +
  '<path d="M19.2 3.8l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z"/>' +
  '</svg>';

function handleLogoError(imgEl) {
  imgEl.onerror = null;
  imgEl.outerHTML = LOGO_FALLBACK_SVG;
}

function logoImgHtml(url) {
  return url
    ? '<img src="' + url + '" alt="" onerror="handleLogoError(this)">'
    : LOGO_FALLBACK_SVG;
}

function renderShell(active) {

  const session = Auth.requireLogin();
  if (!session) return;

  const isSuper = session.role === "SUPER_ADMIN";
  const canManageAdmin = session.role !== "ADMIN_SCAN";

  const navItems = [
    { key: "dashboard", label: "Dashboard", href: "dashboard.html", show: true },
    { key: "scan", label: "Scan Kupon", href: "scan.html", show: true },
    { key: "kupon", label: "Kelola Kupon", href: "kupon.html", show: true },
    { key: "riwayat", label: "Riwayat", href: "riwayat.html", show: true },
    { key: "admin", label: "Kelola Admin", href: "admin.html", show: canManageAdmin },
    { key: "masjid", label: "Kelola Masjid", href: "masjid.html", show: isSuper }
  ];

  const navHtml = navItems
    .filter(function (i) { return i.show; })
    .map(function (i) {
      const cls = i.key === active ? "nav-link active" : "nav-link";
      return '<a class="' + cls + '" href="' + i.href + '">' + ICONS[i.key] + '<span>' + i.label + '</span></a>';
    })
    .join("");

  const namaMasjid = session.nama_masjid || (isSuper ? "Semua Masjid" : "");
  const initial = (session.nama || "A").trim().charAt(0).toUpperCase();

  const roleLabelMap = {
    SUPER_ADMIN: "Super Admin",
    ADMIN_MASJID: "Admin Masjid",
    ADMIN_SCAN: "Petugas Scan"
  };

  document.body.insertAdjacentHTML("afterbegin", '<div class="sidebar-overlay" id="sidebarOverlay" style="display:none"></div>');

  const shell = document.getElementById("shell");
  shell.insertAdjacentHTML("afterbegin", `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark">${logoImgHtml(session.logo_masjid || (isSuper ? APP_LOGO : ""))}</div>
        <div class="brand-text">
          <div class="masjid-name">${namaMasjid || "Kupon Qurban"}</div>
          <div class="app-label">Kupon Qurban</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-eyebrow">Menu</div>
        ${navHtml}
      </div>
      <div class="sidebar-foot">
        <div class="user-chip">
          <div class="user-avatar">${initial}</div>
          <div class="user-meta">
            <div class="u-name">${session.nama || session.username}</div>
            <div class="u-role">${roleLabelMap[session.role] || session.role}</div>
          </div>
        </div>
        <button class="btn-logout" id="btnLogout">Keluar</button>
      </div>
    </aside>
  `);

  document.getElementById("btnLogout").addEventListener("click", Auth.logout);

  const hamburger = document.getElementById("hamburgerBtn");
  const overlay = document.getElementById("sidebarOverlay");
  const sidebarEl = document.getElementById("sidebar");

  function closeSidebar() {
    sidebarEl.classList.remove("open");
    overlay.style.display = "none";
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      sidebarEl.classList.add("open");
      overlay.style.display = "block";
    });
  }
  overlay.addEventListener("click", closeSidebar);

  return session;
}

function showToast(message, isError) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3200);
}

function fmtTanggal(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function statusBadge(status) {
  if (status === "SUDAH_DITUKAR") {
    return '<span class="badge badge-green">Sudah Ditukar</span>';
  }
  return '<span class="badge badge-gold">Belum Ditukar</span>';
}

/**
 * Switcher masjid terpusat (dipakai di semua halaman lewat elemen
 * #masjidSwitcherWrap) supaya logikanya cuma di satu tempat. Otomatis
 * hanya jalan untuk Super Admin, dan setiap kali ganti pilihan, sidebar
 * (nama + logo) ikut ter-update juga.
 *
 * @param {Function} [onChange] dipanggil setelah target masjid berubah,
 *   biasanya buat reload data di halaman (mis. loadDashboard, loadCoupons).
 */
let _masjidListCache = [];

async function renderMasjidSwitcher(onChange) {
  const wrap = document.getElementById("masjidSwitcherWrap");
  if (!wrap) return;

  wrap.innerHTML = '<select class="masjid-switcher" id="masjidSelect"><option value="">Semua Masjid</option></select>';

  try {
    const list = await Api.call("masjid_list", {});
    _masjidListCache = list || [];

    const select = document.getElementById("masjidSelect");
    _masjidListCache.forEach(function (m) {
      const opt = document.createElement("option");
      opt.value = m.id_masjid;
      opt.textContent = m.nama_masjid;
      select.appendChild(opt);
    });

    const current = Auth.getTargetMasjid();
    select.value = current;
    updateBrandFromTarget(current);

    select.addEventListener("change", function () {
      Auth.setTargetMasjid(select.value);
      updateBrandFromTarget(select.value);
      if (onChange) onChange();
    });

  } catch (err) {
    showToast(err.message, true);
  }
}

function getMasjidById(id) {
  return _masjidListCache.find(function (m) { return m.id_masjid === id; }) || null;
}

function updateBrandFromTarget(targetId) {
  const nameEl = document.querySelector(".brand-text .masjid-name");
  const markEl = document.querySelector(".brand-mark");
  if (!nameEl || !markEl) return;

  if (!targetId) {
    nameEl.textContent = "Semua Masjid";
    markEl.innerHTML = logoImgHtml(APP_LOGO);
    return;
  }

  const found = getMasjidById(targetId);
  if (found) {
    nameEl.textContent = found.nama_masjid;
    markEl.innerHTML = logoImgHtml(found.logo_url);
  }
}
