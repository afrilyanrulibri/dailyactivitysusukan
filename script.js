function shareLocation() {
  const lokasiText = document.getElementById("lokasi");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lokasiText.textContent = `Lokasi: Latitude ${position.coords.latitude}, Longitude ${position.coords.longitude}`;
      },
      (error) => {
        lokasiText.textContent = "Gagal mengambil lokasi.";
      }
    );
  } else {
    lokasiText.textContent = "Geolocation tidak didukung.";
  }
}

// Upload foto: perlu backend untuk upload otomatis ke Google Drive
function uploadFoto() {
  alert("Fungsi upload otomatis ke Google Drive butuh backend (Apps Script). Akan disambungkan ke script Google Drive Anda.");
}
