(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  const allowedEvents = new Set([
    "generate_lead",
    "whatsapp_click",
    "phone_click",
    "email_click"
  ]);

  function getPageLocation() {
    return window.location.origin + window.location.pathname;
  }

  function track(eventName, parameters) {
    if (!allowedEvents.has(eventName)) return;

    window.dataLayer.push(Object.assign({
      event: eventName,
      page_location: getPageLocation()
    }, parameters));
  }

  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    let eventName;

    if (/^tel:/i.test(href)) {
      eventName = "phone_click";
    } else if (/^mailto:/i.test(href)) {
      eventName = "email_click";
    } else {
      const hostname = link.hostname.toLowerCase();
      if (hostname === "wa.me" || hostname === "api.whatsapp.com") {
        eventName = "whatsapp_click";
      }
    }

    if (!eventName) return;

    track(eventName, {
      link_url: link.href
    });
  });

  window.adhvanTracking = { track: track };
})();
