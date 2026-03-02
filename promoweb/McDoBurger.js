const images = [
    "BigMac.png",
    "Doublecheeseburger.png",
    "McCrispyBurger.png",
    "McSpicyChickenFillet.png",
    "McHamCheeseBurger.png"
];

let currentIndex = 0;
const burgerImg = document.getElementById("burger-img");

burgerImg.addEventListener("click", () => {
    // fade out
    burgerImg.style.opacity = 0;

    setTimeout(() => {
        // change image
        currentIndex = (currentIndex + 1) % images.length;
        burgerImg.src = images[currentIndex];

        // fade in
        burgerImg.style.opacity = 1;
    }, 200); // match half of transition duration
});

// Animate on page load
window.addEventListener("load", () => {
    const elements = document.querySelectorAll(".animate");
    elements.forEach(el => el.classList.add("show"));
});

// Animate on scroll
window.addEventListener("scroll", () => {
    const elements = document.querySelectorAll("[class*='animate']");
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach(el => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add("show");
        }
    });
});

// STORY / ABOUT SLIDER
const slides = document.querySelectorAll('.story-slider .slide');
const dots = document.querySelectorAll('.dot');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');

let current = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        dots[i].classList.toggle('active', i === index);
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    });
});

const burgers = [
    {
        img: "Doublecheeseburger.png",
        name: "DoubleCheese Burger",
        desc: "A delicious burger featuring a savory ham patty, melted cheese, fresh lettuce, and tangy pickles, all nestled in a soft bun."
    },
    {
        img: "BigMac.png",
        name: "Big Mac",
        desc: "Two beef patties, special sauce, lettuce, cheese, pickles, and onions on a sesame seed bun."
    },
    {
        img: "McSpicyChickenFillet.png",
        name: "McSpicy Chicken Fillet",
        desc: "Crispy chicken fillet paired with mayonnaise and fresh lettuce for a crunchy satisfying bite."
    },
    {
        img: "McCrispyBurger.png",
        name: "McCrispy Burger",
        desc: "A crispy chicken patty topped with fresh lettuce and creamy mayonnaise, served in a soft bun."
    },
    {
        img: "McHamCheeseBurger.png",
        name: "McHam Cheese Burger",
        desc: "A delightful combination of a juicy ham patty, melted cheese, fresh lettuce, and tangy pickles, all nestled in a soft bun.",
    }
];

let index = 0;

function updateCarousel() {
    const left = (index - 1 + burgers.length) % burgers.length;
    const right = (index + 1) % burgers.length;

    document.getElementById("left-burger").src = burgers[left].img;
    document.getElementById("center-burger").src = burgers[index].img;
    document.getElementById("right-burger").src = burgers[right].img;

    document.getElementById("burger-name").textContent = burgers[index].name;
    document.getElementById("burger-desc").textContent = burgers[index].desc;

    // Add animation
    document.querySelector(".burger-group").classList.add("slide");
    setTimeout(() => {
        document.querySelector(".burger-group").classList.remove("slide");
    }, 500);
}

document.getElementById("next").onclick = () => {
    index = (index + 1) % burgers.length;
    updateCarousel();
};

document.getElementById("prev").onclick = () => {
    index = (index - 1 + burgers.length) % burgers.length;
    updateCarousel();
};

// Initial load
updateCarousel();

// NAVIGATION MENU
const menuBtn = document.getElementById("menu-btn");
const navOverlay = document.getElementById("nav-overlay");
const closeMenu = document.getElementById("close-menu");

menuBtn.addEventListener("click", () => {
    navOverlay.classList.add("show");
});

closeMenu.addEventListener("click", () => {
    navOverlay.classList.remove("show");
});

// When clicking "Home, Burgers, Story" in overlay — close menu + scroll
const navLinks = document.querySelectorAll(".overlay-links a");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // stop default jump

        const target = link.getAttribute("href"); // Gets the href attribute (#Home, #Burgers, #Story, etc.)

        navOverlay.classList.remove("show"); // close menu

        setTimeout(() => {
            document.querySelector(target).scrollIntoView({
                behavior: "smooth"
            });
        }, 200); // wait for animation before scrolling
    });
});