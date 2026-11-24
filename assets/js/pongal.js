(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dynamic-year").forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });

    document.querySelectorAll("[data-package-enquiry]").forEach(function (link) {
      link.addEventListener("click", function () {
        var destinationField = document.querySelector("#travel-destination");
        if (destinationField) {
          destinationField.value = link.getAttribute("data-package-enquiry") || "";
        }
      });
    });

    var enquiryForm = document.querySelector("#travel-enquiry-form");
    if (!enquiryForm) return;

    var status = document.querySelector("#pongal-enquiry-status");
    var isSubmitting = false;

    function track(eventName, parameters) {
      var tracking = window.adhvanTracking;
      if (tracking && typeof tracking.track === "function") {
        tracking.track(eventName, parameters);
      } else {
        console.warn("Pongal enquiry tracking is unavailable.");
      }
    }

    function trackWhatsAppClick() {
      track("whatsapp_click", {
        link_url: "https://wa.me/919597229511",
        campaign_name: "pongal_2027"
      });
    }

    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (isSubmitting || !enquiryForm.reportValidity()) return;
      isSubmitting = true;
      var whatsappActionTracked = false;

      function trackWhatsAppClickOnce() {
        if (whatsappActionTracked) return;
        whatsappActionTracked = true;
        trackWhatsAppClick();
      }

      var values = new FormData(enquiryForm);
      var message = [
        "Hello Adhvan, I would like to enquire about a Pongal 2027 tour.",
        "Name: " + (values.get("name") || ""),
        "Email: " + (values.get("email") || ""),
        "Package: " + (values.get("destination") || ""),
        "Requirements: " + (values.get("requirements") || "Not specified")
      ].join("\n");
      var whatsappUrl = new URL("https://wa.me/919597229511");
      whatsappUrl.searchParams.set("text", message);

      track("generate_lead", {
        form_name: enquiryForm.id || "pongal-enquiry-form",
        campaign_name: "pongal_2027"
      });

      var whatsappWindow = window.open(whatsappUrl.href, "_blank");
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        trackWhatsAppClickOnce();
        if (status) {
          status.textContent = "WhatsApp opened. Review the details there and send the message to complete your enquiry. This website does not store it.";
          status.hidden = false;
        }
      } else if (status) {
        status.replaceChildren(
          document.createTextNode("Your enquiry is ready, but WhatsApp did not open. Use this link to continue: ")
        );
        var fallbackLink = document.createElement("a");
        fallbackLink.href = whatsappUrl.href;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener noreferrer";
        fallbackLink.textContent = "Open WhatsApp";
        fallbackLink.addEventListener("click", function (clickEvent) {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          if (whatsappActionTracked) return;
          trackWhatsAppClickOnce();
          var fallbackWindow = window.open(whatsappUrl.href, "_blank");
          if (fallbackWindow) {
            fallbackWindow.opener = null;
          } else {
            window.location.assign(whatsappUrl.href);
          }
        });
        status.appendChild(fallbackLink);
        status.hidden = false;
        fallbackLink.focus();
      }

      window.setTimeout(function () {
        isSubmitting = false;
      }, 1000);
    });
  });
})();
