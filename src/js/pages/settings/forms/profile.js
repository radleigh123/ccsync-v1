export function profileForm(userData, form) {
    if (!form) return;

    form?.addEventListener('submit', function (e) {
        e.preventDefault();

        const displayName = document.getElementById('display-name').value;
        const bio = document.getElementById('bio').value;

        if (!displayName) {
            alert('Please provide a display name');
            return;
        }

        // NOTE: call API to update
        alert('Profile update functionality will be implemented in the future');
        console.log(JSON.stringify({ displayName, bio }));

        // Update local storage example
        // const user = JSON.parse(localStorage.getItem('user') || '{}');
        // user.displayName = displayName;
        // user.bio = bio;
        // localStorage.setItem('user', JSON.stringify(user));
    });
}