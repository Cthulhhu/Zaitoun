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
    $.ajax({
        url: 'data/menu.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateMenuSection('appetizers', data.appetizers);
            populateMenuSection('main-courses', data.mainCourses);
            populateMenuSection('desserts', data.desserts);
            // Specials are now loaded on button click
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
    section.empty(); // Clear existing content
    
    // Create wrapper for grid layout
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
        handleReservation();
    });

    // Order button handling
    $(document).on('click', '.order-button', function() {
        const itemName = $(this).data('item');
        handleOrder(itemName);
    });
    $('#load-specials').one('click', function() {
        const button = $(this);
        const loadingSpinner = $('.loading-spinner');
        const specialItems = $('.special-items');

        // Disable button and show loading state
        button.prop('disabled', true);
        button.text('Loading...');
        loadingSpinner.show();
        
        $.ajax({
            url: 'data/menu.json',
            method: 'GET',
            success: function(data) {
                // Hide loading UI
                loadingSpinner.hide();
                button.fadeOut();
                
                // Populate and show specials
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
}

// Reservation Handling
function handleReservation() {
    const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        date: $('#date').val(),
        time: $('#time').val(),
        guests: $('#guests').val(),
        specialRequests: $('#special-requests').val(),
        timestamp: new Date().toISOString()
    };

    // Store reservation in localStorage
    try {
        let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        reservations.push(formData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        showSuccessMessage('Reservation successful! We will contact you shortly to confirm.');
        $('#reservation-form')[0].reset();
    } catch (error) {
        console.error('Error saving reservation:', error);
        showErrorMessage('reservation-form', 'Unable to save your reservation. Please try again.');
    }
}

// Order Handling
function handleOrder(itemName) {
    // Get existing orders from storage
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Add new order
    orders.push({
        item: itemName,
        timestamp: new Date().toISOString()
    });

    // Save back to storage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    showSuccessMessage(`"${itemName}" has been added to your order!`);
}

// Utility Functions
function showSuccessMessage(message) {
    // Create a custom success message element
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

    // Add to body
    $('body').append(successMessage);

    // Animate in
    successMessage.animate({
        opacity: 1,
        transform: 'translateY(0)'
    }, 300);

    // Remove after delay
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
        .text(message)
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