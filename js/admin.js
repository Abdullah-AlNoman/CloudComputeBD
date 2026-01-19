// admin.js - Admin panel functionality

// DOM Elements
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');
const paymentsTable = document.getElementById('paymentsTable');
const listingsTable = document.getElementById('listingsTable');
const sessionsTable = document.getElementById('sessionsTable');

// Initialize admin panel
function initAdminPanel() {
    loadPaymentsTable();
    loadListingsTable();
    loadSessionsTable();
    setupAdminEvents();
}

// Load payments table
function loadPaymentsTable() {
    const payments = getPayments();
    paymentsTable.innerHTML = '';
    
    payments.forEach(payment => {
        let statusBadge;
        switch (payment.status) {
            case 'pending':
                statusBadge = `<span class="status-badge status-pending">Pending</span>`;
                break;
            case 'approved':
                statusBadge = `<span class="status-badge status-approved">Approved</span>`;
                break;
            case 'rejected':
                statusBadge = `<span class="status-badge status-rejected">Rejected</span>`;
                break;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.userName}</td>
            <td>${payment.pcName}</td>
            <td>৳${payment.amount}</td>
            <td><code>${payment.transactionId}</code></td>
            <td>${statusBadge}</td>
            <td>
                <div class="admin-actions">
                    ${payment.status === 'pending' ? `
                        <button class="admin-btn approve" data-id="${payment.id}">Approve</button>
                        <button class="admin-btn reject" data-id="${payment.id}">Reject</button>
                    ` : ''}
                    <button class="admin-btn view" data-id="${payment.id}">View</button>
                </div>
            </td>
        `;
        paymentsTable.appendChild(row);
    });
    
    // Add event listeners to buttons
    paymentsTable.querySelectorAll('.admin-btn.approve').forEach(btn => {
        btn.addEventListener('click', () => approvePayment(parseInt(btn.dataset.id)));
    });
    
    paymentsTable.querySelectorAll('.admin-btn.reject').forEach(btn => {
        btn.addEventListener('click', () => rejectPayment(parseInt(btn.dataset.id)));
    });
    
    paymentsTable.querySelectorAll('.admin-btn.view').forEach(btn => {
        btn.addEventListener('click', () => viewPayment(parseInt(btn.dataset.id)));
    });
}

// Load listings table
function loadListingsTable() {
    const listings = getListings();
    listingsTable.innerHTML = '';
    
    listings.forEach(listing => {
        let statusBadge;
        switch (listing.status) {
            case 'pending':
                statusBadge = `<span class="status-badge status-pending">Pending</span>`;
                break;
            case 'approved':
                statusBadge = `<span class="status-badge status-approved">Approved</span>`;
                break;
            case 'rejected':
                statusBadge = `<span class="status-badge status-rejected">Rejected</span>`;
                break;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${listing.id}</td>
            <td>${listing.pcName}</td>
            <td>${listing.ownerName}</td>
            <td>${listing.cpu}, ${listing.gpu}, ${listing.ram}</td>
            <td>৳${listing.price}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="admin-actions">
                    ${listing.status === 'pending' ? `
                        <button class="admin-btn approve" data-id="${listing.id}">Approve</button>
                        <button class="admin-btn reject" data-id="${listing.id}">Reject</button>
                    ` : ''}
                    <button class="admin-btn view" data-id="${listing.id}">View</button>
                </div>
            </td>
        `;
        listingsTable.appendChild(row);
    });
    
    // Add event listeners to buttons
    listingsTable.querySelectorAll('.admin-btn.approve').forEach(btn => {
        btn.addEventListener('click', () => approveListing(parseInt(btn.dataset.id)));
    });
    
    listingsTable.querySelectorAll('.admin-btn.reject').forEach(btn => {
        btn.addEventListener('click', () => rejectListing(parseInt(btn.dataset.id)));
    });
}

// Load sessions table
function loadSessionsTable() {
    const sessions = getSessions();
    sessionsTable.innerHTML = '';
    
    sessions.forEach(session => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.id}</td>
            <td>${session.userName}</td>
            <td>${session.pcName}</td>
            <td>${session.startTime}</td>
            <td>${session.endTime}</td>
            <td>${session.remaining}</td>
            <td>
                <div class="admin-actions">
                    <button class="admin-btn view" data-id="${session.id}">Details</button>
                    <button class="admin-btn reject" data-id="${session.id}">Terminate</button>
                </div>
            </td>
        `;
        sessionsTable.appendChild(row);
    });
}

// Setup admin event listeners
function setupAdminEvents() {
    // Tab switching
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            // Update active tab
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            adminTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Approve payment
function approvePayment(paymentId) {
    if (updatePaymentStatus(paymentId, 'approved')) {
        showNotification('Payment approved successfully!', 'success');
        
        // Find the payment to grant access
        const payments = getPayments();
        const payment = payments.find(p => p.id === paymentId);
        
        if (payment) {
            // Find the PC
            const pcs = getPCs();
            const pc = pcs.find(p => p.id === payment.pcId);
            
            if (pc) {
                // Grant access
                setTimeout(() => {
                    showNotification(`Access granted for ${payment.userName} to use ${pc.name}`, 'success');
                    
                    // Update PC status
                    updatePCStatus(pc.id, 'occupied');
                    loadPCs();
                }, 1000);
            }
        }
        
        // Reload table
        loadPaymentsTable();
    }
}

// Reject payment
function rejectPayment(paymentId) {
    if (updatePaymentStatus(paymentId, 'rejected')) {
        showNotification('Payment rejected.', 'info');
        loadPaymentsTable();
    }
}

// View payment details
function viewPayment(paymentId) {
    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);
    
    if (payment) {
        const details = `
            Payment ID: ${payment.id}
            User: ${payment.userName}
            PC: ${payment.pcName}
            Amount: ৳${payment.amount}
            Transaction ID: ${payment.transactionId}
            Sender: ${payment.senderNumber}
            Status: ${payment.status}
            Time: ${payment.timestamp}
        `;
        
        alert(details);
    }
}

// Approve listing
function approveListing(listingId) {
    if (updateListingStatus(listingId, 'approved')) {
        showNotification('PC listing approved! It will now appear in the marketplace.', 'success');
        
        // Add PC to marketplace
        const listings = getListings();
        const listing = listings.find(l => l.id === listingId);
        
        if (listing) {
            const newPC = {
                id: Date.now(),
                name: listing.pcName,
                owner: listing.ownerName,
                cpu: listing.cpu,
                gpu: listing.gpu,
                ram: listing.ram,
                storage: "Not specified",
                internet: "Not specified",
                hourlyPrice: listing.price,
                rating: 4.5,
                status: "available",
                image: "default"
            };
            
            addPC(newPC);
            loadPCs();
        }
        
        loadListingsTable();
    }
}

// Reject listing
function rejectListing(listingId) {
    if (updateListingStatus(listingId, 'rejected')) {
        showNotification('PC listing rejected.', 'info');
        loadListingsTable();
    }
}

// Initialize admin panel when DOM is loaded and user is admin
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser && currentUser.role === 'admin') {
        initAdminPanel();
    }
});