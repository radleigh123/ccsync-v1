export function accountForm(userData, form, iti) {
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        let phoneNumber;

        if (iti) {
            try {
                // TODO: Proper validations or Validator 
                // Countries have different phone number length
                phoneNumber = iti.isValidNumber() ? iti.getNumber() : '';
            } catch (e) {
                console.warn('Error getting phone number from iti:', e);
                phoneNumber = phoneInput.value; // Fallback to raw input
            }
        }

        const gender = document.getElementById('gender').value;

        if (!email) {
            alert('Please provide an email address');
            return;
        }

        // NOTE: API to update
        alert('Account information update functionality will be implemented in the future');
        console.log(JSON.stringify({ email, phoneNumber, gender }));

        // Update local storage example
        // const user = JSON.parse(localStorage.getItem('user') || '{}');
        // user.email = email;
        // user.phone = phone;
        // user.gender = gender;
        // localStorage.setItem('user', JSON.stringify(user));
    });
}