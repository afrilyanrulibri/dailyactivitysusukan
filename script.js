async function uploadFoto() {
  const fileInput = document.getElementById("uploadFoto");
  const files = fileInput.files;
  const progressBar = document.getElementById("uploadProgress");

  if (!files.length) {
    alert("📷 Silakan pilih minimal satu file foto terlebih dahulu!");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    progressBar.style.display = "block";
    progressBar.value = 0;

    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      const data = new URLSearchParams();
      data.append("file", base64);
      data.append("filename", file.name);
      data.append("mimeType", file.type);

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwvUkc-VjA1aYFJR57dWOcyT57k9j4q7mq7s59PAHt2POJODLBNqvvJQnwUXK-I6wLV/exec",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await response.text();
        uploadedFileLink += result + "\n";
        alert(`✅ Upload berhasil:\n${file.name}\nLink: ${result}`);
      } catch (err) {
        alert(`❌ Upload gagal:\n${file.name}\n${err.message}`);
      } finally {
        progressBar.value = ((i + 1) / files.length) * 100;
        if (i === files.length - 1) {
          setTimeout(() => {
            progressBar.style.display = "none";
          }, 1000);
        }
      }
    };

    reader.readAsDataURL(file);
  }
}
