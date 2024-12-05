"use strict";

// Main initialization when document is ready
$(document).ready(function() {
    initializeSlideshow();
    initializeMenuTabs();
    loadDailySpecials();
    initializeReservationSystem();
    initializePreferences();
    loadUserPreferences();
});

// Slideshow Implementation
function initializeSlideshow() {
    const slides = [
        { image: "/api/placeholder/1280/500", caption: "Welcome to Zaitoun" },
        { image: "/api/placeholder/1280/500", caption: "Authentic Palestinian Cuisine" },
        { image: "/api/placeholder/1280/500", caption: "Traditional Family Recipes" }
    ];

    const slideshow = $(".slideshow-container");
    slideshow.empty();

    slides.forEach((slide, index) => {
        const slideDiv = $("<div>", {
            class: "slide",
            css: { display: index === 0 ? "block" : "none" }
        });

        $("<img>", {
            src: slide.image,
            alt: slide.caption
        }).appendTo(slideDiv);

        $("<div>", {
            class: "slide-caption",
            text: slide.caption
        }).appendTo(slideDiv);

        slideshow.append(slideDiv);
    });

    // Slideshow animation
    let currentSlide = 0;
    setInterval(() => {
        $(".slide").fadeOut(1000);
        currentSlide = (currentSlide + 1) % slides.length;
        $(".slide").eq(currentSlide).fadeIn(1000);
    }, 5000);
}

// Menu Tabs Implementation
function initializeMenuTabs() {
    const menuCategories = [
        {
            name: "Appetizers",
            items: [
                { name: "Hummus", price: "8", description: "Creamy chickpea dip with olive oil and pine nuts" },
                { name: "Mutabal", price: "9", description: "Smoky eggplant dip with tahini and olive oil" },
                { name: "Falafel", price: "8", description: "Crispy chickpea fritters with tahini sauce" }
            ]
        },
        {
            name: "Main Courses",
            items: [
                { name: "Musakhan", price: "28", description: "Roasted chicken with sumac and caramelized onions" },
                { name: "Maqluba", price: "32", description: "Upside-down rice with lamb and vegetables" },
                { name: "Mansaf", price: "34", description: "Traditional lamb dish with aged yogurt sauce" }
            ]
        },
        {
            name: "From Our Taboon",
            items: [
                { name: "Za'atar Manakish", price: "6", description: "Fresh bread with za'atar and olive oil" },
                { name: "Lahm Bi Ajeen", price: "12", description: "Meat flatbread with pine nuts" },
                { name: "Muhamara Fatayer", price: "10", description: "Spiced walnut and pepper pastries" }
            ]
        },
        {
            name: "Desserts",
            items: [
                { name: "Knafeh", price: "12", description: "Sweet cheese pastry with orange blossom syrup" },
                { name: "Qatayef", price: "10", description: "Sweet stuffed pancakes with nuts" },
                { name: "Baklawa", price: "8", description: "Layered phyllo with nuts and honey syrup" }
            ]
        }
    ];

    // Create tabs structure
    const tabsList = $("<ul>");
    const tabPanels = $("<div>");

    menuCategories.forEach((category, index) => {
        // Add tab
        const tabLi = $("<li>");
        const tabLink = $("<a>")
            .attr("href", `#menu-${index}`)
            .text(category.name);
        tabLi.append(tabLink);
        tabsList.append(tabLi);

        // Add panel
        const panel = $("<div>")
            .attr("id", `menu-${index}`);
        
        const menuItems = category.items.map(item => `
            <div class="menu-item">
                <h3>${item.name} - $${item.price}</h3>
                <p>${item.description}</p>
            </div>
        `).join("");

        panel.html(menuItems);
        tabPanels.append(panel);
    });

    $("#menu-tabs")
        .append(tabsList)
        .append(tabPanels)
        .tabs();
}

// Rest of the JavaScript functions remain the same (loadDailySpecials, initializeReservationSystem, etc.)
// Only changing the variable names and messages to match our Palestinian restaurant theme

function loadDailySpecials() {
    $.ajax({
        url: "data/specials.json",
        method: "GET",
        success: function(data) {
            const specialsContainer = $(".specials-container");
            specialsContainer.empty();

            data.specials.forEach(special => {
                const specialCard = $(`
                    <div class="special-card">
                        <img src="${special.image}" alt="${special.name}">
                        <h3>${special.name}</h3>
                        <p>${special.description}</p>
                        <p class="price">$${special.price.toFixed(2)}</p>
                        ${special.dietary.length ? `
                            <div class="dietary-tags">
                                ${special.dietary.map(tag => `<span class="dietary-tag">${tag}</span>`).join("")}
                            </div>
                        ` : ""}
                    </div>
                `);
                specialsContainer.append(specialCard);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error loading specials:", error);
            $(".specials-container").html("<p>Unable to load daily specials. Please check back later.</p>");
        }
    });
}

// The remaining functions (initializeReservationSystem, initializePreferences, loadUserPreferences) 
// stay the same as they handle generic functionality