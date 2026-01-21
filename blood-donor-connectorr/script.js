// Blood Donor Connector - Main JavaScript

// Initialize data storage
let donors = [];
let requests = [];
let hospitals = [];

// Check if data exists in localStorage, otherwise initialize with sample data
function initializeData() {
    // Try to load data from localStorage
    const storedDonors = localStorage.getItem('bloodDonorConnector_donors');
    const storedRequests = localStorage.getItem('bloodDonorConnector_requests');
    const storedHospitals = localStorage.getItem('bloodDonorConnector_hospitals');
    
    if (storedDonors) {
        donors = JSON.parse(storedDonors);
    } else {
        // Initialize with sample donors
        donors = [
            { id: 1, name: "John Smith", bloodType: "O+", phone: "555-1234", location: "Downtown", lastDonation: "2023-05-15", available: true },
            { id: 2, name: "Maria Garcia", bloodType: "A-", phone: "555-5678", location: "North Side", lastDonation: "2023-06-10", available: true },
            { id: 3, name: "David Chen", bloodType: "B+", phone: "555-8765", location: "East End", lastDonation: "2023-04-22", available: true },
            { id: 4, name: "Sarah Johnson", bloodType: "O-", phone: "555-4321", location: "West Side", lastDonation: "2023-07-01", available: false },
            { id: 5, name: "Robert Williams", bloodType: "AB+", phone: "555-9876", location: "South End", lastDonation: "2023-03-18", available: true }
        ];
        saveDonors();
    }
    
    if (storedRequests) {
        requests = JSON.parse(storedRequests);
    } else {
        // Initialize with sample requests
        requests = [
            { id: 1, hospital: "City General Hospital", bloodType: "O+", units: 3, urgency: "High", location: "Downtown", status: "Pending", timestamp: "2023-08-10 14:30" },
            { id: 2, hospital: "Northside Medical Center", bloodType: "A-", units: 2, urgency: "Medium", location: "North Side", status: "Pending", timestamp: "2023-08-11 09:15" },
            { id: 3, hospital: "East End Clinic", bloodType: "B+", units: 1, urgency: "High", location: "East End", status: "Fulfilled", timestamp: "2023-08-09 16:45" }
        ];
        saveRequests();
    }
    
    if (storedHospitals) {
        hospitals = JSON.parse(storedHospitals);
    } else {
        // Initialize with sample hospitals
        hospitals = [
            { id: 1, name: "City General Hospital", code: "CGH001", location: "Downtown" },
            { id: 2, name: "Northside Medical Center", code: "NMC002", location: "North Side" },
            { id: 3, name: "East End Clinic", code: "EEC003", location: "East End" },
            { id: 4, name: "West Side Hospital", code: "WSH004", location: "West Side" }
        ];
        saveHospitals();
    }
    
    // Update statistics on the home page
    updateStats();
}

// Save data to localStorage
function saveDonors() {
    localStorage.setItem('bloodDonorConnector_donors', JSON.stringify(donors));
}

function saveRequests() {
    localStorage.setItem('bloodDonorConnector_requests', JSON.stringify(requests));
}

function saveHospitals() {
    localStorage.setItem('bloodDonorConnector_hospitals', JSON.stringify(hospitals));
}

// Update statistics on the home page
function updateStats() {
    const donorsCount = donors.length;
    const requestsCount = requests.length;
    const hospitalsCount = hospitals.length;
    
    // Calculate lives saved (estimate: each donation can save up to 3 lives)
    const livesSaved = donors.reduce((total, donor) => {
        // Simple estimate: each donor has donated 2 times on average
        return total + 2 * 3;
    }, 0);
    
    // Animate counting up
    animateCounter('donors-count', donorsCount);
    animateCounter('requests-count', requestsCount);
    animateCounter('lives-saved', livesSaved);
    animateCounter('hospitals-count', hospitalsCount);
}

// Animate counter effect
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = targetValue / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

