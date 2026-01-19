// data.js - Contains all dummy data for the application

// Dummy PC data
// GitHub Pages compatible data storage
class GitHubAdmin {
    constructor() {
        this.initStorage();
        this.currentUser = this.getCurrentUser();
    }
    
    initStorage() {
        // Initialize with demo data if empty
        const defaultData = {
            users: [
                { id: 'admin_001', name: 'Admin User', email: 'admin@cloudbd.com', role: 'admin', password: 'admin123' },
                { id: 'user_001', name: 'Demo User', email: 'user@cloudbd.com', role: 'user', password: 'user123' }
            ],
            pcs: [...], // Your existing PC data
            payments: [...], // Your existing payment data
            listings: [...], // Your existing listing data
            sessions: [] // Your existing session data
        };
        
        // Check and initialize each storage key
        Object.keys(defaultData).forEach(key => {
            if (!localStorage.getItem(`cloud_${key}`)) {
                localStorage.setItem(`cloud_${key}`, JSON.stringify(defaultData[key]));
            }
        });
    }
    
    // User management
    login(username, password) {
        const users = JSON.parse(localStorage.getItem('cloud_users'));
        const user = users.find(u => 
            (u.email === username || u.name === username) && 
            u.password === password
        );
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('cloud_currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('cloud_currentUser');
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('cloud_currentUser'));
    }
    
    // Admin specific methods
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    // Export all data (for backup)
    exportData() {
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cloud_')) {
                data[key] = JSON.parse(localStorage.getItem(key));
            }
        });
        return JSON.stringify(data, null, 2);
    }
    
    // Import data (for restore)
    importData(jsonData) {
        const data = JSON.parse(jsonData);
        Object.keys(data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(data[key]));
        });
        return true;
    }
}

// Global instance
const cloudAdmin = new GitHubAdmin();

// js/data.js ফাইলে এই পরিবর্তন করুন
const ADMIN_CREDENTIALS = {
    username: "admin_cloudbd",
    password: "SecurePass123#", // পরিবর্তন করুন
    email: "admin@cloudcomputebd.com"
};

// Real authentication function যোগ করুন
function realAdminLogin(username, password) {
    if(username === ADMIN_CREDENTIALS.username && 
       password === ADMIN_CREDENTIALS.password) {
        // Create admin session
        const adminUser = {
            id: 'admin_001',
            name: 'System Admin',
            email: ADMIN_CREDENTIALS.email,
            role: 'admin'
        };
        saveCurrentUser(adminUser);
        return true;
    }
    return false;
}
const pcs = [
    {
        id: 1,
        name: "RTX 4090 Gaming Beast",
        owner: "Aminul Islam",
        cpu: "i9-13900K",
        gpu: "RTX 4090",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        internet: "1 Gbps",
        hourlyPrice: 150,
        rating: 4.9,
        status: "available",
        image: "gaming"
    },
    {
        id: 2,
        name: "Streaming Pro PC",
        owner: "Rahim Khan",
        cpu: "Ryzen 9 7950X",
        gpu: "RTX 4080",
        ram: "64GB DDR5",
        storage: "4TB NVMe SSD",
        internet: "500 Mbps",
        hourlyPrice: 120,
        rating: 4.7,
        status: "available",
        image: "streaming"
    },
    {
        id: 3,
        name: "AI/ML Workstation",
        owner: "Sakib Hasan",
        cpu: "Threadripper PRO 5995WX",
        gpu: "RTX 6000 Ada",
        ram: "128GB DDR4",
        storage: "8TB NVMe RAID",
        internet: "1 Gbps",
        hourlyPrice: 300,
        rating: 4.8,
        status: "occupied",
        image: "workstation"
    },
    {
        id: 4,
        name: "Budget Gaming PC",
        owner: "Fahim Ahmed",
        cpu: "i5-13600K",
        gpu: "RTX 4070 Ti",
        ram: "16GB DDR4",
        storage: "1TB NVMe SSD",
        internet: "300 Mbps",
        hourlyPrice: 80,
        rating: 4.5,
        status: "available",
        image: "budget"
    },
    {
        id: 5,
        name: "4K Video Editing",
        owner: "Tania Akter",
        cpu: "i7-13700K",
        gpu: "RTX 3090",
        ram: "32GB DDR5",
        storage: "2TB NVMe + 4TB HDD",
        internet: "500 Mbps",
        hourlyPrice: 110,
        rating: 4.6,
        status: "available",
        image: "editing"
    },
    {
        id: 6,
        name: "Server Hosting PC",
        owner: "Rajib Hossain",
        cpu: "Xeon W-3375",
        gpu: "RTX A6000",
        ram: "256GB ECC",
        storage: "10TB NVMe RAID",
        internet: "2 Gbps",
        hourlyPrice: 250,
        rating: 4.9,
        status: "offline",
        image: "server"
    }
];

// Dummy payment verification data
const payments = [
    {
        id: 1001,
        userId: "user_202",
        userName: "Karim Ahmed",
        pcId: 1,
        pcName: "RTX 4090 Gaming Beast",
        amount: 300,
        transactionId: "8A7B6C5D4E3F",
        senderNumber: "01712345678",
        status: "pending",
        timestamp: "2023-10-15 14:30:00"
    },
    {
        id: 1002,
        userId: "user_205",
        userName: "Jahanara Begum",
        pcId: 2,
        pcName: "Streaming Pro PC",
        amount: 240,
        transactionId: "9B8C7D6E5F4A",
        senderNumber: "01987654321",
        status: "approved",
        timestamp: "2023-10-14 11:20:00"
    },
    {
        id: 1003,
        userId: "user_210",
        userName: "Rafiqul Islam",
        pcId: 4,
        pcName: "Budget Gaming PC",
        amount: 160,
        transactionId: "7C6D5E4F3A2B",
        senderNumber: "01811223344",
        status: "rejected",
        timestamp: "2023-10-13 16:45:00"
    }
];

