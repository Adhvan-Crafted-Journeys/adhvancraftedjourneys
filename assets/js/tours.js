
/* ==========================================
   ADHVAN CRAFTED JOURNEYS
   Dynamic Tour Carousel
========================================== */

const tours = [
    {
        id: "hornbill-festival",
        name: "Hornbill Festival",
        image: "assets/images/tours/hornbill-festival.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "kazakhstan",
        name: "Kazakhstan",
        image: "assets/images/tours/Kazakhstan.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "leh-ladakh",
        name: "Leh Ladakh",
        image: "assets/images/tours/leh-ladakh.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "usa",
        name: "USA",
        image: "assets/images/tours/usa.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "north-east-india",
        name: "North East India",
        image: "assets/images/tours/north-east-india.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "japan",
        name: "Japan",
        image: "assets/images/tours/japan.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "paris",
        name: "Paris",
        image: "assets/images/tours/paris.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "vietnam",
        name: "Vietnam",
        image: "assets/images/tours/vietnam.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "australia",
        name: "Australia",
        image: "assets/images/tours/australia.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "dubai",
        name: "Dubai",
        image: "assets/images/tours/dubai.webp",
        itinerary: "dubai-itinerary-modal",
        visible: true
    },
    {
        id: "singapore",
        name: "Singapore",
        image: "assets/images/tours/singapore.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "maldives",
        name: "Maldives",
        image: "assets/images/tours/maldives.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "northern-lights",
        name: "Northern Lights",
        image: "assets/images/tours/northen-lights.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "rann-of-kutch",
        name: "Rann of Kutch",
        image: "assets/images/tours/rann-of-kutch.webp",
        itinerary: null,
        visible: true
    },
    {
        id: "swiss-paris",
        name: "Switzerland and Paris",
        image: "assets/images/tours/swiss-paris.webp",
        itinerary: null,
        visible: true
    }
];

/* Generate tour slides */

/* =========================================
   ADHVAN — DYNAMIC TOUR PACKAGE CAROUSEL
========================================= */

function renderTours() {    
    const wrapper = document.getElementById("tour-slides");
    if (!wrapper) return;

    const visibleTours = tours.filter(tour => tour.visible);

    wrapper.innerHTML = visibleTours.map(tour => {
        const action = tour.itinerary
            ? `<button
                    class="journey-poster__button"
                    type="button"
                    data-itinerary-open
                    aria-haspopup="dialog"
                    aria-controls="${tour.itinerary}">
                    <span>View Itinerary</span>
                    <span aria-hidden="true">↗</span>
               </button>`
            : `<a
                    class="journey-poster__button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://wa.me/919597229511?text=${encodeURIComponent(
                `Hello Adhvan, I would like the ${tour.name} tour itinerary.`
            )}">
                    <span>View Itinerary</span>
                    <span aria-hidden="true">↗</span>
               </a>`;

        return `
            <div class="swiper-slide" data-tour-id="${tour.id}">
                <article class="journey-poster">
                    <div class="journey-poster__image">
                        <img
                            src="${tour.image}"
                            alt="${tour.name} tour package poster"
                            loading="lazy"
                            decoding="async">
                    </div>
                    <div class="journey-poster__footer">
                        ${action}
                    </div>
                </article>
            </div>`;
    }).join("");

    const total = document.getElementById("journey-total");
    if (total) total.textContent = String(visibleTours.length).padStart(2, "0");
}

function initTourSwiper() {
    const element = document.querySelector(".journeySwiper");
    if (!element || typeof Swiper === "undefined") return;

    if (element.swiper) element.swiper.destroy(true, true);

    const current = document.getElementById("journey-current");
    const total = document.getElementById("journey-total");

    const swiper = new Swiper(element, {
        slidesPerView: 1.15,
        slidesPerGroup: 1,
        centeredSlides: true,
        spaceBetween: 14,
        loop: false,
        rewind: false,
        autoplay: false,
        speed: 450,
        grabCursor: true,
        watchOverflow: true,

        navigation: {
            nextEl: ".journey-next",
            prevEl: ".journey-prev",
        },

        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 28,
            },
        },

        on: {
            init: updateCounter,
            slideChange: updateCounter,
        },
    });

    function updateCounter() {
        if (current) {
            current.textContent = String(this.activeIndex + 1).padStart(2, "0");
        }
        if (total) {
            total.textContent = String(this.slides.length).padStart(2, "0");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderTours();
    initTourSwiper();
});
