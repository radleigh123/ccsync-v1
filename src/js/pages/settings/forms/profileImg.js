export function profileImgForm(userData, form) {
    if (!form) return;

    form?.addEventListener('submit', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('profile-image');
        if (fileInput.files.length === 0) {
            alert('Please select an image to upload');
            return;
        }

        const file = fileInput.files[0];

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // NOTE: call API to update, maybe multer
        alert('Profile image upload functionality will be implemented in the future');
    });
}