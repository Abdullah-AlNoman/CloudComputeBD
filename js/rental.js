// rental.js - Handles rental and payment flow

// DOM Elements
const rentalModal = document.getElementById('rentalModal');
const closeRentalModal = document.getElementById('closeRentalModal');
const rentalPcTitle = document.getElementById('rentalPcTitle');
const rentalPcCpu = document.getElementById('rentalPcCpu');
const rentalPcGpu = document.getElementById('rentalPcGpu');
const rentalPcRam = document.getElementById('rentalPcRam');
const rentalPcPrice = document.getElementById('rentalPcPrice');
const rentalHours = document.getElementById('rentalHours');
const decreaseHours = document.getElementById('decreaseHours');
const increaseHours = document.getElementById('increaseHours');
const totalPrice = document.getElementById('totalPrice');
const proceedToPayment = document.getElementById('proceedToPayment');
const paymentModal = document.getElementById('paymentModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const paymentAmount = document.getElementById('paymentAmount');
const copyBkash = document.getElementById('copyBkash');
const transactionId = document.getElementById('transactionId');
const senderNumber = document.getElementById('senderNumber');
const paymentScreenshot = document.getElementById('paymentScreenshot');
const cancelPayment = document.getElementById('cancelPayment');
const submitPayment = document.getElementById('submitPayment');
const accessModal = document.getElementById('accessModal');
const anydeskId = document.getElementById('anydeskId');
const anydeskPassword = document.getElementById('anydeskPassword');
const copyAnyDeskId = document.getElementById('copyAnyDeskId');
const copyAnyDeskPassword = document.getElementById('copyAnyDeskPassword');
const sessionTimer = document.getElementById('sessionTimer');
const timerProgress = document.getElementById('timerProgress');
const extendSession = document.getElementById('extendSession');
const disconnectSession = document.getElementById('disconnectSession');

// Rental state
let rentalHoursValue = 1;
let hourlyPrice = 0;
let currentSessionTimer = null;

// Show rental modal
function showRentalModal() {
    if (!selectedPC) return;
    
    // Update modal content
    rentalPcTitle.textContent = selectedPC.name;
    rentalPcCpu.textContent = selectedPC.cpu;
    rentalPcGpu.textContent = selectedPC.gpu;
    rentalPcRam.textContent = selectedPC.ram;
    rentalPcPrice.textContent = `৳${selectedPC.hourlyPrice}`;
    
    // Set initial values
    hourlyPrice = selectedPC.hourlyPrice;
    rentalHoursValue = 1;
    rentalHours.value = rentalHoursValue;
    updateTotalPrice();
    
    // Show modal
    rentalModal.classList.remove('hidden');
}

// Update total price
function updateTotalPrice() {
    const total = hourlyPrice * rentalHoursValue;
    totalPrice.textContent = `৳${total}`;
    paymentAmount.textContent = `৳${total}`;
}

// Setup rental event listeners
function setupRentalEvents() {
    // Close rental modal
    closeRentalModal.addEventListener('click', () => {
        rentalModal.classList.add('hidden');
        selectedPC = null;
    });
    
    // Close when clicking outside
    rentalModal.addEventListener('click', (e) => {
        if (e.target === rentalModal) {
            rentalModal.classList.add('hidden');
            selectedPC = null;
        }
    });
    
    // Rental hours controls
    decreaseHours.addEventListener('click', () => {
        if (rentalHoursValue > 1) {
            rentalHoursValue--;
            rentalHours.value = rentalHoursValue;
            updateTotalPrice();
        }
    });
    
    increaseHours.addEventListener('click', () => {
        if (rentalHoursValue < 24) {
            rentalHoursValue++;
            rentalHours.value = rentalHoursValue;
            updateTotalPrice();
        }
    });
    
    rentalHours.addEventListener('change', () => {
        let value = parseInt(rentalHours.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 24) value = 24;
        rentalHoursValue = value;
        rentalHours.value = value;
        updateTotalPrice();
    });
    
    // Proceed to payment
    proceedToPayment.addEventListener('click', () => {
        rentalModal.classList.add('hidden');
        showPaymentModal();
    });
    
    // Payment modal events
    closePaymentModal.addEventListener('click', () => {
        paymentModal.classList.add('hidden');
        selectedPC = null;
    });
    
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.classList.add('hidden');
            selectedPC = null;
        }
    });
    
    // Copy bKash number
    copyBkash.addEventListener('click', () => {
        const bkashNumber = '017XX-XXXXXX';
        navigator.clipboard.writeText(bkashNumber).then(() => {
            showNotification('bKash number copied to clipboard!', 'success');
        });
    });
    
    // Cancel payment
    cancelPayment.addEventListener('click', () => {
        paymentModal.classList.add('hidden');
        selectedPC = null;
    });
    
    // Submit payment
    submitPayment.addEventListener('click', () => {
        const trxId = transactionId.value.trim();
        const sender = senderNumber.value.trim();
        
        if (!trxId || trxId.length < 8) {
            showNotification('Please enter a valid Transaction ID', 'warning');
            return;
        }
        
        if (!sender || sender.length < 11) {
            showNotification('Please enter a valid bKash number', 'warning');
            return;
        }
        
        // Create payment record
        const payment = {
            id: Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            pcId: selectedPC.id,
            pcName: selectedPC.name,
            amount: hourlyPrice * rentalHoursValue,
            transactionId: trxId,
            senderNumber: sender,
            status: 'pending',
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        // Add to payments
        addPayment(payment);
        
        // Show success message
        showNotification('Payment submitted for verification! You will receive access after admin approval.', 'success');
        
        // Close payment modal
        paymentModal.classList.add('hidden');
        
        // Reset form
        transactionId.value = '';
        senderNumber.value = '';
        
        // For demo purposes, simulate immediate approval
        if (currentUser.role === 'admin') {
            setTimeout(() => {
                showNotification('Payment approved! (Admin demo)', 'success');
                grantAccess(selectedPC, rentalHoursValue, payment.id);
            }, 2000);
        }
    });
    
    // Access modal events
    copyAnyDeskId.addEventListener('click', () => {
        const id = anydeskId.textContent;
        navigator.clipboard.writeText(id.replace(/\s/g, '')).then(() => {
            showNotification('AnyDesk ID copied!', 'success');
        });
    });
    
    copyAnyDeskPassword.addEventListener('click', () => {
        const password = anydeskPassword.textContent;
        navigator.clipboard.writeText(password).then(() => {
            showNotification('Password copied!', 'success');
        });
    });
    
    extendSession.addEventListener('click', () => {
        showNotification('Session extended by 1 hour!', 'success');
        // In a real app, this would open payment modal again
    });
    
    disconnectSession.addEventListener('click', () => {
        if (confirm('Are you sure you want to disconnect? Any unsaved work will be lost.')) {
            stopSessionTimer();
            accessModal.classList.add('hidden');
            showNotification('Session disconnected.', 'info');
        }
    });
}

