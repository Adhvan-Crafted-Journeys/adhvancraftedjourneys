(() => {
  "use strict";

  const DISPLAY_DELAY_MS = 5000;
  const POPUP_SHOWN_KEY = "adhvanPongalPopupShown";

  function initPongalPopup() {
    const overlay = document.getElementById("adhvanPongalPopup");
    if (!overlay) return;

    // Keep the campaign on the homepage only.
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (!(path === "/" || path.toLowerCase() === "/index.html")) return;

    const dialog = overlay.querySelector('[role="dialog"]');
    const closeButton = overlay.querySelector(".adhvan-campaign__close");
    if (!dialog || !closeButton) {
      console.error("The Pongal campaign popup is missing required elements.");
      return;
    }

    try {
      if (window.sessionStorage.getItem(POPUP_SHOWN_KEY) === "true") return;
    } catch (error) {
      console.warn("Pongal popup frequency control is unavailable.", error);
    }

    let previouslyFocused = null;
    let isOpen = false;

    function openPopup() {
      try {
        window.sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
      } catch (error) {
        console.warn("Pongal popup frequency control is unavailable.", error);
      }

      previouslyFocused = document.activeElement;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("adhvan-popup-open");
      isOpen = true;
      window.setTimeout(function () {
        if (isOpen) closeButton.focus({ preventScroll: true });
      }, 300);
    }

    function closePopup() {
      if (!isOpen) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("adhvan-popup-open");
      isOpen = false;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus({ preventScroll: true });
      }
      if (document.activeElement === closeButton) closeButton.blur();
    }

    overlay.querySelectorAll("[data-itinerary-open]").forEach(function (button) {
      button.addEventListener("click", closePopup);
    });

    overlay.querySelectorAll("[data-popup-close]").forEach(function (link) {
      link.addEventListener("click", function () {
        closePopup();
      });
    });

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
