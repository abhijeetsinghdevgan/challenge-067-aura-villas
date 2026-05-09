document.addEventListener('DOMContentLoaded', () => {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const roomTypeSelect = document.getElementById('roomType');
    const airportTransferCheckbox = document.getElementById('airportTransfer');
    const spaPackageCheckbox = document.getElementById('spaPackage');
    
    const nightsCountSpan = document.getElementById('nightsCount');
    const roomSubtotalSpan = document.getElementById('roomSubtotal');
    const extrasTotalSpan = document.getElementById('extrasTotal');
    const totalPriceSpan = document.getElementById('totalPrice');
    const submitBtn = document.getElementById('submitBtn');
    const bookingForm = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');

    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    // Handle Check-in date change
    checkInInput.addEventListener('change', () => {
        // Check-out must be at least 1 day after check-in
        const checkInDate = new Date(checkInInput.value);
        if(!isNaN(checkInDate.getTime())) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
            
            // If checkout is before new checkin, reset it
            if(checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                checkOutInput.value = '';
            }
        }
        calculateTotal();
    });

    // Event listeners for inputs that affect price
    checkOutInput.addEventListener('change', calculateTotal);
    roomTypeSelect.addEventListener('change', calculateTotal);
    airportTransferCheckbox.addEventListener('change', calculateTotal);
    spaPackageCheckbox.addEventListener('change', calculateTotal);

    function calculateTotal() {
        if (!checkInInput.value || !checkOutInput.value) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Select Dates to Calculate';
            resetSummary();
            return;
        }

        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        // Calculate nights
        const diffTime = Math.abs(checkOut - checkIn);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Invalid Dates';
            resetSummary();
            return;
        }

        // Get room price per night
        const selectedRoom = roomTypeSelect.options[roomTypeSelect.selectedIndex];
        const pricePerNight = parseInt(selectedRoom.dataset.price);

        // Calculate subtotals
        const roomSubtotal = nights * pricePerNight;
        
        let extrasTotal = 0;
        if (airportTransferCheckbox.checked) extrasTotal += parseInt(airportTransferCheckbox.value);
        if (spaPackageCheckbox.checked) extrasTotal += parseInt(spaPackageCheckbox.value);

        const total = roomSubtotal + extrasTotal;

        // Update UI
        nightsCountSpan.textContent = nights;
        roomSubtotalSpan.textContent = `$${roomSubtotal.toLocaleString()}`;
        extrasTotalSpan.textContent = `$${extrasTotal.toLocaleString()}`;
        totalPriceSpan.textContent = `$${total.toLocaleString()}`;

        // Enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Reservation';
    }

    function resetSummary() {
        nightsCountSpan.textContent = '0';
        roomSubtotalSpan.textContent = '$0';
        extrasTotalSpan.textContent = '$0';
        totalPriceSpan.textContent = '$0';
    }

    // Handle Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real app, we would send this data to a server
        // Show success modal
        modal.classList.add('active');
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 13, 20, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(10, 13, 20, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
});

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = 'Select Dates to Calculate';
    document.getElementById('nightsCount').textContent = '0';
    document.getElementById('roomSubtotal').textContent = '$0';
    document.getElementById('extrasTotal').textContent = '$0';
    document.getElementById('totalPrice').textContent = '$0';
}
