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

  fetch("https://script.google.com/macros/s/AKfycbwvUkc-VjA1aYFJR57dWOcyT57k9j4q7mq7s59PAHt2POJODLBNqvvJQnwUXK-I6wLV/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data.toString()
  })
    .then(res => res.text())
    .then(msg => alert("✅ " + msg))
    .catch(err => alert("❌ Gagal simpan data: " + err));
}
