// =============================================
// APP.JS - Main Application Controller
// =============================================

const App = {
    currentPage: 'dashboard',
    isLoggedIn: false,
    user: null,

    init() {
        console.log('🌾 PadiSmart App Initialized');
        
        // Setup event listeners
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupLogout();
        
        // Load initial page
        this.loadPage('dashboard');
        
        // Check auth status
        this.checkAuth();
        
        // Show auth modal if not logged in
        if (!this.isLoggedIn) {
            setTimeout(() => Auth.openModal(), 300);
        }
    },

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.loadPage(page);
            });
        });
    },

    setupMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mobileMenu');
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    },

    setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Auth.logout();
        });
    },

    loadPage(page) {
        if (!this.isLoggedIn && page !== 'dashboard') {
            Auth.openModal();
            return;
        }

        this.currentPage = page;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active-nav');
            if (link.dataset.page === page) {
                link.classList.add('active-nav');
            }
        });

        // Load page content based on page
        const container = document.getElementById('pageContainer');
        
        switch(page) {
            case 'dashboard':
                Dashboard.render(container);
                break;
            case 'diagnosis':
                Diagnosis.render(container);
                break;
            case 'articles':
                Articles.render(container);
                break;
            case 'history':
                History.render(container);
                break;
            default:
                Dashboard.render(container);
        }

        // Close mobile menu
        document.getElementById('mobileMenu').classList.add('hidden');
    },

    checkAuth() {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        if (token && user) {
            this.isLoggedIn = true;
            this.user = JSON.parse(user);
            document.getElementById('userNameDisplay').textContent = this.user.name || 'Petani';
        }
    },

    setUser(user) {
        this.isLoggedIn = true;
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('userNameDisplay').textContent = user.name || 'Petani';
    },

    clearUser() {
        this.isLoggedIn = false;
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        document.getElementById('userNameDisplay').textContent = 'Petani';
        this.loadPage('dashboard');
    }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Expose to global
window.App = App;