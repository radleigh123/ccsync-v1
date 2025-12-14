import { responseModal } from '/js/utils/errorSuccessModal.js';

export function profileImgForm(userData, form) {
    if (!form) return;

    form?.addEventListener('submit', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('profile-image');
        if (fileInput.files.length === 0) {
            responseModal.showError('No Image Selected', 'Please select an image to upload');
            return;
        }

        const file = fileInput.files[0];

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            responseModal.showError('Invalid File Type', 'Please select a valid image file');
            return;
        }

        // NOTE: call API to update, maybe multer
        responseModal.showError('Not Implemented', 'Profile image upload functionality will be implemented in the future');
    });
}