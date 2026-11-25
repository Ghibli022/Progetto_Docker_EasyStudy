document.getElementById('file').addEventListener('change', function(event) {
    const fileUploadedSpan = document.getElementById('file-uploaded');
    if (event.target.files.length > 0) {
        fileUploadedSpan.textContent = event.target.files[0].name;
    } else {
        fileUploadedSpan.textContent = "Nessuno";
    }
});