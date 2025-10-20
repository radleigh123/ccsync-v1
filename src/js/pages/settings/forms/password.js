export function passwordForm(userData, form, updatePasswordBtn, inputs) {

    updatePasswordBtn?.addEventListener('click', async function (e) {
        e.preventDefault();

        const formData = {
            current_password: inputs.currentPassword.value,
            new_password: inputs.newPassword.value
        };
        const confirmPassword = inputs.confirmPassword.value;

        if (!formData.current_password || !formData.new_password || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (formData.new_password !== confirmPassword) {
            alert('New Password do not match');
            return;
        }

        console.log(formData);

        try {
            const params = new URLSearchParams();
            const userId = JSON.parse(localStorage.getItem("user")).id;
            params.append("id", userId);

            const response = await fetch(`http://localhost:8080/ccsync-plain-php/profile/editPassword.php?${params}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                alert('Successfully edited password');
                window.location.reload();
            } else {
                const message = result.message;
                console.log(message);
                alert(message);
            }
        } catch (error) {
            console.error('Error editing password', error);
        }
    });
}