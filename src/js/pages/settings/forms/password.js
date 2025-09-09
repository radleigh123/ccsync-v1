export function passwordForm(userData, form, updatePasswordBtn, inputs) {
    // if (!form) return;

    updatePasswordBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        const currentPassword = inputs.currentPassword.value;
        const newPassword = inputs.newPassword.value;
        const confirmPassword = inputs.confirmPassword.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        // NOTE: call API to update
        alert('Password update functionality will be implemented in the future');
        console.log(JSON.stringify({ currentPassword, newPassword }));
    });
}