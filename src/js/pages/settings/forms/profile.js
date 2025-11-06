export function profileForm(userData, form) {
    if (!form) return;

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            display_name: document.getElementById('display-name').value,
            biography: document.getElementById('bio').value
        };

        if (!formData.display_name) {
            alert('Please provide a display name');
            return;
        }

        console.log(formData);

        try {
            const params = new URLSearchParams();
            const token = JSON.parse(localStorage.getItem("user")).firebase_token;
            const userId = JSON.parse(localStorage.getItem("user")).id;
            params.append("id", userId);

            const response = await fetch(`http://localhost:8000/api/profile/${userId}/editProfileInfo`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Successfully edited profile details');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error editing profile details', error);
        }
    });
}