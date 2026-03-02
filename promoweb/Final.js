/* =========================
    NAV PANEL
========================= */
const menuBtn = document.getElementById("menu-btn");
const navOverlay = document.getElementById("nav-overlay");
const closeMenuBtn = document.getElementById("close-menu");
const navLinks = document.querySelectorAll(".overlay-links a");

menuBtn?.addEventListener("click", () => {
    navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
});

function closeNav() {
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

closeMenuBtn?.addEventListener("click", closeNav);
navLinks.forEach(link => link.addEventListener("click", closeNav));

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeNav();
});

/* =========================
    ABOUT / STORY FIX
========================= */

const about = document.querySelector(".about");
const story = document.querySelector(".story");
const values = document.querySelector(".values");

const aboutContent = about.querySelector(".content");
const storyContent = story.querySelector(".content");
const valuesContent = values.querySelector(".content");

/* Initial state (important) */
about.classList.add("active");
aboutContent.classList.add("show");

function showStory() {
    about.classList.remove("active");
    aboutContent.classList.remove("show");
    values.classList.remove("active");
    valuesContent.classList.remove("show");

    story.classList.add("active");
    storyContent.classList.add("show");
}

function showAbout() {
    story.classList.remove("active");
    storyContent.classList.remove("show");
    values.classList.remove("active");
    valuesContent.classList.remove("show");

    about.classList.add("active");
    aboutContent.classList.add("show");
}

function showValues() {
    about.classList.remove("active");
    aboutContent.classList.remove("show");
    story.classList.remove("active");
    storyContent.classList.remove("show");

    values.classList.add("active");
    valuesContent.classList.add("show");
}

/* Auto-scroll between About, Story, and Values every 10 seconds */
let currentSlide = 0;
setInterval(() => {
    currentSlide = (currentSlide + 1) % 3;
    if (currentSlide === 0) {
        showAbout();
    } else if (currentSlide === 1) {
        showStory();
    } else {
        showValues();
    }
}, 10000);


/* =========================
    BURGER DATA (MASTER SOURCE)
========================= */
const burgerImages = [
    {
        src: "McCrispyBurger.png",
        name: "McCrispy Burger",
        subtitle: "CLASSIC FAVORITE",
        desc: "Crispy chicken, fresh lettuce & signature sauce.",
        ingredients: ["Crispy Chicken", "Lettuce", "Signature Sauce", "Sesame Bun"]
    },
    {
        src: "BigMac.png",
        name: "Big Mac",
        subtitle: "WORLD FAMOUS",
        desc: "Two beef patties, special sauce, lettuce & cheese.",
        ingredients: ["Beef Patties", "Special Sauce", "Cheese"]
    },
    {
        src: "Quarterpound.png",
        name: "Quarter Pounder",
        subtitle: "BEEF CLASSIC",
        desc: "Juicy beef patty with cheese and onions.",
        ingredients: ["Beef Patty", "Cheese"    , "Onions", "Pickles"]
    },  
    {
        src: "McHamCheeseBurger.png",
        name: "McHamCheese Burger",
        subtitle: "SIMPLE & TASTY",
        desc: "Classic cheeseburger with ketchup and mustard.",
        ingredients: ["Beef Patty", "Cheese", "Ketchup", "Mustard"]
    },
    {
        src: "McSpicyChickenFillet.png",
        name: "McSpicy ChikenFillet",
        subtitle: "CRISPY CHICKEN",
        desc: "Crispy chicken with mayo and lettuce.",
        ingredients: ["Chicken Patty", "Lettuce", "Mayonnaise"]
    },
    {
        src: "filet1.png",
        name: "Filet-O-Fish",
        subtitle: "SEAFOOD FAVORITE",
        desc: "Fish fillet with tartar sauce and cheese.",
        ingredients: ["Fish Fillet", "Tartar Sauce", "Cheese"]
    }
];

let currentBurger = 0;


/* =========================
    HERO ELEMENTS
========================= */
const mainBurger = document.querySelector(".burger.main");
const bgBurger = document.querySelector(".burger.background");
const heroTitle = document.querySelector(".hero-right h1");
const heroSubtitle = document.querySelector(".hero-right h4");
const heroDesc = document.querySelector(".hero-right p");

function updateHero(index) {
    const burger = burgerImages[index];
    if (!burger) return;

    mainBurger.src = burger.src;
    bgBurger.src = burger.src;
    heroTitle.textContent = burger.name;
    heroSubtitle.textContent = burger.subtitle;
    heroDesc.textContent = burger.desc;
}


/* =========================
    HERO ARROWS
========================= */
document.querySelector(".arrow.right")?.addEventListener("click", () => {
    currentBurger = (currentBurger + 1) % burgerImages.length;
    updateHero(currentBurger);
});

document.querySelector(".arrow.left")?.addEventListener("click", () => {
    currentBurger =
        (currentBurger - 1 + burgerImages.length) % burgerImages.length;
    updateHero(currentBurger);
});


/* =========================
    FULL MENU LOGIC
========================= */
const fullMenu = document.getElementById("full-menu");
const fullMenuBtn = document.getElementById("fullMenuBtn");
const backHeroBtn = document.getElementById("backHero");
const menuCards = document.querySelectorAll(".menu-card");

fullMenuBtn.addEventListener("click", () => {
    fullMenu.classList.add("active");
    document.body.style.overflow = "hidden";
});

function closeFullMenu() {
    fullMenu.classList.remove("active");
    document.body.style.overflow = "";
}

backHeroBtn.addEventListener("click", closeFullMenu);

menuCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        currentBurger = index;
        updateHero(index);
        closeFullMenu();
    });
});


/* =========================
    INGREDIENTS MODAL
========================= */
const modal = document.getElementById("ingredients-modal");
const ingredientsList = document.getElementById("ingredients-list");
const ingredientsTitle = document.getElementById("ingredients-title");
const ingredientsBtn = document.getElementById("ingredientsBtn");
const closeIngredients = document.querySelector(".close-ingredients");

ingredientsBtn.addEventListener("click", () => {
    const burger = burgerImages[currentBurger];
    ingredientsTitle.textContent = burger.name;
    ingredientsList.innerHTML = "";

    burger.ingredients.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ingredientsList.appendChild(li);
    });

    modal.classList.add("active");
    });

    closeIngredients.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Animate sections on scroll
const scrollElements = document.querySelectorAll('.welcome, .hero-right, .hero-left, .menu-card');

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2 // Trigger when 20% visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, observerOptions);

scrollElements.forEach(el => observer.observe(el));



/* =========================
    INIT
========================= */
updateHero(currentBurger);

