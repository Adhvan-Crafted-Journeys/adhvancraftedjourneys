(() => {
  "use strict";

  const DISPLAY_DELAY_MS = 5000;
  const WHATSAPP_NUMBER = "919597229511";

  function initPongalPopup() {
    const overlay = document.getElementById("adhvanPongalPopup");
    if (!overlay) return;

    // Keep the campaign on the homepage only.
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (!(path === "/" || path.toLowerCase() === "/index.html")) return;

    const dialog = overlay.querySelector('[role="dialog"]');
    const closeButton = overlay.querySelector(".adhvan-campaign__close");
    const whatsappLink = document.getElementById("adhvanPongalWhatsApp");
    if (!dialog || !closeButton || !whatsappLink) return;

    const message = [
      "Hello Adhvan Crafted Journeys!",
      "I am interested in your Tamil Nadu Pongal tour packages.",
      "Please share details, availability and pricing for:",
      "1. Tamil Nadu – A Timeless Journey (5 Nights / 6 Days, 11–16 January 2027)",
      "2. Enchanting Tamil Nadu (10 Nights / 11 Days, 10–20 January 2027)",
      "I am a domestic/international traveller."
    ].join("\n");
    whatsappLink.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    let previouslyFocused = null;
    let isOpen = false;

    function openPopup() {
      previouslyFocused = document.activeElement;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("adhvan-popup-open");
      isOpen = true;
      closeButton.focus();
    }

    function closePopup() {
      if (!isOpen) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("adhvan-popup-open");
      isOpen = false;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    }

    closeButton.addEventListener("click", closePopup);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopup();
    });

    document.addEventListener("keydown", (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        closePopup();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...dialog.querySelectorAll(
          'a[href]:not([tabindex="-1"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )].filter((el) => el.offsetParent !== null);
        if (!focusable.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.setTimeout(openPopup, DISPLAY_DELAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPongalPopup, { once: true });
  } else {
    initPongalPopup();
  }
})();
