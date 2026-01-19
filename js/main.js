// main.js - Main application logic

// DOM Elements
// GitHub-friendly login modal
function showGitHubLogin() {
    const modalHTML = `
    <div class="modal-overlay" id="githubLoginModal">
        <div class="modal-container glass-card">
            <div class="modal-header">
                <h3><i class="fab fa-github"></i> CloudComputeBD Login</h3>
                <button class="modal-close" id="closeLoginModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="login-tabs">
                    <button class="login-tab active" data-tab="login">Login</button>
                    <button class="login-tab" data-tab="register">Register</button>
                    <button class="login-tab" data-tab="admin">Admin Access</button>
                </div>
                
                <div class="login-content active" id="loginTab">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginUsername">Username or Email</label>
                            <input type="text" id="loginUsername" placeholder="admin / user" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" placeholder="Enter password" required>
                        </div>
                        <div class="demo-credentials">
                            <p><strong>Demo Credentials:</strong></p>
                            <p>Admin: admin / admin123</p>
                            <p>User: user / user123</p>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                </div>
                
                <div class="login-content" id="registerTab">
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="regName">Full Name</label>
                            <input type="text" id="regName" placeholder="Your name" required>
                        </div>
                        <div class="form-group">
                            <label for="regEmail">Email</label>
                            <input type="email" id="regEmail" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="regPassword">Password</label>
                            <input type="password" id="regPassword" placeholder="Create password" required>
                        </div>
                        <div class="form-group">
                            <label for="regConfirm">Confirm Password</label>
                            <input type="password" id="regConfirm" placeholder="Confirm password" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                    </form>
                </div>
                
                <div class="login-content" id="adminTab">
                    <div class="admin-info">
                        <h4><i class="fas fa-shield-alt"></i> Admin Access</h4>
                        <p>For demonstration purposes, you can login as admin using:</p>
                        <div class="admin-creds">
                            <p><strong>Username:</strong> admin</p>
                            <p><strong>Password:</strong> admin123</p>
                        </div>
                        <p class="note">Note: On GitHub Pages, admin panel works with localStorage. All data is stored in your browser.</p>
                        <button class="btn btn-primary btn-block" id="quickAdminLogin">
                            <i class="fas fa-rocket"></i> Quick Admin Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupLoginModal();
}

// GitHub Pages specific CSS যোগ করুন
const githubStyles = `
/* GitHub Pages specific styles */
.login-tabs {
    display: flex;
    gap: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    padding: 5px;
    border-radius: var(--radius-md);
}

.login-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    color: var(--gray);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.login-tab.active {
    background: var(--primary);
    color: white;
}

.login-content {
    display: none;
}

.login-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

.demo-credentials {
    background: rgba(108, 99, 255, 0.1);
    padding: 15px;
    border-radius: var(--radius-md);
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.demo-credentials p {
    margin: 5px 0;
    color: var(--gray-light);
}

.admin-creds {
    background: rgba(76, 175, 80, 0.1);
    padding: 15px;
    border-radius: var(--radius-md);
    margin: 15px 0;
}

.note {
    font-size: 0.85rem;
    color: var(--warning);
    font-style: italic;
    margin-top: 15px;
}
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', `<style>${githubStyles}</style>`);
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userProfile = document.getElementById('userProfile');
const userName = document.getElementById('userName');
const startRentingBtn = document.getElementById('startRentingBtn');
const listPcBtn = document.getElementById('listPcBtn');
const pcGrid = document.getElementById('pcGrid');
const cpuFilter = document.getElementById('cpuFilter');
const gpuFilter = document.getElementById('gpuFilter');
const sortFilter = document.getElementById('sortFilter');
const adminSection = document.getElementById('adminSection');
const adminLinks = document.querySelectorAll('.admin-link, .dashboard-link');

// State variables
let selectedPC = null;

// Initialize the application
function initApp() {
    updateUserUI();
    loadPCs();
    setupEventListeners();
    setupSmoothScroll();
    
    // Check if we should show admin panel
    if (currentUser && currentUser.role === 'admin') {
        adminSection.classList.remove('hidden');
    }
}

// Update UI based on user login state
function updateUserUI() {
    if (currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userName.textContent = currentUser.name.split(' ')[0];
        
        // Show admin link if user is admin
        if (currentUser.role === 'admin') {
            adminLinks.forEach(link => link.classList.remove('hidden'));
        }
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
        adminLinks.forEach(link => link.classList.add('hidden'));
        adminSection.classList.add('hidden');
    }
}

// Load and display PCs
function loadPCs() {
    const pcs = getPCs();
    const cpuFilterValue = cpuFilter.value;
    const gpuFilterValue = gpuFilter.value;
    const sortFilterValue = sortFilter.value;
    
    // Filter PCs
    let filteredPCs = pcs.filter(pc => {
        if (cpuFilterValue !== 'all' && !pc.cpu.toLowerCase().includes(cpuFilterValue.toLowerCase())) {
            return false;
        }
        if (gpuFilterValue !== 'all' && !pc.gpu.toLowerCase().includes(gpuFilterValue.toLowerCase())) {
            return false;
        }
        return true;
    });
    
    // Sort PCs
    filteredPCs.sort((a, b) => {
        switch (sortFilterValue) {
            case 'price-low':
                return a.hourlyPrice - b.hourlyPrice;
            case 'price-high':
                return b.hourlyPrice - a.hourlyPrice;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    // Clear grid
    pcGrid.innerHTML = '';
    
    // Generate PC cards
    filteredPCs.forEach(pc => {
        const pcCard = createPCCard(pc);
        pcGrid.appendChild(pcCard);
    });
}

// Create PC card element
function createPCCard(pc) {
    const card = document.createElement('div');
    card.className = 'pc-card glass-card fade-in';
    card.dataset.id = pc.id;
    
    // Status badge
    let statusClass, statusText;
    switch (pc.status) {
        case 'available':
            statusClass = 'status-available';
            statusText = 'Available';
            break;
        case 'occupied':
            statusClass = 'status-occupied';
            statusText = 'Occupied';
            break;
        case 'offline':
            statusClass = 'status-offline';
            statusText = 'Offline';
            break;
    }
    
    card.innerHTML = `
        <div class="pc-card-header">
            <div>
                <h3 class="pc-card-title">${pc.name}</h3>
                <div class="pc-card-owner">
                    <i class="fas fa-user"></i>
                    <span>${pc.owner}</span>
                </div>
            </div>
            <div class="pc-card-price">
                <div class="price">৳${pc.hourlyPrice}</div>
                <div class="period">per hour</div>
            </div>
        </div>
        
        <div class="pc-card-specs">
            <span class="spec-tag">${pc.cpu}</span>
            <span class="spec-tag">${pc.gpu}</span>
            <span class="spec-tag">${pc.ram}</span>
            <span class="spec-tag">${pc.storage}</span>
        </div>
        
        <div class="pc-card-footer">
            <div class="pc-status ${statusClass}">
                <i class="fas fa-circle"></i>
                <span>${statusText}</span>
            </div>
            <div class="rating">
                <i class="fas fa-star"></i>
                <span>${pc.rating}</span>
            </div>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', () => {
        if (pc.status === 'available') {
            selectPCForRental(pc);
        } else {
            showNotification(`This PC is currently ${pc.status}. Please select another PC.`, 'warning');
        }
    });
    
    return card;
}

// Select PC for rental
function selectPCForRental(pc) {
    if (!currentUser) {
        showNotification('Please login to rent a PC', 'warning');
        simulateLogin();
        return;
    }
    
    selectedPC = pc;
    showRentalModal();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Scroll to section
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                
                // Show admin section if clicked
                if (targetId === '#admin') {
                    if (currentUser && currentUser.role === 'admin') {
                        adminSection.classList.remove('hidden');
                        window.scrollTo({
                            top: adminSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    } else {
                        showNotification('Admin access required', 'warning');
                    }
                }
            }
        });
    });
    
    // Login button
    loginBtn.addEventListener('click', simulateLogin);
    
    // Register button
    registerBtn.addEventListener('click', simulateRegister);
    
    // User profile click
    userProfile.addEventListener('click', () => {
        showNotification(`Logged in as ${currentUser.name} (${currentUser.role})`, 'info');
    });
    
    // Start renting button
    startRentingBtn.addEventListener('click', () => {
        document.querySelector('#marketplace').scrollIntoView({ behavior: 'smooth' });
    });
    
    // List PC button
    listPcBtn.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('Please login to list your PC', 'warning');
            simulateLogin();
            return;
        }
        showListPcModal();
    });
    
    // Filter change events
    cpuFilter.addEventListener('change', loadPCs);
    gpuFilter.addEventListener('change', loadPCs);
    sortFilter.addEventListener('change', loadPCs);
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Setup smooth scrolling for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--dark-tertiary);
                border-left: 4px solid var(--primary);
                border-radius: var(--radius-md);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                max-width: 400px;
                z-index: 1000;
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease;
                transform: translateX(0);
            }
            .notification-success {
                border-left-color: var(--success);
            }
            .notification-warning {
                border-left-color: var(--warning);
            }
            .notification-info {
                border-left-color: var(--primary);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--gray);
                cursor: pointer;
                font-size: 1rem;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Simulate login (in a real app, this would be an API call)
function simulateLogin() {
    // For demo purposes, create a dummy user
    const user = {
        id: 'user_' + Date.now(),
        name: 'Demo User',
        email: 'demo@cloudcomputebd.com',
        role: Math.random() > 0.8 ? 'admin' : 'user' // 20% chance of admin for demo
    };
    
    saveCurrentUser(user);
    updateUserUI();
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Show admin panel if user is admin
    if (user.role === 'admin') {
        adminSection.classList.remove('hidden');
    }
}

// Simulate register
function simulateRegister() {
    // For demo purposes, create a dummy user
    const user = {
        id: 'user_' + Date.now(),
        name: 'New User',
        email: 'newuser@cloudcomputebd.com',
        role: 'user'
    };
    
    saveCurrentUser(user);
    updateUserUI();
    showNotification(`Account created successfully! Welcome, ${user.name}!`, 'success');
}

// Show list PC modal
function showListPcModal() {
    const modalHTML = `
        <div class="modal-overlay" id="listPcModal">
            <div class="modal-container glass-card">
                <div class="modal-header">
                    <h3>List Your PC for Rent</h3>
                    <button class="modal-close" id="closeListPcModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="listPcForm">
                        <div class="form-group">
                            <label for="pcName">PC Name</label>
                            <input type="text" id="pcName" placeholder="e.g., RTX 4090 Gaming PC" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pcCpu">CPU Model</label>
                                <input type="text" id="pcCpu" placeholder="e.g., i9-13900K" required>
                            </div>
                            <div class="form-group">
                                <label for="pcGpu">GPU Model</label>
                                <input type="text" id="pcGpu" placeholder="e.g., RTX 4090" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pcRam">RAM</label>
                                <input type="text" id="pcRam" placeholder="e.g., 32GB DDR5" required>
                            </div>
                            <div class="form-group">
                                <label for="pcStorage">Storage</label>
                                <input type="text" id="pcStorage" placeholder="e.g., 2TB NVMe SSD" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pcInternet">Internet Speed</label>
                                <input type="text" id="pcInternet" placeholder="e.g., 1 Gbps" required>
                            </div>
                            <div class="form-group">
                                <label for="pcPrice">Hourly Price (৳)</label>
                                <input type="number" id="pcPrice" min="50" max="500" value="100" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="pcDescription">Description (Optional)</label>
                            <textarea id="pcDescription" rows="3" placeholder="Describe your PC's features and condition..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-upload"></i> Submit for Approval
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const listPcModal = document.getElementById('listPcModal');
    const closeListPcModal = document.getElementById('closeListPcModal');
    const listPcForm = document.getElementById('listPcForm');
    
    // Show modal
    setTimeout(() => listPcModal.classList.remove('hidden'), 10);
    
    // Close modal
    closeListPcModal.addEventListener('click', () => {
        listPcModal.classList.add('hidden');
        setTimeout(() => listPcModal.remove(), 300);
    });
    
    // Form submission
    listPcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Create new PC listing
        const newListing = {
            id: Date.now(),
            pcName: document.getElementById('pcName').value,
            ownerName: currentUser.name,
            cpu: document.getElementById('pcCpu').value,
            gpu: document.getElementById('pcGpu').value,
            ram: document.getElementById('pcRam').value,
            price: parseInt(document.getElementById('pcPrice').value),
            status: 'pending'
        };
        
        // Add to listings
        const listings = getListings();
        listings.push(newListing);
        saveListings(listings);
        
        // Close modal
        listPcModal.classList.add('hidden');
        setTimeout(() => {
            listPcModal.remove();
            showNotification('PC listing submitted for admin approval!', 'success');
        }, 300);
    });
    
    // Close modal when clicking outside
    listPcModal.addEventListener('click', (e) => {
        if (e.target === listPcModal) {
            listPcModal.classList.add('hidden');
            setTimeout(() => listPcModal.remove(), 300);
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);