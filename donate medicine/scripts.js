document.addEventListener('DOMContentLoaded', () => {
    const donateForm = document.getElementById('donate-form');
    const donationList = document.getElementById('donation-list');
    const searchInput = document.getElementById('search');
   
    if (donateForm) {
        donateForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const reader = new FileReader();
           
            reader.onload = function(e) {
                const donation = {
                    medName: formData.get('medName'),
                    quantity: formData.get('quantity'),
                    expiration: formData.get('expiration'),
                    image: e.target.result,
                    contact: formData.get('contact'),
                };

                // Save donation to local storage
                saveDonation(donation);

                // Clear the form
                donateForm.reset();

                // Redirect to view page
                window.location.href = 'view.html';
            };

            const imageFile = formData.get('image');
            if (imageFile) {
                reader.readAsDataURL(imageFile);
            }
        });
    } else if (donationList) {
        // Load existing donations from local storage
        loadDonations();

        // Add search functionality
        searchInput.addEventListener('input', function() {
            filterDonations(this.value);
        });
    }

    function saveDonation(donation) {
        let donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.push(donation);
        localStorage.setItem('donations', JSON.stringify(donations));
    }

    function loadDonations() {
        donationList.innerHTML = ''; // Clear the list first
        let donations = JSON.parse(localStorage.getItem('donations')) || [];
       
        // Remove expired donations
        const today = new Date().toISOString().split('T')[0];
        donations = donations.filter(donation => donation.expiration >= today);
       
        // Save filtered donations back to local storage
        localStorage.setItem('donations', JSON.stringify(donations));
       
        // Display donations
        donations.forEach(donation => {
            const div = document.createElement('div');
            div.classList.add('donation-item');
            div.innerHTML = `
                <h3>${donation.medName}</h3>
                <p>Quantity: ${donation.quantity}</p>
                <p>Expiration Date: ${donation.expiration}</p>
                <img src="${donation.image}" alt="Medicine Image">
                <p class="contact-info">Contact: ${donation.contact}</p>
            `;
            donationList.appendChild(div);
        });
    }

    function filterDonations(searchTerm) {
        const items = document.querySelectorAll('.donation-item');
        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm.toLowerCase()) ? 'block' : 'none';
        });
    }
});