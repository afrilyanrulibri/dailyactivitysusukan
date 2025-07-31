
let currentLatitude = null;
let currentLongitude = null;
let uploadedFileLinks = [];

function shareLocation() {
  const lokasiText = document.getElementById("lokasi");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLatitude = position.coords.latitude;
        currentLongitude = position.coords.longitude;
        lokasiText.textContent = `Lokasi: Latitude ${currentLatitude}, Longitude ${currentLongitude}`;
      },
      () => {
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
          (blob) => resolve(blob),
          file.type,
          0.7
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

  progressText.innerHTML = "Loading...";
  progressText.style.display = "block";
  uploadResult.innerHTML = "";
  uploadedFileLinks = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const compressedBlob = await compressImage(file);

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "10px";
    progressBar.style.background = "#0d6efd";
    progressBar.style.margin = "5px 0";
    uploadResult.appendChild(progressBar);

    const resultText = document.createElement("div");
    resultText.style.marginBottom = "10px";
    resultText.style.fontWeight = "bold";

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

        if (response.ok) {
          const result = await response.text();
          progressBar.style.width = "100%";
          progressBar.style.background = "#198754";
          resultText.textContent = "✅ FILE SUKSES UPLOAD";
          resultText.style.color = "green";
          uploadedFileLinks.push(result);
        } else {
          progressBar.style.width = "100%";
          progressBar.style.background = "#dc3545";
          resultText.textContent = "❌ FILE GAGAL UPLOAD";
          resultText.style.color = "red";
        }
      } catch (err) {
        progressBar.style.width = "100%";
        progressBar.style.background = "#dc3545";
        resultText.textContent = "❌ FILE GAGAL UPLOAD";
        resultText.style.color = "red";
      }

      uploadResult.appendChild(resultText);

      if (i === files.length - 1) {
        progressText.innerHTML = "✅ Semua foto berhasil di-upload.";
        document.getElementById("uploadFoto").style.display = "none";
        document.querySelector("button[onclick='shareLocation()']").style.display = "none";
        shareLocation();
      }
    };

    reader.readAsDataURL(compressedBlob);
  }
}

function submitData() {
  const activity = document.getElementById("activity").value;
  const pekerja = document.getElementById("pekerja").value;
  const nasabah = document.getElementById("nasabah").value;

  const errorActivity = document.getElementById("errorActivity");
  const errorPekerja = document.getElementById("errorPekerja");
  const errorNasabah = document.getElementById("errorNasabah");

  let valid = true;
  errorActivity.textContent = activity ? "" : "Activity wajib dipilih.";
  errorPekerja.textContent = pekerja ? "" : "Nama pekerja wajib dipilih.";
  errorNasabah.textContent = nasabah ? "" : "Nama nasabah wajib diisi.";

  if (!activity || !pekerja || !nasabah || !currentLatitude || !currentLongitude || uploadedFileLinks.length === 0) {
    alert("❗ Semua data wajib diisi, termasuk foto dan lokasi.");
    return;
  }

  const data = new URLSearchParams();
  data.append("activity", activity);
  data.append("pekerja", pekerja);
  data.append("nasabah", nasabah);
  data.append("latitude", currentLatitude);
  data.append("longitude", currentLongitude);
  data.append("foto", uploadedFileLinks.join(", "));

  fetch("https://script.google.com/macros/s/AKfycbwvUkc-VjA1aYFJR57dWOcyT57k9j4q7mq7s59PAHt2POJODLBNqvvJQnwUXK-I6wLV/exec?" + data.toString())
    .then(res => res.text())
    .then(msg => alert("✅ " + msg))
    .catch(err => alert("❌ Gagal simpan data: " + err));
}
