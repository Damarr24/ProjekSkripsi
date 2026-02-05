function showFileNotification() {
    const fields = document.querySelectorAll(".required-field");
    let firstError = null;

    // sembunyikan pesan global dulu
    const globalError = document.getElementById("globalError");
    if (globalError) globalError.classList.add("d-none");

    fields.forEach(field => {
        const box = field.closest(".input-box");

        // VALIDASI KHUSUS RT & RW (3 digit)
        if (field.id === "rukun_tetangga_rt" || field.id === "rukun_warga_rw") {
            if (!/^\d{3}$/.test(field.value)) {
                box.classList.add("error");
                if (!firstError) firstError = field;
                return;
            }
        }

        // VALIDASI FILE
        if (field.type === "file") {
            if (!field.files || field.files.length === 0) {
                box.classList.add("error");
                if (!firstError) firstError = field;
            } else {
                box.classList.remove("error");
            }
        } 
        // VALIDASI UMUM
        else {
            if (!field.value.trim()) {
                box.classList.add("error");
                if (!firstError) firstError = field;
            } else {
                box.classList.remove("error");
            }
        }
    });

    // ❌ MASIH ADA ERROR
    if (firstError) {
        if (globalError) globalError.classList.remove("d-none");
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.focus();
        return;
    }
    const stepSurat = document.getElementById("stepSurat");
    const stepPemohon = document.getElementById("stepPemohon");
    const stepUpload = document.getElementById("stepUpload");

    if (typeof fillPreview === "function") fillPreview();
    if (typeof updateProgress === "function") updateProgress(3);

    document.getElementById("fileNotification").classList.remove("d-none");
}


function updateProgress(step) {
    document.querySelectorAll(".progress-indicator .step")
        .forEach(s => s.classList.remove("active"));

    if (step === 1) stepSurat.classList.add("active");
    if (step === 2) stepPemohon.classList.add("active");
    if (step === 3) stepUpload.classList.add("active");
}


document.addEventListener("input", function (e) {
    if (e.target.classList.contains("required-field")) {
        const box = e.target.closest(".input-box");
        if (e.target.value.trim()) {
            box.classList.remove("error");
        }
    }

    // kapital otomatis
    if (e.target.classList.contains("capitalize")) {
        e.target.value = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
    }
});


function toggleAnggota() {
    const opsi = document.getElementById("opsi_anggota").value;
    const field = document.getElementById("anggota_peneliti");

    if (opsi === "ada") {
        field.style.display = "block";
        field.required = true;
        field.classList.add("required-field");
        field.value = "";
    } else {
        field.style.display = "none";
        field.required = false;
        field.classList.remove("required-field");
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
function fillPreview() {
    document.getElementById("pvNama").textContent =
        document.getElementById("nama").value;

    document.getElementById("pvJudul").textContent =
        document.getElementById("proposal").value;

    document.getElementById("pvTanggal").textContent =
        document.getElementById("tanggal_mulai").value +
        " s/d " +
        document.getElementById("tanggal_selesai").value;

    const fileInput = document.getElementById("attach");
    document.getElementById("pvFile").textContent =
        fileInput.files.length ? fileInput.files[0].name : "-";

    document.getElementById("previewBox").classList.remove("d-none");
}


function UploadFile() {
    let submitBtn = document.querySelector(".btn-submit");
    let btnText = document.getElementById("btn-text");
    let loadingSpinner = document.getElementById("loading-spinner");

    let fileInput = document.getElementById("attach");
    let file = fileInput.files[0];

    if (!file) {
        alert("Silakan pilih file sebelum mengirim!");
        return;
    }

    const allowedExt = ["zip", "rar"];
    const fileExt = file.name.split(".").pop().toLowerCase();

    if (!allowedExt.includes(fileExt)) {
        alert("Format file harus ZIP atau RAR!");
        return;
    }

    btnText.textContent = "MENGIRIM...";
    submitBtn.style.backgroundColor = "#f39c12";
    loadingSpinner.classList.remove("d-none");
    submitBtn.disabled = true;

    let loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));
    loadingModal.show();

    let reader = new FileReader();
    reader.onload = function () {
        document.getElementById("fileContent").value = reader.result;
        document.getElementById("filename").value = file.name;

        fetch(document.getElementById("uploadForm").action, {
            method: "POST",
            body: new FormData(document.getElementById("uploadForm"))
        })
        .then(res => res.json())
        .then(() => {
            alert("Data berhasil dikirim!");
            document.getElementById("uploadForm").reset();
            document.getElementById("notification").classList.remove("d-none");
        })
        .catch(() => {
            alert("Gagal mengirim data.");
        })
        .finally(() => {
            btnText.textContent = "KIRIM DATA";
            submitBtn.style.backgroundColor = "#2c3e50";
            loadingSpinner.classList.add("d-none");
            submitBtn.disabled = false;
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
function onlyThreeDigits(el) {
    el.value = el.value.replace(/\D/g, ""); // hanya angka
    if (el.value.length > 3) {
        el.value = el.value.slice(0, 3);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split("T")[0];

    const start = document.getElementById("tanggal_mulai");
    const end = document.getElementById("tanggal_selesai");
    const surat = document.getElementById("tgl_surat");

    start.min = today;
    surat.max = today;

    start.addEventListener("change", () => {
        const startDate = new Date(start.value);
        const maxEnd = new Date(startDate);
        maxEnd.setMonth(maxEnd.getMonth() + 6);

        end.min = start.value;
        end.max = maxEnd.toISOString().split("T")[0];
        end.value = "";
    });

    end.addEventListener("change", () => {
        const limit = new Date(start.value);
        limit.setMonth(limit.getMonth() + 6);

        if (new Date(end.value) > limit) {
            alert("Durasi penelitian maksimal 6 bulan.");
            end.value = "";
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelectorAll(".user-details input, .user-details select, .user-details textarea")
        .forEach(el => {
            el.addEventListener("focus", () => updateProgress(2));
        });
});