// Hospital Functions
function submitRequest() {
    const hospital = document.getElementById('hospital').value;
    const bloodType = document.getElementById('blood-type').value;
    const units = document.getElementById('units').value;
    const urgency = document.getElementById('urgency').value;
    const location = document.getElementById('location').value;
    
    if (!hospital || !bloodType || !units || !urgency || !location) {
        alert('Please fill in all fields');
        return;
    }
    
    const newRequest = {
        id: requests.length + 1,
        hospital: hospital,
        bloodType: bloodType,
        units: parseInt(units),
        urgency: urgency,
        location: location,
        status: "Pending",
        timestamp: new Date().toLocaleString()
    };
    
    requests.push(newRequest);
    saveRequests();
    
    // Find matching donors
    const matchingDonors = findMatchingDonors(bloodType, location);
    
    // Update display
    displayRequests();
    
    // Show confirmation
    alert(`Request submitted successfully! ${matchingDonors.length} matching donors have been notified.`);
    
    // Clear form
    document.getElementById('request-form').reset();
    
    return false;
}

function findMatchingDonors(bloodType, location) {
    // Simple matching logic - in a real app this would be more sophisticated
    const compatibleBloodTypes = getCompatibleBloodTypes(bloodType);
    
    return donors.filter(donor => {
        return compatibleBloodTypes.includes(donor.bloodType) && 
               donor.available === true;
    });
}

function getCompatibleBloodTypes(bloodType) {
    const compatibility = {
        'O+': ['O+', 'O-'],
        'O-': ['O-'],
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-']
    };
    
    return compatibility[bloodType] || [];
}

function displayRequests() {
    const requestList = document.getElementById('request-list');
    if (!requestList) return;
    
    // Filter requests based on status filter
    const statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : 'All';
    let filteredRequests = requests;
    
    if (statusFilter !== 'All') {
        filteredRequests = requests.filter(request => request.status === statusFilter);
    }
    
    if (filteredRequests.length === 0) {
        requestList.innerHTML = '<div class="request-card"><p>No requests found.</p></div>';
        return;
    }
    
    requestList.innerHTML = '';
    
    filteredRequests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        
        requestCard.innerHTML = `
            <div class="request-header">
                <div>
                    <h3 class="request-title">${request.hospital}</h3>
                    <span class="blood-type-badge">${request.bloodType}</span>
                    ${request.urgency === 'High' ? '<span class="urgent-badge">URGENT</span>' : ''}
                </div>
                <div>
                    <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
                </div>
            </div>
            <div class="request-details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span><strong>Units Needed:</strong> ${request.units}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Location:</strong> ${request.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span><strong>Submitted:</strong> ${request.timestamp}</span>
                </div>
            </div>
            <div class="request-actions">
                ${request.status === 'Pending' ? 
                    `<button class="btn btn-primary" onclick="fulfillRequest(${request.id})">Mark as Fulfilled</button>` : 
                    ''}
                <button class="btn btn-outline" onclick="viewMatchingDonors('${request.bloodType}', '${request.location}')">View Matching Donors</button>
            </div>
        `;
        
        requestList.appendChild(requestCard);
    });
}

function fulfillRequest(requestId) {
    const request = requests.find(req => req.id === requestId);
    if (request) {
        request.status = "Fulfilled";
        saveRequests();
        displayRequests();
        alert('Request marked as fulfilled. Thank you!');
    }
}

function viewMatchingDonors(bloodType, location) {
    const matchingDonors = findMatchingDonors(bloodType, location);
    
    let message = `Matching donors for ${bloodType} in ${location}:\n\n`;
    
    if (matchingDonors.length === 0) {
        message += "No matching donors found at this time.";
    } else {
        matchingDonors.forEach(donor => {
            message += `• ${donor.name} (${donor.bloodType}) - ${donor.phone}\n`;
        });
    }
    
    alert(message);
}

// Donor Functions
function registerDonor() {
    const name = document.getElementById('donor-name').value;
    const bloodType = document.getElementById('donor-blood-type').value;
    const phone = document.getElementById('donor-phone').value;
    const location = document.getElementById('donor-location').value;
    const lastDonation = document.getElementById('last-donation').value;
    
    if (!name || !bloodType || !phone || !location) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newDonor = {
        id: donors.length + 1,
        name: name,
        bloodType: bloodType,
        phone: phone,
        location: location,
        lastDonation: lastDonation || "Never",
        available: true
    };
    
    donors.push(newDonor);
    saveDonors();
    
    alert(`Thank you ${name}! You have been registered as a blood donor. You will receive notifications when your blood type is needed.`);
    
    // Clear form
    document.getElementById('donor-form').reset();
    
    return false;
}

