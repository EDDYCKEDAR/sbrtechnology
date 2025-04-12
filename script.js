// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    initializeCart();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize product actions
    initializeProductActions();
    
    // Initialize newsletter subscription
    initializeNewsletter();
    
    // Initialize smooth scrolling for navigation
    initializeSmoothScrolling();
    
    // Initialize sticky header
    initializeStickyHeader();
    
    // Initialize mobile menu
    initializeMobileMenu();
});

// Cart Functionality
function initializeCart() {
    const cartButtons = document.querySelectorAll('.fa-shopping-cart');
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart span');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // If button is within product actions
            if (this.closest('.product-actions')) {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent;
                
                cartCount++;
                updateCart(cartCount);
                
                // Show notification
                showNotification(`${productName} added to cart - ${productPrice}`);
            }
        });
    });
    
    // Update cart count display
    function updateCart(count) {
        cartCountElement.textContent = `Cart (${count})`;
    }
}

// Search Functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-bar form');
    const searchInput = document.querySelector('.search-bar input');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // In a real application, you would redirect to search results page
            // For demo purposes, show notification
            showNotification(`Searching for: ${searchTerm}`);
            searchInput.value = '';
        }
    });
}

// Product Actions (Wishlist, Add to Cart, Quick View)
function initializeProductActions() {
    const wishlistButtons = document.querySelectorAll('.product-actions .fa-heart');
    const quickViewButtons = document.querySelectorAll('.product-actions .fa-search');
    
    // Wishlist functionality
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Toggle active class to show item is wishlisted
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.style.color = '#ff6b6b';
                showNotification(`${productName} added to wishlist`);
            } else {
                this.style.color = '';
                showNotification(`${productName} removed from wishlist`);
            }
        });
    });
    
    // Quick view functionality
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('img').src;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const description = productCard.querySelector('.hidden').textContent;
            
            // Show quick view modal (created dynamically)
            showQuickViewModal(productName, productImage, productPrice, description);
        });
    });
}

// Create and show quick view modal
function showQuickViewModal(name, image, price, description) {
    // Remove any existing modals
    const existingModal = document.querySelector('.quick-view-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="product-image">
                    <img src="${image}" alt="${name}">
                </div>
                <di class="product-info">
                    <h2>${name}</h2>
                    <div class="product-price">${price}</div>
                    <p>${description}</p>
                    <div class="product-actions-modal">
                        <button class="btn primary-btn">Add to Cart</button>
                        <button class="btn secondary-btn">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add styles to modal
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            overflow: auto;
        }
        
        .modal-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 20px;
            width: 80%;
            max-width: 900px;
            border-radius: 8px;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 28px;
            cursor: pointer;
        }
        
        .modal-body {
            display: flex;
            flex-wrap: wrap;
        }
        
        .product-image {
            flex: 1;
            min-width: 300px;
            padding: 20px;
        }
        
        .product-image img {
            max-width: 100%;
            height: auto;
        }
        
        .product-info {
            flex: 1;
            min-width: 300px;
            padding: 20px;
        }
        
        .product-actions-modal {
            margin-top: 20px;
        }
        
        .product-actions-modal button {
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 5% auto;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Close modal when clicking on X or outside modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add to cart functionality within modal
    const addToCartBtn = modal.querySelector('.primary-btn');
    addToCartBtn.addEventListener('click', () => {
        const cartCount = parseInt(document.querySelector('.cart span').textContent.match(/\d+/)[0]) + 1;
        document.querySelector('.cart span').textContent = `Cart (${cartCount})`;
        showNotification(`${name} added to cart - ${price}`);
        modal.remove();
    });
}

// Newsletter subscription
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && isValidEmail(email)) {
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

// Smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('header nav a, .categories-bar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only handle internal links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for header height
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    document.querySelectorAll('header nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
}

// Sticky header
function initializeStickyHeader() {
    const header = document.querySelector('header');
    // const categoriesBar = document.querySelector('.categories-bar');
    let headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > headerHeight) {
            header.classList.add('sticky');
            categoriesBar.classList.add('sticky');
            document.body.style.paddingTop = headerHeight + 'px';
        } else {
            header.classList.remove('sticky');
            categoriesBar.classList.remove('sticky');
            document.body.style.paddingTop = '0';
        }
    });
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        header.sticky {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        }
        
        .categories-bar.sticky {
            position: fixed;
            top: ${headerHeight}px;
            left: 0;
            right: 0;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(style);
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn')) {
        const nav = document.querySelector('.main-nav');
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '';
        
        // Insert button before navigation
        nav.parentNode.insertBefore(mobileBtn, nav);
        
        // Add CSS for mobile menu
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #333;
            }
            
            @media (max-width:992px) {
                .mobile-menu-btn {
                    display: block;
                    position: absolute;
                    top: 20px;
                    right: 20px;
                }

                
                .main-nav {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: #fff;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }
                
                .main-nav.active {
                    display: block;
                }
                
                .main-nav ul {
                    flex-direction: column;
                    padding: 10px 0;
                }
                
                .main-nav ul li {
                    margin: 0;
                    width: 100%;
                    text-align: center;
                }
                
                .main-nav ul li a {
                    padding: 15px;
                    display: block;
                    border-bottom: 1px solid #eee;
                }
                
                .header-wrapper {
                    position: relative;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Toggle menu when button is clicked
        mobileBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
                nav.classList.remove('active');
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Notifications system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            transition: all 0.3s ease;
            animation: slideIn 0.3s forwards;
        }
        
        .notification.success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification.error {
            border-left: 4px solid #f44336;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .close-notification {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            color: #999;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Product image hover effect
document.querySelectorAll('.product-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('mouseenter', function() {
        this.querySelector('.product-actions').style.opacity = '1';
    });
    
    thumbnail.addEventListener('mouseleave', function() {
        this.querySelector('.product-actions').style.opacity = '0';
    });
});

// View more button functionality
document.querySelector('.view-more .btn').addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Loading more products...');
    
    // In a real application, this would load more products via AJAX
    setTimeout(() => {
        showNotification('Feature not implemented in this demo');
    }, 2000);
});

// Add active class to current navigation item based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('header nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});