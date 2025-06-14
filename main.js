document.addEventListener('DOMContentLoaded', function() {
   console.log("main.js loaded");

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    if (hamburger && navbar) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navbar.classList.toggle('menu-open');
        });
    }

    // Show a welcome message when the "Shop Now" button is clicked
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            alert('Welcome to Artisan Alley! Browse our unique handmade products.');
        });
    }

    // Add to Cart button functionality (for demonstration)
    const addToCartButtons = document.querySelectorAll('.product-card button');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            alert('Added to cart!');
        });
    });

    // Contact form thank-you message
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            form.innerHTML = "<p style='color: #a05c26; font-size: 1.2rem; text-align: center;'>Thank you for contacting us! We'll get back to you soon.</p>";
        });
    }

    // --------- Firebase Authentication Logic ---------
    const loginBtn = document.querySelector('.nav-action.login');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authForm = document.getElementById('authForm');
    const signupBtn = document.getElementById('signupBtn');
    const authMessage = document.getElementById('authMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');

    // Modal open/close logic
    if (loginBtn && authModal && closeAuthModal) {
        loginBtn.addEventListener('click', () => authModal.style.display = 'block');
        closeAuthModal.addEventListener('click', () => authModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === authModal) authModal.style.display = 'none';
        });
    }

    // Login
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    authMessage.textContent = "Logged in successfully!";
                    authMessage.style.color = "green";
                    setTimeout(() => { authModal.style.display = 'none'; }, 1000);
                })
                .catch((error) => {
                    authMessage.textContent = error.message;
                    authMessage.style.color = "red";
                });
        });
    }

    // Sign Up
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    authMessage.textContent = "Account created! You are now logged in.";
                    authMessage.style.color = "green";
                    setTimeout(() => { authModal.style.display = 'none'; }, 1000);
                })
                .catch((error) => {
                    authMessage.textContent = error.message;
                    authMessage.style.color = "red";
                });
        });
    }

    // Show user info and handle logout
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (loginBtn) loginBtn.style.display = "none";
            if (userInfo && userEmail) {
                userInfo.style.display = "block";
                userEmail.textContent = "Logged in as: " + user.email;
            }
            if (logoutBtn) {
                logoutBtn.onclick = function() {
                    firebase.auth().signOut();
                    if (userInfo) userInfo.style.display = "none";
                    if (loginBtn) loginBtn.style.display = "inline-block";
                };
            }
        } else {
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (userInfo) userInfo.style.display = "none";
        }
    });
});
