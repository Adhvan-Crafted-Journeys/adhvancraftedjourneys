(() => {
  "use strict";

  let selectedPackage = null;

  function applyPackageSelection(selection) {
    const form = document.querySelector("#travel-enquiry-form");
    const region = form?.querySelector("#travel-region");
    const destination = form?.querySelector("#travel-destination");

    if (!form || !region || !destination) {
      console.error("The package enquiry form is missing its region or destination field.");
      return;
    }

    region.value = selection.region;
    region.dispatchEvent(new Event("change", { bubbles: true }));
    destination.value = selection.destination;
    destination.dispatchEvent(new Event("input", { bubbles: true }));
    destination.dispatchEvent(new Event("change", { bubbles: true }));
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const trigger = event.target.closest("[data-package-select]");
    if (trigger) {
      const region = trigger.dataset.packageRegion;
      const destination = trigger.dataset.packageDestination;
      if (!["domestic", "international"].includes(region) || !destination) {
        console.error("The package card is missing valid enquiry details.", trigger);
        return;
      }

      selectedPackage = { region, destination };
      if (trigger.matches('a[href="#plan-your-trip"]')) {
        applyPackageSelection(selectedPackage);
      }
      return;
    }

    if (event.target.closest(".itinerary-modal__cta") && selectedPackage) {
      window.requestAnimationFrame(() => applyPackageSelection(selectedPackage));
    }
  });
})();
