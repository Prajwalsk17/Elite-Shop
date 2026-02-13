// E-commerce Website JavaScript
class ECommerceApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.currentCategory = 'all';
        this.productsPerPage = 8;
        this.currentPage = 1;
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userData = JSON.parse(localStorage.getItem('userData')) || null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupAuthenticationUI();
        await this.loadProducts();
        this.renderProducts();
        this.updateCartUI();
        this.setupCategoryFiltering();
    }

    setupAuthenticationUI() {
        const userMenu = document.getElementById('user-menu');
        const userInfo = document.getElementById('user-info');
        const userDivider = document.getElementById('user-divider');
        const accountLink = document.getElementById('account-link');
        const dashboardLink = document.getElementById('dashboard-link');
        const ordersLink = document.getElementById('orders-link');
        const settingsLink = document.getElementById('settings-link');
        const logoutDivider = document.getElementById('logout-divider');
        const loginLink = document.getElementById('login-link');
        const signupLink = document.getElementById('signup-link');
        const logoutLink = document.getElementById('logout-link');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');

        if (this.isLoggedIn && this.userData) {
            // Show logged-in user interface
            if (userInfo) {
                userInfo.style.display = 'flex';
                userName.textContent = `${this.userData.firstName} ${this.userData.lastName}`;
                userEmail.textContent = this.userData.email;
            }
            if (userDivider) userDivider.style.display = 'block';
            if (accountLink) accountLink.style.display = 'flex';
            if (dashboardLink) dashboardLink.style.display = 'flex';
            if (ordersLink) ordersLink.style.display = 'flex';
            if (settingsLink) settingsLink.style.display = 'flex';
            if (logoutDivider) logoutDivider.style.display = 'block';
            if (logoutLink) {
                logoutLink.style.display = 'flex';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
        } else {
            // Show login/signup interface
            if (userInfo) userInfo.style.display = 'none';
            if (userDivider) userDivider.style.display = 'none';
            if (accountLink) accountLink.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (ordersLink) ordersLink.style.display = 'none';
            if (settingsLink) settingsLink.style.display = 'none';
            if (logoutDivider) logoutDivider.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
            if (loginLink) loginLink.style.display = 'flex';
            if (signupLink) signupLink.style.display = 'flex';
        }
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        this.isLoggedIn = false;
        this.userData = null;
        
        this.showNotification('👋 You have been logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('cart-toggle')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        document.getElementById('cart-close')?.addEventListener('click', () => {
            this.closeCart();
        });

        // Checkout functionality
        document.querySelector('.cart-checkout')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.checkout();
        });

        // Search functionality
        document.querySelector('.search-input')?.addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Category filtering
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Load more products
        document.getElementById('load-more')?.addEventListener('click', () => {
            this.loadMoreProducts();
        });

        // Modal functionality
        document.getElementById('modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('overlay')?.addEventListener('click', () => {
            this.closeModal();
            this.closeCart();
        });

        // Newsletter subscription
        this.setupNewsletterForm();

        // Testimonials slider
        this.setupTestimonialsSlider();

        // Contact form handling
        this.setupContactForm();

        // Scroll animations
        this.setupScrollAnimations();

        // Enhanced search with autocomplete
        this.setupEnhancedSearch();

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Product Management
    async loadProducts() {
        // Simulated product data - In a real app, this would come from an API
        this.products = [
            {
                id: 1,
                name: "Premium Wireless Headphones",
                category: "electronics",
                price: 16599,
                originalPrice: 20749,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 128,
                badge: "sale",
                description: "High-quality wireless headphones with active noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
                sizes: ["One Size"]
            },
            {
                id: 2,
                name: "Smartwatch Pro",
                category: "electronics",
                price: 24899,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.8,
                reviews: 89,
                badge: "new",
                description: "Advanced smartwatch with health monitoring, GPS tracking, and long battery life. Stay connected and healthy.",
                sizes: ["38mm", "42mm", "44mm"]
            },
            {
                id: 3,
                name: "Designer Leather Jacket",
                category: "fashion",
                price: 13299,
                originalPrice: 16599,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.2,
                reviews: 45,
                badge: "sale",
                description: "Stylish genuine leather jacket with modern design. Perfect for casual and semi-formal occasions.",
                sizes: ["S", "M", "L", "XL", "XXL"]
            },
            {
                id: 4,
                name: "Modern Coffee Table",
                category: "home",
                price: 20749,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 67,
                badge: "new",
                description: "Elegant coffee table with clean lines and durable construction. Adds sophistication to any living space.",
                sizes: ["Standard"]
            },
            {
                id: 5,
                name: "Professional Running Shoes",
                category: "sports",
                price: 10799,
                originalPrice: 12449,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.7,
                reviews: 156,
                badge: "sale",
                description: "High-performance running shoes with advanced cushioning and breathable materials for optimal comfort.",
                sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
            },
            {
                id: 6,
                name: "Vintage Denim Jacket",
                category: "fashion",
                price: 7469,
                originalPrice: null,
                image: "https://th.bing.com/th/id/OIP.g0J8DjgQHAnE_WdvFPLghwHaLH?w=184&h=276&c=7&r=0&o=7&pid=1.7&rm=3",
                rating: 4.3,
                reviews: 34,
                badge: "new",
                description: "Classic denim jacket with vintage appeal. Versatile piece that complements any wardrobe.",
                sizes: ["S", "M", "L", "XL"]
            },
            {
                id: 7,
                name: "Bluetooth Speaker",
                category: "electronics",
                price: 6639,
                originalPrice: 8299,
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.4,
                reviews: 92,
                badge: "sale",
                description: "Portable Bluetooth speaker with rich sound quality and long battery life. Perfect for outdoor adventures.",
                sizes: ["One Size"]
            },
            {
                id: 8,
                name: "Minimalist Desk Lamp",
                category: "home",
                price: 5809,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.1,
                reviews: 23,
                badge: null,
                description: "Sleek desk lamp with adjustable brightness and modern design. Perfect for home office or study space.",
                sizes: ["One Size"]
            },
            {
                id: 9,
                name: "Fitness Tracker",
                category: "sports",
                price: 8299,
                originalPrice: 10789,
                image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 78,
                badge: "sale",
                description: "Advanced fitness tracker with heart rate monitoring, sleep tracking, and waterproof design.",
                sizes: ["S", "M", "L"]
            },
            {
                id: 10,
                name: "Casual Sneakers",
                category: "fashion",
                price: 6639,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.2,
                reviews: 67,
                badge: "new",
                description: "Comfortable casual sneakers with trendy design. Perfect for everyday wear and casual outings.",
                sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
            },
            {
                id: 11,
                name: "Ergonomic Office Chair",
                category: "home",
                price: 16599,
                originalPrice: 20749,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 45,
                badge: "sale",
                description: "Ergonomic office chair with lumbar support and adjustable height. Designed for all-day comfort.",
                sizes: ["Standard"]
            },
            {
                id: 12,
                name: "Gaming Mouse",
                category: "electronics",
                price: 4149,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.7,
                reviews: 134,
                badge: null,
                description: "High-precision gaming mouse with customizable buttons and RGB lighting. Perfect for gamers and professionals.",
                sizes: ["One Size"]
            },
            {
                id: 13,
                name: "Wireless Keyboard",
                category: "electronics",
                price: 7469,
                originalPrice: 9129,
                image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.4,
                reviews: 89,
                badge: "sale",
                description: "Wireless mechanical keyboard with backlit keys and long battery life.",
                sizes: ["One Size"]
            },
            {
                id: 14,
                name: "Smartphone Case",
                category: "electronics",
                price: 1659,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.2,
                reviews: 245,
                badge: "new",
                description: "Durable smartphone case with shock protection and wireless charging compatibility.",
                sizes: ["iPhone 14", "iPhone 15", "Samsung S23", "OnePlus 11"]
            },
            {
                id: 15,
                name: "Tablet Stand",
                category: "electronics",
                price: 2489,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 67,
                badge: null,
                description: "Adjustable tablet stand for comfortable viewing and typing.",
                sizes: ["7-11 inches", "12+ inches"]
            },
            {
                id: 16,
                name: "Cotton T-Shirt",
                category: "fashion",
                price: 1245,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.3,
                reviews: 156,
                badge: null,
                description: "Premium cotton t-shirt with comfortable fit and modern design.",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"]
            },
            {
                id: 17,
                name: "Denim Jeans",
                category: "fashion",
                price: 3319,
                originalPrice: 4149,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 203,
                badge: "sale",
                description: "Classic denim jeans with perfect fit and premium quality.",
                sizes: ["28", "30", "32", "34", "36", "38", "40"]
            },
            {
                id: 18,
                name: "Summer Dress",
                category: "fashion",
                price: 2489,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.7,
                reviews: 124,
                badge: "new",
                description: "Elegant summer dress with floral pattern and comfortable fit.",
                sizes: ["XS", "S", "M", "L", "XL"]
            },
            {
                id: 19,
                name: "Polo Shirt",
                category: "fashion",
                price: 1989,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.4,
                reviews: 89,
                badge: null,
                description: "Classic polo shirt perfect for casual and business casual occasions.",
                sizes: ["S", "M", "L", "XL", "XXL"]
            },
            {
                id: 20,
                name: "Winter Coat",
                category: "fashion",
                price: 8299,
                originalPrice: 9959,
                image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.8,
                reviews: 67,
                badge: "sale",
                description: "Warm winter coat with water-resistant fabric and modern design.",
                sizes: ["S", "M", "L", "XL"]
            },
            {
                id: 21,
                name: "Bedroom Set",
                category: "home",
                price: 41549,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 34,
                badge: "new",
                description: "Complete bedroom set with bed, nightstands, and dresser.",
                sizes: ["Queen", "King"]
            },
            {
                id: 22,
                name: "Kitchen Appliance Set",
                category: "home",
                price: 24899,
                originalPrice: 29049,
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 78,
                badge: "sale",
                description: "Essential kitchen appliances including blender, toaster, and coffee maker.",
                sizes: ["Standard"]
            },
            {
                id: 23,
                name: "Decorative Cushions",
                category: "home",
                price: 1659,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.3,
                reviews: 156,
                badge: null,
                description: "Soft decorative cushions to enhance your living space comfort.",
                sizes: ["16x16", "18x18", "20x20"]
            },
            {
                id: 24,
                name: "Wall Art Set",
                category: "home",
                price: 4149,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.4,
                reviews: 92,
                badge: null,
                description: "Modern wall art set to beautify your home or office space.",
                sizes: ["Small", "Medium", "Large"]
            },
            {
                id: 25,
                name: "Basketball",
                category: "sports",
                price: 2489,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 134,
                badge: null,
                description: "Professional basketball with excellent grip and durability.",
                sizes: ["Size 6", "Size 7"]
            },
            {
                id: 26,
                name: "Yoga Mat",
                category: "sports",
                price: 3319,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.7,
                reviews: 189,
                badge: "new",
                description: "Premium yoga mat with non-slip surface and excellent cushioning.",
                sizes: ["Standard", "Extra Long"]
            },
            {
                id: 27,
                name: "Cycling Helmet",
                category: "sports",
                price: 4979,
                originalPrice: 5809,
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 76,
                badge: "sale",
                description: "Safety helmet with ventilation system and adjustable fit.",
                sizes: ["S", "M", "L", "XL"]
            },
            {
                id: 28,
                name: "Tennis Racket",
                category: "sports",
                price: 12449,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                rating: 4.8,
                reviews: 45,
                badge: null,
                description: "Professional tennis racket with carbon fiber construction.",
                sizes: ["Grip 1", "Grip 2", "Grip 3", "Grip 4"]
            }
        ];
    }


    setupCategoryFiltering() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    renderProducts(productsToRender = null) {
        const container = document.getElementById('products-container');
        if (!container) return;

        const products = productsToRender || this.getDisplayProducts();
        
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners to product cards
        this.setupProductEventListeners();
    }

    createProductCard(product) {
        const badgeHtml = product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? 'SALE' : 'NEW'}</span>` : '';
        const originalPriceHtml = product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : '';
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badgeHtml}
                    <div class="product-actions">
                        <button class="action-btn quick-view" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn add-to-wishlist" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${this.capitalize(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">${this.renderStars(product.rating)}</div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="price">₹${product.price.toLocaleString('en-IN')}</span>
                        ${originalPriceHtml}
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    }

    setupProductEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(button.dataset.productId);
                this.addToCart(productId);
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productId = parseInt(productCard.dataset.productId);
                this.openProductModal(productId);
            });
        });

        // Product card click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = parseInt(card.dataset.productId);
                this.openProductModal(productId);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNotification('Added to wishlist!', 'success');
            });
        });
    }

    getDisplayProducts() {
        let filteredProducts = this.currentCategory === 'all' 
            ? this.products 
            : this.products.filter(p => p.category === this.currentCategory);
            
        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
        
        // Hide load more button if all products are shown
        const totalProducts = this.currentCategory === 'all' 
            ? this.products.length 
            : this.products.filter(p => p.category === this.currentCategory).length;
            
        if (this.currentPage * this.productsPerPage >= totalProducts) {
            document.getElementById('load-more').style.display = 'none';
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.renderProducts();
        
        // Show load more button if needed
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
        }
        
        // Update active category
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    }

    searchProducts(query) {
        if (!query) {
            this.renderProducts();
            return;
        }
        
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderProducts(filteredProducts);
    }

    // Cart Management
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        // Add animation to cart icon
        const cartIcon = document.getElementById('cart-toggle');
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCart();
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.saveCart();
        this.updateCartUI();
        this.renderCart();
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.querySelector('.cart-checkout');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2);
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }

        this.renderCart();
    }

    renderCart() {
        const cartContent = document.getElementById('cart-content');
        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }

        cartContent.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Modal Management
    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('modal-body');

        const originalPriceHtml = product.originalPrice ? 
            `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : '';

        modalBody.innerHTML = `
            <div class="product-modal-content">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-modal-details">
                    <h2>${product.name}</h2>
                    <div class="product-modal-price">
                        ₹${product.price.toLocaleString('en-IN')} ${originalPriceHtml}
                    </div>
                    <div class="product-rating">
                        <div class="stars">${this.renderStars(product.rating)}</div>
                        <span class="rating-count">(${product.reviews} reviews)</span>
                    </div>
                    <p class="product-modal-description">${product.description}</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-secondary" onclick="app.addToCart(${product.id}); app.toggleCart();">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('overlay');
        
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Utility Functions
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    setupNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            if (this.validateEmail(email)) {
                this.showNotification('🎉 Thank you for subscribing! You\'ll receive our latest updates.', 'success');
                form.querySelector('.newsletter-input').value = '';
                // Add subscription animation
                const button = form.querySelector('.btn-primary');
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                setTimeout(() => {
                    button.innerHTML = 'Subscribe';
                }, 2000);
            } else {
                this.showNotification('Please enter a valid email address.', 'error');
            }
        });

        // Also handle button click
        const button = form.querySelector('.btn-primary');
        button?.addEventListener('click', (e) => {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            if (this.validateEmail(email)) {
                this.showNotification('🎉 Thank you for subscribing! You\'ll receive our latest updates.', 'success');
                form.querySelector('.newsletter-input').value = '';
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                setTimeout(() => {
                    button.innerHTML = 'Subscribe';
                }, 2000);
            } else {
                this.showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    setupTestimonialsSlider() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const navDots = document.querySelectorAll('.nav-dot');
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        if (testimonials.length === 0) return;

        // Set up navigation dots
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Auto-advance slides
        const autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            this.goToSlide(currentSlide);
        }, slideInterval);

        // Pause auto-advance on hover
        const slider = document.querySelector('.testimonials-slider');
        slider?.addEventListener('mouseenter', () => clearInterval(autoSlide));
        
        const goToSlide = (slideIndex) => {
            testimonials.forEach(slide => slide.classList.remove('active'));
            navDots.forEach(dot => dot.classList.remove('active'));
            
            testimonials[slideIndex].classList.add('active');
            navDots[slideIndex].classList.add('active');
            currentSlide = slideIndex;
        };

        this.goToSlide = goToSlide;
    }

    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelector('select').value;
            const message = form.querySelector('textarea').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                this.showNotification('✅ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type || field.tagName.toLowerCase();
        
        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');
        
        if (fieldType === 'email') {
            if (value && this.validateEmail(value)) {
                field.classList.add('valid');
            } else if (value) {
                field.classList.add('invalid');
            }
        } else if (field.required) {
            if (value) {
                field.classList.add('valid');
            } else {
                field.classList.add('invalid');
            }
        }
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.feature-item, .category-card, .product-card, .testimonial-card, .partner-logo, .contact-method'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupEnhancedSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    this.performEnhancedSearch(query);
                } else if (query.length === 0) {
                    this.renderProducts();
                }
            }, 300);
        });

        // Add search suggestions
        this.createSearchSuggestions();
    }

    createSearchSuggestions() {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;

        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'search-suggestions';
        suggestionsList.style.display = 'none';
        searchContainer.appendChild(suggestionsList);

        const searchInput = searchContainer.querySelector('.search-input');
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2) {
                suggestionsList.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    }

    performEnhancedSearch(query) {
        const filteredProducts = this.products.filter(product => {
            const searchFields = [
                product.name.toLowerCase(),
                product.category.toLowerCase(),
                product.description.toLowerCase()
            ];
            
            return searchFields.some(field => 
                field.includes(query.toLowerCase())
            );
        });
        
        this.renderProducts(filteredProducts);
        
        // Show search results count
        if (query.length >= 2) {
            const resultsCount = filteredProducts.length;
            this.showNotification(
                `Found ${resultsCount} product${resultsCount !== 1 ? 's' : ''} matching "${query}"`, 
                'info'
            );
        }
    }

    setupNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            if (email) {
                this.showNotification('Thank you for subscribing!', 'success');
                form.querySelector('.newsletter-input').value = '';
            }
        });

        // Also handle button click
        const button = form.querySelector('.btn-primary');
        button?.addEventListener('click', (e) => {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            if (email) {
                this.showNotification('Thank you for subscribing!', 'success');
                form.querySelector('.newsletter-input').value = '';
            }
        });
    }
}

// Additional CSS for enhanced features
const enhancedCSS = `
.notification {
    position: fixed;
    top: 100px;
    right: -350px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 0.8rem;
    z-index: 2000;
    transition: right 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border-left: 4px solid #2c5aa0;
    max-width: 350px;
    font-weight: 500;
}

