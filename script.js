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
async function uploadFoto() {
  const fileInput = document.getElementById("uploadFoto");
  const file = fileInput.files[0];

  if (!file) {
    alert("Pilih file terlebih dahulu!");
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
      alert("✅ Upload berhasil! Link file:\n" + result);
    } catch (err) {
      alert("❌ Gagal upload: " + err.message);
    }
  };

  reader.readAsDataURL(file);
}