function displayDonorRequests() {
    const donorRequestList = document.getElementById('donor-request-list');
    if (!donorRequestList) return;
    
    // Get donor's blood type (in a real app, this would come from login/session)
    const donorBloodType = document.getElementById('donor-blood-type-display') ? 
                          document.getElementById('donor-blood-type-display').value : 'O+';
    
    // Filter requests compatible with donor's blood type
    const compatibleRequests = requests.filter(request => {
        const compatibleTypes = getCompatibleBloodTypes(donorBloodType);
        return compatibleTypes.includes(request.bloodType) && request.status === 'Pending';
    });
    
    if (compatibleRequests.length === 0) {
        donorRequestList.innerHTML = '<div class="request-card"><p>No urgent requests matching your blood type at this time.</p></div>';
        return;
    }
    
    donorRequestList.innerHTML = '';
    
    compatibleRequests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        
        requestCard.innerHTML = `
            <div class="request-header">
                <div>
                    <h3 class="request-title">${request.hospital}</h3>
                    <span class="blood-type-badge">${request.bloodType}</span>
                    ${request.urgency === 'High' ? '<span class="urgent-badge">URGENT</span>' : ''}
                </div>
            </div>
            <div class="request-details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span><strong>Units Needed:</strong> ${request.units}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Location:</strong> ${request.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span><strong>Submitted:</strong> ${request.timestamp}</span>
                </div>
            </div>
            <div class="request-actions">
                <button class="btn btn-primary" onclick="respondToRequest(${request.id})">I Can Donate</button>
                <button class="btn btn-outline" onclick="viewHospitalDetails('${request.hospital}')">Hospital Details</button>
            </div>
        `;
        
        donorRequestList.appendChild(requestCard);
    });
}

function respondToRequest(requestId) {
    const request = requests.find(req => req.id === requestId);
    if (request) {
        alert(`Thank you for responding! Please contact ${request.hospital} at their emergency department. Let them know you're responding to blood request #${requestId} for ${request.bloodType} blood.`);
    }
}

function viewHospitalDetails(hospitalName) {
    const hospital = hospitals.find(h => h.name === hospitalName);
    if (hospital) {
        alert(`${hospital.name}\nCode: ${hospital.code}\nLocation: ${hospital.location}\n\nPlease bring valid ID when visiting.`);
    } else {
        alert(`${hospitalName}\n\nPlease contact the hospital directly for more information.`);
    }
}

function toggleAvailability() {
    // In a real app, this would update the logged-in donor's availability
    const availabilityBtn = document.getElementById('availability-toggle');
    if (availabilityBtn) {
        const isAvailable = availabilityBtn.textContent.includes('Available');
        
        if (isAvailable) {
            availabilityBtn.innerHTML = '<i class="fas fa-times-circle"></i> Currently Unavailable';
            availabilityBtn.classList.remove('btn-primary');
            availabilityBtn.classList.add('btn-secondary');
            alert('You have been marked as unavailable. You will not receive donation requests.');
        } else {
            availabilityBtn.innerHTML = '<i class="fas fa-check-circle"></i> Currently Available';
            availabilityBtn.classList.remove('btn-secondary');
            availabilityBtn.classList.add('btn-primary');
            alert('You are now available to receive donation requests.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Set up event listeners for hospital page
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRequest();
        });
        
        // Display existing requests
        displayRequests();
        
        // Add event listener for status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', displayRequests);
        }
    }
    
    // Set up event listeners for donor registration page
    const donorForm = document.getElementById('donor-form');
    if (donorForm) {
        donorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerDonor();
        });
    }
    
    // Display requests for donors
    displayDonorRequests();
    
    // Set up availability toggle
    const availabilityToggle = document.getElementById('availability-toggle');
    if (availabilityToggle) {
        availabilityToggle.addEventListener('click', toggleAvailability);
    }
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});