.notification.notification-success {
    border-left-color: #27ae60;
}

.notification.notification-success i {
    color: #27ae60;
}

.notification.notification-error {
    border-left-color: #e74c3c;
}

.notification.notification-error i {
    color: #e74c3c;
}

.notification.notification-info i {
    color: #2c5aa0;
}

.notification.show {
    right: 20px;
}

.cart-bounce {
    animation: bounceCart 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceCart {
    0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
    40% { transform: translateY(-8px) scale(1.1); }
    80% { transform: translateY(-4px) scale(1.05); }
}

.animate-in {
    animation: slideInUp 0.6s ease forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-group input.valid,
.form-group select.valid,
.form-group textarea.valid {
    border-color: #27ae60;
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.form-group input.invalid,
.form-group select.invalid,
.form-group textarea.invalid {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 5px;
}

.suggestion-item {
    padding: 0.8rem 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f1f3f4;
    transition: background 0.2s ease;
}

.suggestion-item:hover {
    background: #f8f9fa;
}

.suggestion-item:last-child {
    border-bottom: none;
}

/* Enhanced responsive design */
@media (max-width: 992px) {
    .about-content {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
    
    .contact-content {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
    
    .about-features {
        grid-template-columns: 1fr;
    }
    
    .newsletter-benefits {
        gap: 2rem;
    }
}

@media (max-width: 768px) {
    .newsletter-benefits {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .newsletter-form {
        flex-direction: column;
        border-radius: 15px;
    }
    
    .newsletter-input {
        border-radius: 12px;
    }
    
    .newsletter-form .btn-primary {
        border-radius: 12px;
    }
    
    .partners-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .testimonial-content {
        padding: 2rem 1.5rem;
    }
    
    .testimonial-author {
        flex-direction: column;
        text-align: center;
    }
}

/* Loading animations */
.loading-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Pulse effect for interactive elements */
.pulse-effect {
    position: relative;
    overflow: visible;
}

.pulse-effect::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(44, 90, 160, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
}

.pulse-effect:hover::before {
    width: 100%;
    height: 100%;
    opacity: 0;
}
`;

// Inject enhanced CSS
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = enhancedCSS;
document.head.appendChild(enhancedStyle);

// Initialize the app with enhanced features
const app = new ECommerceApp();

// Enhanced smooth scrolling for hero buttons
document.addEventListener('DOMContentLoaded', () => {
    const shopNowBtn = document.querySelector('.btn-primary');
    shopNowBtn?.addEventListener('click', () => {
        document.getElementById('products')?.scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Add loading states for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add loading placeholder
        if (!img.complete) {
            img.classList.add('loading-shimmer');
        }
    });

    // Enhanced navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Initialize AOS-like animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.section-title, .feature-item, .category-card, .product-card, .testimonial-card'
    );
    
    animatedElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Add click ripple effect to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            let rect = this.getBoundingClientRect();
            let size = Math.max(rect.width, rect.height);
            let x = e.clientX - rect.left - size / 2;
            let y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple-effect 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS
const rippleCSS = `
@keyframes ripple-effect {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;

const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleCSS;
document.head.appendChild(rippleStyle);

// Responsive dropdown positioning
function adjustDropdownPosition() {
    const dropdown = document.querySelector('.dropdown-menu');
    if (!dropdown) return;
    
    const viewport = window.innerWidth;
    if (viewport <= 768) {
        dropdown.style.right = '-50px';
        dropdown.style.minWidth = '200px';
        dropdown.style.maxWidth = '250px';
    } else {
        dropdown.style.right = '0';
        dropdown.style.minWidth = '240px';
        dropdown.style.maxWidth = '300px';
    }
}

// Loading screen functionality
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// Update dropdown position on window resize
window.addEventListener('resize', adjustDropdownPosition);
document.addEventListener('DOMContentLoaded', () => {
    adjustDropdownPosition();
    hideLoadingScreen();
});

the