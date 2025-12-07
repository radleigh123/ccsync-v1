export function accountForm(userData, form, iti) {
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email').value.trim(),
            gender: document.getElementById('gender').value.trim(),
        };
        let phoneNumber;

        if (iti) {
            try {
                // TODO: Proper validations or Validator 
                // Countries have different phone number length
                phoneNumber = iti.isValidNumber() ? iti.getNumber() : '';
                formData.phone_number = parseInt(phoneNumber.substring(1));
            } catch (e) {
                console.warn('Error getting phone number from iti:', e);
                phoneNumber = userData.member.phone; // Fallback to raw input
            }
        }

        if (!formData.email || !formData.gender) {
            showMessage('All fields are required', 'danger');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));

            console.log({
                "email": formData.email,
                "phone": phoneNumber,
                "gender": formData.gender
            });

            const response = await fetch(`https://ccsync-api-master-ll6mte.laravel.cloud/api/profile/${user.id}/editPersonal`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.firebase_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": formData.email,
                    "phone": phoneNumber,
                    "gender": formData.gender
                })
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                alert('Successfully edited account details');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error editing account details', error);
        }

        // Update local storage example
        // const user = JSON.parse(localStorage.getItem('user') || '{}');
        // user.email = email;
        // user.phone = phone;
        // user.gender = gender;
        // localStorage.setItem('user', JSON.stringify(user));
    });
}