// Dummy PC listings for admin approval
const listings = [
    {
        id: 2001,
        pcName: "Ryzen 7 Gaming PC",
        ownerName: "Nasir Uddin",
        cpu: "Ryzen 7 5800X",
        gpu: "RX 7900 XT",
        ram: "32GB DDR4",
        price: 95,
        status: "pending"
    },
    {
        id: 2002,
        pcName: "Intel Arc Build",
        ownerName: "Sumon Rahman",
        cpu: "i5-13400F",
        gpu: "Arc A770",
        ram: "16GB DDR4",
        price: 70,
        status: "approved"
    },
    {
        id: 2003,
        pcName: "Mini ITX Server",
        ownerName: "Farhana Yeasmin",
        cpu: "Ryzen 9 7900",
        gpu: "RTX 4060 Ti",
        ram: "64GB DDR5",
        price: 130,
        status: "pending"
    }
];

// Dummy active sessions
const sessions = [
    {
        id: "session_001",
        userId: "user_205",
        userName: "Jahanara Begum",
        pcId: 2,
        pcName: "Streaming Pro PC",
        startTime: "2023-10-15 10:00:00",
        endTime: "2023-10-15 12:00:00",
        remaining: "00:45:23"
    },
    {
        id: "session_002",
        userId: "user_212",
        userName: "Sohel Rana",
        pcId: 5,
        pcName: "4K Video Editing",
        startTime: "2023-10-15 09:30:00",
        endTime: "2023-10-15 11:30:00",
        remaining: "00:15:10"
    }
];

// Current user session
let currentUser = null;
let currentRental = null;
let currentSession = null;

// Initialize localStorage with dummy data if empty
function initializeData() {
    if (!localStorage.getItem('cloudCompute_pcs')) {
        localStorage.setItem('cloudCompute_pcs', JSON.stringify(pcs));
    }
    
    if (!localStorage.getItem('cloudCompute_payments')) {
        localStorage.setItem('cloudCompute_payments', JSON.stringify(payments));
    }
    
    if (!localStorage.getItem('cloudCompute_listings')) {
        localStorage.setItem('cloudCompute_listings', JSON.stringify(listings));
    }
    
    if (!localStorage.getItem('cloudCompute_sessions')) {
        localStorage.setItem('cloudCompute_sessions', JSON.stringify(sessions));
    }
    
    // Check for existing user session
    const user = localStorage.getItem('cloudCompute_currentUser');
    if (user) {
        currentUser = JSON.parse(user);
    }
}

// Get data from localStorage
function getPCs() {
    return JSON.parse(localStorage.getItem('cloudCompute_pcs') || '[]');
}

function getPayments() {
    return JSON.parse(localStorage.getItem('cloudCompute_payments') || '[]');
}

function getListings() {
    return JSON.parse(localStorage.getItem('cloudCompute_listings') || '[]');
}

function getSessions() {
    return JSON.parse(localStorage.getItem('cloudCompute_sessions') || '[]');
}

// Save data to localStorage
function savePCs(pcs) {
    localStorage.setItem('cloudCompute_pcs', JSON.stringify(pcs));
}

function savePayments(payments) {
    localStorage.setItem('cloudCompute_payments', JSON.stringify(payments));
}

function saveListings(listings) {
    localStorage.setItem('cloudCompute_listings', JSON.stringify(listings));
}

function saveSessions(sessions) {
    localStorage.setItem('cloudCompute_sessions', JSON.stringify(sessions));
}

function saveCurrentUser(user) {
    currentUser = user;
    if (user) {
        localStorage.setItem('cloudCompute_currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('cloudCompute_currentUser');
    }
}

// Add a new payment
function addPayment(payment) {
    const payments = getPayments();
    payments.push(payment);
    savePayments(payments);
}

// Update payment status
function updatePaymentStatus(paymentId, status) {
    const payments = getPayments();
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex !== -1) {
        payments[paymentIndex].status = status;
        savePayments(payments);
        return true;
    }
    return false;
}

// Update listing status
function updateListingStatus(listingId, status) {
    const listings = getListings();
    const listingIndex = listings.findIndex(l => l.id === listingId);
    if (listingIndex !== -1) {
        listings[listingIndex].status = status;
        saveListings(listings);
        return true;
    }
    return false;
}

// Add a new PC
function addPC(pc) {
    const pcs = getPCs();
    pc.id = Date.now(); // Simple ID generation
    pcs.push(pc);
    savePCs(pcs);
    return pc.id;
}

// Update PC status
function updatePCStatus(pcId, status) {
    const pcs = getPCs();
    const pcIndex = pcs.findIndex(p => p.id === pcId);
    if (pcIndex !== -1) {
        pcs[pcIndex].status = status;
        savePCs(pcs);
        return true;
    }
    return false;
}

// Start a new session
function startSession(session) {
    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
    return session.id;
}

// End a session
function endSession(sessionId) {
    const sessions = getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        sessions.splice(sessionIndex, 1);
        saveSessions(sessions);
        return true;
    }
    return false;
}

// Generate random AnyDesk credentials
function generateAnyDeskCredentials() {
    const id = Math.floor(100000000 + Math.random() * 900000000).toString();
    const formattedId = id.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $456 $789');
    const password = 'CloudPC' + Math.floor(1000 + Math.random() * 9000);
    return { id: formattedId, password };
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', initializeData);