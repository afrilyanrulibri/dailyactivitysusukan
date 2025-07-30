// Variabel global untuk menyimpan lokasi dan link hasil upload
let currentLatitude = null;
let currentLongitude = null;
let uploadedFileLink = "";

// Fungsi ambil lokasi GPS
function shareLocation() {
  const lokasiText = document.getElementById("lokasi");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLatitude = position.coords.latitude;
        currentLongitude = position.coords.longitude;
        lokasiText.textContent = `Lokasi: Latitude ${currentLatitude}, Longitude ${currentLongitude}`;
      },
      (error) => {
        lokasiText.textContent = "❌ Gagal mengambil lokasi.";
      }
    );
  } else {
    lokasiText.textContent = "❌ Geolocation tidak didukung di perangkat ini.";
  }
}

// Fungsi upload foto ke Google Drive via Web App
async function uploadFoto() {
  const fileInput = document.getElementById("uploadFoto");
  const file = fileInput.files[0];

  if (!file) {
    alert("📷 Silakan pilih file foto terlebih dahulu!");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];

    const data = new URLSearchParams();
    data.append("file", base64);
    data.append("filename", file.name);
    data.append("mimeType", file.type);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwVeTByI6elQy-B569jCXCG14AlicEX87pewKXWw_rr/dev", {
        method: "POST",
        body: data,
      });

      const result = await response.text();
      uploadedFileLink = result;
      alert("✅ Upload berhasil!\nLink: " + result);
    } catch (err) {
      alert("❌ Gagal upload: " + err.message);
    }
  };

  reader.readAsDataURL(file);
}
