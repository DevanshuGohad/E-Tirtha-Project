import { auth } from './login/firebaseConfig.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Get DOM elements
const loginLink = document.querySelector('.login-link');
const logoutLink = document.querySelector('.logout-link');

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
    } else {
        // User is signed out
        loginLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
    }
});

// Handle logout
logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await signOut(auth);
        // No need to update UI here as it will be handled by onAuthStateChanged
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Carousel Controls
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const track = document.querySelector(".carousel-track");
const totalSlides = slides.length;

function updateSlidePosition() {
    track.style.transition = "transform 0.5s ease-in-out"; // Smooth transition
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
}

// Auto-Slide every 5 seconds
setInterval(nextSlide, 5000);

// Make carousel functions globally available
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

// Daily Spiritual Quotes
const quotes = [
    '"The soul is neither born, nor does it die." – Bhagavad Gita',
    '"When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place." – Bhagavad Gita',
    '"Peace comes from within. Do not seek it without." – Buddha',
    '"A person is what he or she thinks about all day long." – Ralph Waldo Emerson',
    '"Happiness depends upon ourselves." – Aristotle',
    '"You are not a drop in the ocean. You are the entire ocean in a drop." – Rumi',
    '"Be the change that you wish to see in the world." – Mahatma Gandhi'
];

const quoteElement = document.getElementById("daily-quote");

function displayQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    
    // Fade Out Effect
    quoteElement.style.opacity = 0;

    setTimeout(() => {
        quoteElement.textContent = quotes[randomIndex];

        // Fade In Effect
        quoteElement.style.opacity = 1;
    }, 500); // Matches CSS transition timing
}

// Refresh quote every 5 seconds
setInterval(displayQuote, 5000);

// Display first quote on page load
window.onload = displayQuote;
