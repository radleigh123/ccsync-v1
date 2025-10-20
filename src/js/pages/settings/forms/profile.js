export function profileForm(userData, form) {
    if (!form) return;

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            display_name: document.getElementById('display-name').value,
            bio: document.getElementById('bio').value
        };

        if (!formData.display_name) {
            alert('Please provide a display name');
            return;
        }

        console.log(formData);

        try {
            const params = new URLSearchParams();
            const userId = JSON.parse(localStorage.getItem("user")).id;
            params.append("id", userId);

            const response = await fetch(`http://localhost:8080/ccsync-plain-php/profile/editProfile.php?${params}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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