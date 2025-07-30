let currentLatitude = null;
let currentLongitude = null;

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

async function compressImage(file, maxWidth = 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          0.7 // kualitas kompres (70%)
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadFoto() {
  const fileInput = document.getElementById("uploadFoto");
  const files = fileInput.files;
  const progressText = document.getElementById("progressText");
  const uploadResult = document.getElementById("uploadResult");

  if (!files.length) {
    alert("📷 Silakan pilih minimal satu foto.");
    return;
  }

  progressText.style.display = "block";
  uploadResult.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const compressedBlob = await compressImage(file);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      const data = new URLSearchParams();
      data.append("file", base64);
      data.append("filename", file.name);
      data.append("mimeType", file.type);

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwvUkc-VjA1aYFJR57dWOcyT57k9j4q7mq7s59PAHt2POJODLBNqvvJQnwUXK-I6wLV/exec", {
          method: "POST",
          body: data,
        });

        const result = await response.text();
        uploadResult.innerHTML += `✅ <a href="${result}" target="_blank">${file.name}</a><br>`;
      } catch (err) {
        uploadResult.innerHTML += `❌ ${file.name}: ${err.message}<br>`;
      }

      if (i === files.length - 1) {
        progressText.style.display = "none";
      }
    };

    reader.readAsDataURL(compressedBlob);
  }
}
