document.getElementById("formActivity").addEventListener("submit", async function(e) {
    e.preventDefault();

    let webAppUrl = "https://script.google.com/macros/s/AKfycbzGa3NPrKyOy_gZLDgMAN3F9XfsMlg4styre1KfzqYAR9gLVpJgc8gxVQtimE6p9r9O/exec"; // Ganti dengan URL Web App kamu

    // Ambil data dari form
    let activity = document.getElementById("activity").value;
    let pekerja = document.getElementById("pekerja").value;
    let nasabah = document.getElementById("nasabah").value;
    let nik = document.getElementById("nik").value;
    let nomorBrimen = document.getElementById("nomorbrimen").value;
    let keterangan = document.getElementById("keterangan").value;
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;

    // Ambil file foto
    let fileInput = document.getElementById("foto").files[0];
    let base64Foto = "";

    if (fileInput) {
        base64Foto = await toBase64(fileInput);
        base64Foto = base64Foto.replace(/^data:image\/[a-z]+;base64,/, ""); // buang header
    }

    // Kirim ke Google Apps Script
    let formData = new URLSearchParams();
    formData.append("activity", activity);
    formData.append("pekerja", pekerja);
    formData.append("nasabah", nasabah);
    formData.append("nik", nik);
    formData.append("nomorbrimen", nomorBrimen);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("keterangan", keterangan);
    formData.append("filename", fileInput ? fileInput.name : "foto.jpg");
    formData.append("mimeType", fileInput ? fileInput.type : "image/jpeg");
    formData.append("file", base64Foto);

    try {
        let res = await fetch(webAppUrl, {
            method: "POST",
            body: formData
        });
        let result = await res.json();

        if (result.status === "sukses") {
            alert("Data berhasil dikirim!");
            document.getElementById("formActivity").reset();
        } else {
            alert("Gagal: " + result.error);
        }
    } catch (err) {
        alert("Error: " + err.toString());
    }
});

// Helper untuk convert file ke Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
