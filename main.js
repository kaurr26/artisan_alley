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

    // --- Add to Cart Functionality ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const card = button.closest('.product-card');
            const productId = card.getAttribute('data-product-id');
            const productName = card.getAttribute('data-product-name');
            const productPrice = card.getAttribute('data-product-price');
            addToCart({ id: productId, name: productName, price: productPrice });
        });
    });

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exists = cart.find(item => item.id === product.id);
        if (exists) {
            alert('This product is already in your cart!');
            return;
        }
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
        updateCartSummary();
    }

    function updateCartSummary() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cartCount');
        const cartItemsList = document.getElementById('cartItemsList');
        if (cartCount) cartCount.textContent = cart.length;
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} ($${item.price})`;
                cartItemsList.appendChild(li);
            });
        }
    }

    // --- Cart Dropdown Toggle ---
    const cartSummary = document.getElementById('cartSummary');
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartSummary && cartDropdown) {
        cartSummary.addEventListener('click', function(event) {
            event.stopPropagation();
            cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
        });
        document.addEventListener('click', function(event) {
            if (!cartSummary.contains(event.target)) {
                cartDropdown.style.display = 'none';
            }
        });
    }

    // Initialize cart summary on page load
    updateCartSummary();

    // Contact form thank-you message
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            form.innerHTML = "<p style='color: #a05c26; font-size: 1.2rem; text-align: center;'>Thank you for contacting us! We'll get back to you soon.</p>";
        });
    }

    // Hero slideshow logic
    let slideIndex = 0;
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    function showSlide(n) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === n);
            if (dots[i]) dots[i].classList.toggle('active', i === n);
        });
        slideIndex = n;
    }

    function nextSlide() {
        showSlide((slideIndex + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((slideIndex - 1 + slides.length) % slides.length);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Initialize
    showSlide(0);

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
