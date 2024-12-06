"use strict";

$(document).ready(function() {
    // Initialize all core functionality
    initializeTheme();
    initializeMenuTabs();
    initializeGallery();
    loadMenuItems();
    initializeEventListeners();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    $('#theme-button').click(function() {
        const currentTheme = $('body').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function applyTheme(theme) {
    // Add transition class
    $('body').addClass('theme-transition');
    
    // Apply theme
    $('body').attr('data-theme', theme);
    const buttonText = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    $('.theme-text').text(buttonText);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        $('body').removeClass('theme-transition');
    }, 300);
}

// Menu Functionality
function initializeMenuTabs() {
    $("#menu-tabs").tabs({
        show: { effect: "fade", duration: 400 },
        hide: { effect: "fade", duration: 400 }
    });
}

// Load Menu Items from JSON
function loadMenuItems() {
    $('.menu-section').append('<div class="loading">Loading...</div>');
    
    $.ajax({
        url: 'data/menu.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $('.loading').remove();
            populateMenuSection('appetizers', data.appetizers);
            populateMenuSection('main-courses', data.mainCourses);
            populateMenuSection('desserts', data.desserts);
        },
        error: function(xhr, status, error) {
            console.error('Error loading menu items:', error);
            showErrorMessage('menu-tabs', 'Unable to load menu items. Please try again later.');
        }
    });
}

function populateSpecials(specials) {
    const specialsContainer = $('.special-items');
    specialsContainer.empty();

    specials.forEach(special => {
        const tags = special.tags ? special.tags.map(tag => `
            <span class="menu-tag">
                ${tag}
            </span>
        `).join('') : '';

        const specialItem = `
            <div class="special-item">
                <div class="menu-item-image">
                    <img src="images/${special.image}" 
                         alt="${special.name}"
                         loading="lazy">
                    <span class="special-badge">Special</span>
                </div>
                <div class="menu-item-details">
                    <h3>${special.name}</h3>
                    <p class="arabic-name">${special.arabicName}</p>
                    <div class="menu-tags">
                        ${tags}
                    </div>
                    <p class="description">${special.description}</p>
                    <span class="price">$${special.price.toFixed(2)}</span>
                    <button class="order-button" data-item="${special.name}">Order now</button>
                </div>
            </div>
        `;
        
        specialsContainer.append(specialItem);
    });
}

function populateMenuSection(sectionId, items) {
    const section = $(`#${sectionId}`);
    section.empty();
    
    const wrapper = $('<div class="menu-section"></div>');
    
    items.forEach(item => {
        const tags = item.tags ? item.tags.map(tag => `
            <span class="menu-tag">
                ${tag}
            </span>
        `).join('') : '';

        const menuItem = `
            <div class="menu-item">
                <div class="menu-item-image">
                    <img src="images/${item.image}" 
                         alt="${item.name}"
                         loading="lazy">
                </div>
                <div class="menu-item-details">
                    <h3>${item.name}</h3>
                    <p class="arabic-name">${item.arabicName}</p>
                    <div class="menu-tags">
                        ${tags}
                    </div>
                    <p class="description">${item.description}</p>
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="order-button" data-item="${item.name}">Order now</button>
                </div>
            </div>
        `;
        
        wrapper.append(menuItem);
    });
    
    section.append(wrapper);
}

// Gallery Functionality
function initializeGallery() {
    const galleryImages = [
        'gallery-1.jpg',
        'gallery-2.jpg',
        'gallery-3.jpg',
        'gallery-4.jpg',
        'gallery-5.jpg'
    ];

    const slider = $('.gallery-slider');
    
    galleryImages.forEach(image => {
        slider.append(`<div><img src="images/${image}" alt="Gallery Image" loading="lazy"></div>`);
    });

    slider.slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
        nextArrow: '<button type="button" class="slick-next">Next</button>'
    });
}

// Form Validation
function validateForm() {
    let isValid = true;
    const errors = [];

    // Name validation
    const name = $('#name').val().trim();
    if (name.length < 2) {
        isValid = false;
        errors.push('Name must be at least 2 characters long');
        $('#name').addClass('error-input');
    } else {
        $('#name').removeClass('error-input');
    }

    // Email validation
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        errors.push('Please enter a valid email address');
        $('#email').addClass('error-input');
    } else {
        $('#email').removeClass('error-input');
    }

    // Phone validation
    const phone = $('#phone').val().trim();
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
        isValid = false;
        errors.push('Please enter a valid phone number');
        $('#phone').addClass('error-input');
    } else {
        $('#phone').removeClass('error-input');
    }

    // Date validation
    const selectedDate = new Date($('#date').val());
    const today = new Date();
    if (selectedDate < today) {
        isValid = false;
        errors.push('Please select a future date');
        $('#date').addClass('error-input');
    } else {
        $('#date').removeClass('error-input');
    }

    // Guests validation
    const guests = parseInt($('#guests').val());
    if (isNaN(guests) || guests < 1 || guests > 10) {
        isValid = false;
        errors.push('Number of guests must be between 1 and 10');
        $('#guests').addClass('error-input');
    } else {
        $('#guests').removeClass('error-input');
    }

    // Display errors if any
    if (!isValid) {
        showErrorMessage('reservation-form', errors.join('<br>'));
    }

    return isValid;
}

