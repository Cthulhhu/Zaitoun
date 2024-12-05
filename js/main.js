"use strict";

$(document).ready(function() {
    // Initialize jQuery UI Tabs
    $("#menu-tabs").tabs();

    // Initialize Slick Slider
    $('.gallery-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
        nextArrow: '<button type="button" class="slick-next">Next</button>'
    });

    // Load menu items
    loadMenuItems();

    // Initialize theme preference
    initializeThemePreference();

    // Theme toggle functionality
    $('#theme-button').click(function() {
        toggleTheme();
    });

    // Reservation form handling
    $('#reservation-form').submit(function(e) {
        e.preventDefault();
        handleReservation();
    });

    // Smooth scrolling for navigation
    $('nav a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    });

    // Initialize gallery images
    initializeGallery();
});

// Function to load menu items
function loadMenuItems() {
    $.getJSON('data/specials.json', function(data) {
        populateMenuSection('appetizers', data.appetizers);
        populateMenuSection('main-courses', data.mainCourses);
        populateMenuSection('desserts', data.desserts);
    });
}

function populateMenuSection(sectionId, items) {
    const section = $(`#${sectionId}`);
    let html = '';
    
    items.forEach(item => {
        html += `
            <div class="menu-item">
                <img src="images/${item.image}" alt="${item.name}">
                <div class="menu-item-details">
                    <h3>${item.name}</h3>
                    <p class="arabic-name">${item.arabicName}</p>
                    <p class="description">${item.description}</p>
                    <span class="price">$${item.price.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    section.html(html);
}

// Function to initialize gallery
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
        slider.append(`<div><img src="images/${image}" alt="Gallery Image"></div>`);
    });
}

// Theme functionality
function initializeThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        $('body').addClass('dark-theme');
    } else {
        $('body').removeClass('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

// Reservation handling
function handleReservation() {
    const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        date: $('#date').val(),
        time: $('#time').val(),
        guests: $('#guests').val(),
        specialRequests: $('#special-requests').val()
    };

    // Store reservation in localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push(formData);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Show confirmation
    alert('Thank you for your reservation! We will contact you shortly to confirm.');
    $('#reservation-form')[0].reset();
}