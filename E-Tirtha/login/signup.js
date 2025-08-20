import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = signupForm.querySelector('.login-btn');
    const inputFields = signupForm.querySelectorAll('.input-field input');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Add password strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    passwordInput.parentElement.appendChild(strengthIndicator);

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

    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check (Firebase requires at least 6 characters)
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        
        // Contains number
        if (/\d/.test(password)) strength++;
        
        // Contains letter
        if (/[a-zA-Z]/.test(password)) strength++;
        
        // Contains special character
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        return strength;
    }

    // Update password strength indicator
    passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);
        strengthIndicator.className = 'password-strength';
        
        if (strength >= 4) {
            strengthIndicator.classList.add('strong');
        } else if (strength >= 2) {
            strengthIndicator.classList.add('medium');
        } else if (strength >= 1) {
            strengthIndicator.classList.add('weak');
        }
    });

    // Add password visibility toggle
    const addPasswordToggle = (input) => {
        const togglePassword = document.createElement('i');
        togglePassword.className = 'fas fa-eye password-toggle';
        
        input.parentElement.appendChild(togglePassword);

        togglePassword.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            togglePassword.className = `fas fa-eye${type === 'password' ? '' : '-slash'} password-toggle`;
        });
    };

    addPasswordToggle(passwordInput);
    addPasswordToggle(confirmPasswordInput);

    // Form submission handling
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset error states
        inputFields.forEach(input => {
            input.parentElement.classList.remove('error');
        });

        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;

        // Validation
        let hasError = false;

        if (!fullname) {
            document.getElementById('fullname').parentElement.classList.add('error');
            hasError = true;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email').parentElement.classList.add('error');
            hasError = true;
        }

        if (!password || checkPasswordStrength(password) < 2) {
            passwordInput.parentElement.classList.add('error');
            showErrorMessage('Password must be stronger.');
            hasError = true;
        }

        if (password !== confirmPassword) {
            confirmPasswordInput.parentElement.classList.add('error');
            showErrorMessage('Passwords do not match.');
            hasError = true;
        }

        if (!terms) {
            showErrorMessage('Please agree to the Terms of Service and Privacy Policy');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        signupBtn.classList.add('loading');

        try {
            console.log('Starting signup process...');
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully:', userCredential);
            
            const user = userCredential.user;

            try {
                // Update user profile with full name
                await updateProfile(user, {
                    displayName: fullname
                });
                console.log('Profile updated successfully');

                showSuccessMessage();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (profileError) {
                console.error('Error updating profile:', profileError);
                // Even if profile update fails, user is still created
                showSuccessMessage();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            let errorMessage = 'Signup failed. Please try again.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    document.getElementById('email').parentElement.classList.add('error');
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    document.getElementById('email').parentElement.classList.add('error');
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. It should be at least 6 characters long.';
                    passwordInput.parentElement.classList.add('error');
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = `Signup failed: ${error.message}`;
            }
            
            showErrorMessage(errorMessage);
        } finally {
            signupBtn.classList.remove('loading');
        }
    });

    function showSuccessMessage() {
        alert('Account created successfully! Redirecting to login...');
    }

    function showErrorMessage(message) {
        alert(message);
    }
}); 