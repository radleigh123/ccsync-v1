import { responseModal } from '/js/utils/errorSuccessModal.js';

export function passwordForm(userData, form, updatePasswordBtn, inputs) {

    updatePasswordBtn?.addEventListener('click', async function (e) {
        e.preventDefault();

        const formData = {
            current_password: inputs.currentPassword.value,
            password: inputs.newPassword.value,
            password_confirmation: inputs.confirmPassword.value
        };

        if (!formData.current_password || !formData.password || !formData.password_confirmation) {
            responseModal.showError('Missing Fields', 'Please fill in all password fields');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            responseModal.showError('Password Mismatch', 'New passwords do not match');
            return;
        }

        console.log(formData);

        try {
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await fetch(`https://ccsync-api-master-ll6mte.laravel.cloud/api/profile/${user.id}/editPassword`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.firebase_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                responseModal.showSuccess('Password Updated', 'Successfully edited password', () => {
                    window.location.reload();
                });
            } else {
                const message = result.message;
                console.log(message);
                responseModal.showError('Password Update Failed', message);
            }
        } catch (error) {
            console.error('Error editing password', error);
        }
    });
}