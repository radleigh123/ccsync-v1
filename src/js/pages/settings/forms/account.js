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
                phoneNumber = userData.phone_number; // Fallback to raw input
            }
        }

        if (!formData.email || !formData.gender) {
            showMessage('All fields are required', 'danger');
            return;
        }

        console.log(formData);

        try {
            const params = new URLSearchParams();
            const userId = JSON.parse(localStorage.getItem("user")).id;
            params.append("id", userId);

            const response = await fetch(`http://localhost:8080/ccsync-plain-php/profile/editAccount.php?${params}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

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
