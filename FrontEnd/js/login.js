document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email: email,
            password: password
        };

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erreur d\'authentification');
            }
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        })
        .catch(error => {
            document.getElementById('error-message').textContent = "Identifiant ou mot de passe incorrect";
        });
    });
});