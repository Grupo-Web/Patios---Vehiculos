
import users from '../data/datos.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login form');
    const loginContainer = document.querySelector('.login');

    form.addEventListener('submit', handleLogin);

    async function handleLogin(event) {
        event.preventDefault();

        const usernameInput = form.querySelector('input[type="text"]').value;
        const passwordInput = form.querySelector('input[type="password"]').value;

        removeMessage();

        try {
            const foundUser = users.find(user =>
                user.username === usernameInput && user.password === passwordInput
            );

            if (foundUser) {
                displayMessage('Inicio de sesión exitoso. Redirigiendo...', 'success');

                localStorage.setItem('currentUser', JSON.stringify(foundUser));

                setTimeout(() => {
                    if (foundUser.role === 'admin') {
                        window.location.href = '../src/dashboard.html';
                    } else {
                        window.location.href = '../src/cotizacionVehiculo.html';
                    }
                }, 700);

            } else {
                displayMessage('Usuario o contraseña incorrectos.', 'error');
            }

        } catch (error) {
            console.error('Error durante el proceso de login:', error);
            displayMessage('Error del sistema. Inténtalo más tarde.', 'error');
        }
    }

    function displayMessage(text, type) {
        let message = document.createElement('p');
        message.textContent = text;
        message.classList.add('login-message');

        message.style.marginTop = '15px';
        message.style.padding = '10px';
        message.style.borderRadius = '5px';
        message.style.textAlign = 'center';
        message.style.fontWeight = 'bold';

        if (type === 'success') {
            message.style.backgroundColor = '#d4edda';
            message.style.color = '#155724';
        } else if (type === 'error') {
            message.style.backgroundColor = '#f8d7da';
            message.style.color = '#721c24';
        }

        loginContainer.appendChild(message);
    }

    function removeMessage() {
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
});