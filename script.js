function showFileNotification() {
    let inputs = document.querySelectorAll("input[required], select[required], textarea[required]");

    for (let input of inputs) {
        if (!input.value.trim()) {
            alert("Harap lengkapi semua kolom yang wajib diisi!");

            input.focus();
            input.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }
    }

    // tampilkan notifikasi file
    document.getElementById("fileNotification").classList.remove("d-none");
}

document.getElementById("tanggal_mulai").addEventListener("change", function () {
    const mulai = new Date(this.value);
    const max = new Date(mulai);
    max.setMonth(max.getMonth() + 6);

    const selesaiInput = document.getElementById("tanggal_selesai");

    selesaiInput.min = this.value;
    selesaiInput.max = max.toISOString().split("T")[0];
});

function onlyThreeDigits(el) {
    el.value = el.value.replace(/\D/g, "").slice(0, 3);
}

function toggleAnggota() {
    const opsi = document.getElementById("opsi_anggota").value;
    const field = document.getElementById("anggota_peneliti");

    if (opsi === "ada") {
        field.style.display = "block";
        field.required = true;
        field.value = "";
    } else if (opsi === "-") {
        field.style.display = "none";
        field.required = false;
        field.value = "-";
    }
}

function hideFileNotification() {
    // Hide the file notification
    let fileNotification = document.getElementById("fileNotification");
    fileNotification.classList.add("d-none");
}

function proceedToUpload() {
    // Hide the file notification
    let fileNotification = document.getElementById("fileNotification");
    fileNotification.classList.add("d-none");

    // Proceed with file upload
    UploadFile();
}

function UploadFile() {
    let submitBtn = document.querySelector(".btn-submit");
    let btnText = document.getElementById("btn-text");
    let loadingSpinner = document.getElementById("loading-spinner");

    var reader = new FileReader();
    var file = document.getElementById('attach').files[0];

    if (!file) {
        alert("Silakan pilih file sebelum mengirim!");
        return;
    }

    // Check if the file is zip or rar
    const validExtensions = ['application/zip', 'application/x-rar-compressed', 'application/x-zip-compressed', 'multipart/x-zip'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['zip', 'rar'].includes(fileExtension)) {
        alert("Format file harus zip atau rar.");
        return;
    }

    // Ubah warna tombol & teks saat proses pengiriman
    btnText.textContent = "MENGIRIM...";
    submitBtn.style.backgroundColor = "#f39c12"; // Warna oranye
    loadingSpinner.classList.remove("d-none");
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");

    // Tampilkan modal loading
    var loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    reader.onload = function () {
        document.getElementById('fileContent').value = reader.result;
        document.getElementById('filename').value = file.name;

        fetch(document.getElementById('uploadForm').action, {
            method: "POST",
            body: new FormData(document.getElementById('uploadForm'))
        }).then(response => response.json())
            .then(data => {
                alert("Data berhasil dikirim!");
                document.getElementById('uploadForm').reset();

                // Tampilkan notifikasi
                let notification = document.getElementById("notification");
                notification.classList.remove("d-none");

            }).catch(() => {
                alert("Gagal mengirim data.");
            }).finally(() => {
                // Kembalikan tombol ke warna awal
                btnText.textContent = "KIRIM DATA";
                submitBtn.style.backgroundColor = "#71b7e6"; // Warna biru kembali
                loadingSpinner.classList.add("d-none");
                submitBtn.disabled = false;
                submitBtn.classList.remove("disabled");

                // Sembunyikan modal loading
                loadingModal.hide();
            });
    };
    reader.readAsDataURL(file);
}
// Tampilkan popup saat halaman dibuka
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('popupModal').style.display = 'flex';
});

function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}