// Event Listeners
function initializeEventListeners() {
    // Smooth scrolling for navigation
    $('nav a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    });

    // Reservation form handling
    $('#reservation-form').submit(function(e) {
        e.preventDefault();
        if (validateForm()) {
            handleReservation();
        }
    });

    // Order button handling
    $(document).on('click', '.order-button', function() {
        const itemName = $(this).data('item');
        handleOrder(itemName);
    });

    // Load specials button handling
    $('#load-specials').one('click', function() {
        const button = $(this);
        const loadingSpinner = $('.loading-spinner');
        const specialItems = $('.special-items');

        button.prop('disabled', true);
        button.text('Loading...');
        loadingSpinner.show();
        
        $.ajax({
            url: 'data/menu.json',
            method: 'GET',
            success: function(data) {
                loadingSpinner.hide();
                button.fadeOut();
                populateSpecials(data.specials);
                specialItems.addClass('loaded');
            },
            error: function(xhr, status, error) {
                console.error('Error loading specials:', error);
                loadingSpinner.hide();
                button.prop('disabled', false).text('Try Again');
                showErrorMessage('specials', 'Unable to load specials. Please try again.');
            }
        });
    });

    // Add view orders button
    addViewOrdersButton();
    // Add past reservations button
    addPastReservationsButton();
}

// Reservation Handling
function handleReservation() {
    const formData = {
        name: $('#name').val().trim(),
        email: $('#email').val().trim(),
        phone: $('#phone').val().trim(),
        date: $('#date').val(),
        time: $('#time').val(),
        guests: $('#guests').val(),
        specialRequests: $('#special-requests').val().trim(),
        timestamp: new Date().toISOString()
    };

    try {
        let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        reservations.push(formData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        showSuccessMessage('Reservation successful! We will contact you shortly to confirm.');
        $('#reservation-form')[0].reset();
        $('.error-input').removeClass('error-input');
    } catch (error) {
        console.error('Error saving reservation:', error);
        showErrorMessage('reservation-form', 'Unable to save your reservation. Please try again.');
    }
}

// Order Handling
function handleOrder(itemName) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    orders.push({
        item: itemName,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    showSuccessMessage(`"${itemName}" has been added to your order!`);
}

// Add View Orders Button
function addViewOrdersButton() {
    const button = $('<button>')
        .addClass('view-orders-btn')
        .text('View Order History')
        .insertAfter('#menu-tabs');

    button.on('click', displayOrderHistory);
}

// Order History Display
function displayOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const modal = $('<div>').addClass('modal');
    const modalContent = $('<div>').addClass('modal-content');
    const closeBtn = $('<span>').addClass('close-modal').html('&times;');
    
    modalContent.append(closeBtn);
    modalContent.append('<h3>Order History</h3>');

    if (orders.length === 0) {
        modalContent.append('<p>No order history found.</p>');
    } else {
        const ordersList = $('<div>').addClass('orders-list');
        
        orders.reverse().forEach(order => {
            const date = new Date(order.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const orderCard = $(`
                <div class="order-card">
                    <h4>${order.item}</h4>
                    <p><strong>Ordered:</strong> ${formattedDate}</p>
                </div>
            `);
            
            ordersList.append(orderCard);
        });
        
        modalContent.append(ordersList);
    }

    modal.append(modalContent);
    $('body').append(modal);

    setTimeout(() => modal.addClass('show'), 10);

    closeBtn.on('click', () => {
        modal.removeClass('show');
        setTimeout(() => modal.remove(), 300);
    });

    modal.on('click', function(e) {
        if (e.target === this) {
            modal.removeClass('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Past Reservations 
function addPastReservationsButton() {
    const button = $('<button>')
        .addClass('view-reservations-btn')
        .text('View Past Reservations')
        .insertAfter('#reservation-form');

    button.on('click', displayPastReservations);
}

function displayPastReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    const modal = $('<div>').addClass('modal');
    const modalContent = $('<div>').addClass('modal-content');
    const closeBtn = $('<span>').addClass('close-modal').html('&times;');
    
    modalContent.append(closeBtn);
    modalContent.append('<h3>Past Reservations</h3>');

    if (reservations.length === 0) {
        modalContent.append('<p>No past reservations found.</p>');
    } else {
        const reservationsList = $('<div>').addClass('reservations-list');
        
        reservations.reverse().forEach(reservation => {
            const date = new Date(reservation.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const reservationCard = $(`
                <div class="reservation-card">
                    <h4>${reservation.name}</h4>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${reservation.time}</p>
                    <p><strong>Guests:</strong> ${reservation.guests}</p>
                    ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
                </div>
            `);
            
            reservationsList.append(reservationCard);
        });
        
        modalContent.append(reservationsList);
    }

    modal.append(modalContent);
    $('body').append(modal);

    setTimeout(() => modal.addClass('show'), 10);

    closeBtn.on('click', () => {
        modal.removeClass('show');
        setTimeout(() => modal.remove(), 300);
    });

    modal.on('click', function(e) {
        if (e.target === this) {
            modal.removeClass('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
    }
    
    // Utility Functions
    function showSuccessMessage(message) {
        const successMessage = $('<div>')
            .addClass('success-message')
            .text(message)
            .css({
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'var(--palestinian-green)',
                color: 'white',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                zIndex: 9999,
                opacity: 0,
                transform: 'translateY(-20px)'
            });
    
        $('body').append(successMessage);
    
        successMessage.animate({
            opacity: 1,
            transform: 'translateY(0)'
        }, 300);
    
        setTimeout(() => {
            successMessage.animate({
                opacity: 0,
                transform: 'translateY(-20px)'
            }, 300, function() {
                $(this).remove();
            });
        }, 3000);
    }
    
    function showErrorMessage(elementId, message) {
        const errorDiv = $('<div>')
            .addClass('error-message')
            .html(message)
            .css({
                background: 'var(--palestinian-red)',
                color: 'white',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem'
            });
    
        $(`#${elementId}`).prepend(errorDiv);
    
        setTimeout(() => {
            errorDiv.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }