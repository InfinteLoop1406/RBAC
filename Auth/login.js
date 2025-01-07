// Login form submit handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // If login successful, update UI
            displayUserInfo(data.user);
            displayLogoutButton();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Something went wrong during login!");
    }
});

// Function to display user info after login
function displayUserInfo(user) {
    document.getElementById('userDisplay').textContent = `Welcome, ${user.username}! Your role is ${user.role}.`;
    document.getElementById('userDisplay').style.display = 'block';
}

// Function to display logout button after successful login
function displayLogoutButton() {
    document.getElementById('logoutButton').style.display = 'block';
}

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload(); // Reload the page to reset the UI
});
