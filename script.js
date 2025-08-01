let currentLatitude = null;
let currentLongitude = null;
let uploadedFileLinks = [];

function showToast(msg, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = success ? "show success" : "show error";
  setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
}

function validateForm() {
  const submitBtn = document.getElementById("submitBtn");
  const activity = document.getElementById("activity").value;
  const pekerja = document.getElementById("pekerja").value;
  const nasabah = document.getElementById("nasabah").value;
  const valid = activity && pekerja && nasabah && uploadedFileLinks.length && currentLatitude && currentLongitude;
  submitBtn.disabled = !valid;
}

function shareLocation() {
  const lokasiText = document.getElementById("lokasi");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.accuracy > 50) {
          showToast("⚠️ Lokasi kurang akurat (" + Math.round(position.coords.accuracy) + "m)", false);
          return;
        }
        currentLatitude = position.coords.latitude;
        currentLongitude = position.coords.longitude;
        lokasiText.textContent = `Lokasi: ${currentLatitude}, ${currentLongitude}`;
        validateForm();
      },
      () => showToast("❌ Gagal mengambil lokasi.", false),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      }
    );
  } else {
    showToast("❌ Geolocation tidak tersedia.", false);
  }
}

async function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), file.type, 0.6);
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

  if (!files.length) return showToast("📷 Pilih minimal satu foto", false);

  uploadedFileLinks = [];
  progressText.style.display = "block";
  uploadResult.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const compressedBlob = await compressImage(file, 800);

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = "0%";
    uploadResult.appendChild(bar);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      const data = new URLSearchParams();
      data.append("file", base64);
      data.append("filename", file.name);
      data.append("mimeType", file.type);

      let percent = 0;
      const simulateProgress = setInterval(() => {
        percent += 5;
        bar.style.width = percent + "%";
        if (percent >= 90) clearInterval(simulateProgress);
      }, 100);

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzLTnB6M6ZuF_Vbc5kaCWOoMqtVX-kgPKDm1K_avaMLCCAZT1KUav4CTYNHtABYmiiN/exec", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          const result = await response.text();
          clearInterval(simulateProgress);
          bar.style.width = "100%";
          bar.style.background = "#198754";
          uploadedFileLinks.push(result);

          // Tampilkan thumbnail
          const thumb = document.createElement("img");
          thumb.src = reader.result;
          thumb.style.width = "80px";
          thumb.style.marginTop = "10px";
          thumb.style.borderRadius = "10px";
          uploadResult.appendChild(thumb);

          validateForm();
          if (i === files.length - 1) {
            showToast("✅ Semua foto berhasil diupload.");
            fileInput.style.display = "none";
            document.getElementById("shareBtn").style.display = "none";
            progressText.style.display = "none";
            shareLocation();
          }
        } else {
          bar.style.background = "#dc3545";
          showToast("❌ Gagal upload foto", false);
        }
      } catch {
        bar.style.background = "#dc3545";
        showToast("❌ Gagal upload foto", false);
      }
    };
    reader.readAsDataURL(compressedBlob);
  }
}

function resetForm() {
  document.getElementById("activity").value = "";
  document.getElementById("pekerja").value = "";
  document.getElementById("nasabah").value = "";
  document.getElementById("uploadFoto").value = "";
  document.getElementById("uploadFoto").style.display = "block";
  document.getElementById("shareBtn").style.display = "block";
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("uploadResult").innerHTML = "";
  document.getElementById("lokasi").textContent = "";
  uploadedFileLinks = [];
  currentLatitude = null;
  currentLongitude = null;
}

function submitData() {
  const data = new URLSearchParams();
  data.append("activity", document.getElementById("activity").value);
  data.append("pekerja", document.getElementById("pekerja").value);
  data.append("nasabah", document.getElementById("nasabah").value);
  data.append("latitude", currentLatitude);
  data.append("longitude", currentLongitude);
  data.append("foto", uploadedFileLinks.join(", "));

  fetch("https://script.google.com/macros/s/AKfycbzLTnB6M6ZuF_Vbc5kaCWOoMqtVX-kgPKDm1K_avaMLCCAZT1KUav4CTYNHtABYmiiN/exec?" + data.toString())
    .then(res => res.text())
    .then(msg => {
      showToast("✅ " + msg);
      resetForm();
    })
    .catch(err => showToast("❌ Gagal simpan: " + err, false));
}
