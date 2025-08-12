// ---------- CONFIG ----------
const WEBAPP_URL = "https://script.google.com/macros/s/XXXXX/exec"; // <-- ganti dengan Web App URL mu
const PASSWORD_KAUNIT = "445566";
const MANTRI_OPTIONS = [
  "156802 EKOWATI CAHYANINGROM",
  "189290 MEGA BAGUS KURNIAWAN ABADI",
  "189417 DEDDY NOVIYANTO B.S",
  "213122 RISKA AGUSTIANA",
  "270609 SULISTIYO RINI",
  "288133 GALIH RIO PAMBUDI"
];
// -----------------------------

// AUTH helpers (simple)
function requireAuth(neededRole) {
  const role = sessionStorage.getItem("role");
  if (!role || role !== neededRole) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function loginAsKaunit(password) {
  if (password === PASSWORD_KAUNIT) {
    sessionStorage.setItem("role", "kaunit");
    return true;
  }
  return false;
}

function loginAsMantri() {
  sessionStorage.setItem("role", "mantri");
}

// fetch helpers
async function apiGet(action) {
  const url = `${WEBAPP_URL}?action=${encodeURIComponent(action)}`;
  const r = await fetch(url);
  return await r.json();
}

async function apiPost(formDataObj) {
  // formDataObj is plain object
  const body = new URLSearchParams();
  for (const k in formDataObj) body.append(k, formDataObj[k]);
  const res = await fetch(WEBAPP_URL, { method: "POST", body: body });
  return await res.json();
}

// upload file as base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const b64 = fr.result.split(",")[1];
      resolve(b64);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function goLogout() {
  sessionStorage.removeItem("role");
  window.location.href = "index.html";
}

// Utility: open Google Maps for lat/lng
function openMaps(lat, lon) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + "," + lon)}`;
  window.open(url, "_blank");
}

export {
  requireAuth, loginAsKaunit, loginAsMantri,
  apiGet, apiPost, fileToBase64, MANTRI_OPTIONS,
  goLogout, openMaps
};