// Show payment modal
function showPaymentModal() {
    paymentModal.classList.remove('hidden');
}

// Grant access to PC (simulated admin approval)
function grantAccess(pc, hours, paymentId) {
    // Update payment status
    updatePaymentStatus(paymentId, 'approved');
    
    // Update PC status
    updatePCStatus(pc.id, 'occupied');
    
    // Generate AnyDesk credentials
    const credentials = generateAnyDeskCredentials();
    
    // Update access modal
    anydeskId.textContent = credentials.id;
    anydeskPassword.textContent = credentials.password;
    
    // Start session timer
    const totalSeconds = hours * 3600;
    startSessionTimer(totalSeconds);
    
    // Create session record
    const session = {
        id: 'session_' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        pcId: pc.id,
        pcName: pc.name,
        startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        endTime: new Date(Date.now() + hours * 3600000).toISOString().slice(0, 19).replace('T', ' '),
        remaining: formatTime(totalSeconds)
    };
    
    // Add to sessions
    startSession(session);
    
    // Reload PCs to update status
    loadPCs();
    
    // Show access modal
    accessModal.classList.remove('hidden');
}

// Start session timer
function startSessionTimer(totalSeconds) {
    let remainingSeconds = totalSeconds;
    
    // Clear existing timer
    if (currentSessionTimer) {
        clearInterval(currentSessionTimer);
    }
    
    // Update timer immediately
    updateTimerDisplay(remainingSeconds);
    
    // Start countdown
    currentSessionTimer = setInterval(() => {
        remainingSeconds--;
        
        if (remainingSeconds <= 0) {
            stopSessionTimer();
            showNotification('Session time has ended!', 'warning');
            accessModal.classList.add('hidden');
            return;
        }
        
        updateTimerDisplay(remainingSeconds);
        
        // Show warning at 5 minutes
        if (remainingSeconds === 300) {
            showNotification('Your session will end in 5 minutes!', 'warning');
        }
    }, 1000);
}

// Stop session timer
function stopSessionTimer() {
    if (currentSessionTimer) {
        clearInterval(currentSessionTimer);
        currentSessionTimer = null;
    }
}

// Update timer display
function updateTimerDisplay(seconds) {
    // Format time as HH:MM:SS
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    sessionTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // Update progress bar (demo: assumes 1 hour max)
    const maxSeconds = 3600; // 1 hour
    const progressPercent = Math.min(100, (seconds / maxSeconds) * 100);
    timerProgress.style.width = `${progressPercent}%`;
}

// Format time for display
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// Initialize rental functionality
document.addEventListener('DOMContentLoaded', setupRentalEvents);