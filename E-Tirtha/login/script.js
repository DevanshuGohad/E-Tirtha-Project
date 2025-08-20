import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Add auth state observer at the top level
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to main page
        window.location.href = '../index.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = loginForm.querySelector('.login-btn');
    const inputFields = loginForm.querySelectorAll('.input-field input');
    const passwordInput = document.getElementById('password');

    // Add focus animations to input fields
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Add password visibility toggle
    const togglePassword = document.createElement('i');
    togglePassword.className = 'fas fa-eye password-toggle';
    passwordInput.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.className = `fas fa-eye${type === 'password' ? '' : '-slash'} password-toggle`;
    });

    // Form submission handling
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset error states
        inputFields.forEach(input => {
            input.parentElement.classList.remove('error');
        });

        // Get form values
        const email = document.getElementById('username').value.trim();
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;

        // Basic validation
        let hasError = false;
        if (!email) {
            document.getElementById('username').parentElement.classList.add('error');
            hasError = true;
        }
        if (!password) {
            passwordInput.parentElement.classList.add('error');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        loginBtn.classList.add('loading');

        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Handle "Remember me" option
            if (remember) {
                // Firebase persistence is set to LOCAL by default
                // You can implement additional remember me functionality here
            }

            showSuccessMessage();
            // Redirect to dashboard or home page
            setTimeout(() => {
                window.location.href = '../index.html'; // Redirect to the main index page
            }, 1500);
        } catch (error) {
            console.error(error);
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    document.getElementById('username').parentElement.classList.add('error');
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    document.getElementById('username').parentElement.classList.add('error');
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    passwordInput.parentElement.classList.add('error');
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
            }
            
            showErrorMessage(errorMessage);
        } finally {
            loginBtn.classList.remove('loading');
        }
    });

    function showSuccessMessage() {
        // Add your success message handling here
        alert('Login successful!');
    }

    function showErrorMessage(message) {
        // Add your error message handling here
        alert(message);
    }
}); 