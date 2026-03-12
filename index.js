import Croppie from 'croppie';

const uploadedImage = document.getElementById('uploaded_picture');
const uploader = document.getElementById('uploader');
const cropButton = document.getElementById('crop_button');
const downloadButton = document.getElementById('download_button');
let croppie;
let croppedPhoto;
const maxSize = 300 * 1024;

uploader.addEventListener('change', (e) => {uploadImage(e)})
cropButton.addEventListener('click', () => {croppie.result('blob').then(showCroppedPhoto)})
downloadButton.addEventListener('click', () => {croppie.result('blob').then(downloadCropped)})

function uploadImage(e) {
    const file = e.target.files[0]
    if (file) {
        if (file.size > maxSize){
            alert('Maximum file size is too large');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.onload = () => {
                let width = uploadedImage.naturalWidth;
                let height = uploadedImage.naturalHeight;
                if (width > 1000 || height > 1000) {
                    width = width / 4
                    height = height / 4
                }
                createCroppie(width, height);
            }
            uploadedImage.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function showCroppedPhoto(blob){
    if (croppedPhoto) {
        croppedPhoto.remove();
    }
    const url = URL.createObjectURL(blob);
    croppedPhoto = document.createElement('img');
    croppedPhoto.src = url;
    document.body.appendChild(croppedPhoto);
}

function downloadCropped(blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = "cropped.png";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function createCroppie(width, height) {
    if (croppie) croppie.destroy();
    croppie = new Croppie(uploadedImage, {
        viewport: {width: width, height: height},
        boundary: {width: width + 50, height: height + 50},
        showZoomer: false,
        enableResize: true
    });
}