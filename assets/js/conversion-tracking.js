(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  const allowedEvents = new Set([
    "generate_lead",
    "whatsapp_click",
    "phone_click",
    "email_click"
  ]);

  const allowedUtmParameters = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ];

  const allowedLeadFormNames = new Set([
    "travel-enquiry-form",
    "pongal-enquiry-form"
  ]);

  const allowedServiceTypes = new Set([
    "flight-bookings",
    "tour-packages",
    "hotel-reservations",
    "visa-assistance",
    "passport-services",
    "travel-insurance",
    "forex-services",
    "transportation"
  ]);

  const safeContactLinkUrls = {
    whatsapp_click: "https://wa.me/",
    phone_click: "tel:[redacted]",
    email_click: "mailto:[redacted]"
  };

  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phonePattern = /(?:\+?\d[\s().-]*){7,}/;

  function isSafeUtmValue(value) {
    return (
      typeof value === "string" &&
      value.length > 0 &&
      value.length <= 100 &&
      !/[\u0000-\u001f<>]/.test(value) &&
      !emailPattern.test(value) &&
      !phonePattern.test(value)
    );
  }

  function getPageLocation() {
    const currentUrl = new URL(window.location.href);
    const pageUrl = new URL(currentUrl.origin + currentUrl.pathname);

    allowedUtmParameters.forEach(function (parameter) {
      const value = currentUrl.searchParams.get(parameter);
      if (value === null) return;
      if (!isSafeUtmValue(value)) {
        console.warn("An unsafe UTM value was omitted from analytics.", parameter);
        return;
      }
      pageUrl.searchParams.set(parameter, value);
    });

    return pageUrl.href;
  }

  function getSafeParameters(eventName, parameters) {
    const safeParameters = {};
    const allowedParameters =
      eventName === "generate_lead"
        ? new Set(["form_name", "service_type"])
        : new Set(["link_url"]);

    if (parameters && typeof parameters === "object" && !Array.isArray(parameters)) {
      Object.keys(parameters).forEach(function (name) {
        if (!allowedParameters.has(name)) {
          console.warn("An unsupported analytics parameter was omitted.", name);
          return;
        }

        if (name === "link_url") return;

        const value = parameters[name];
        const isAllowedValue =
          name === "form_name"
            ? allowedLeadFormNames.has(value)
            : allowedServiceTypes.has(value);
        if (!isAllowedValue) {
          console.warn("An invalid analytics parameter was omitted.", name);
          return;
        }
        safeParameters[name] = value;
      });
    } else if (parameters != null) {
      console.warn("Invalid analytics parameters were omitted.");
    }

    if (safeContactLinkUrls[eventName]) {
      safeParameters.link_url = safeContactLinkUrls[eventName];
    }

    return safeParameters;
  }

  function track(eventName, parameters) {
    if (!allowedEvents.has(eventName)) return;

    window.dataLayer.push(Object.assign({
      event: eventName,
      page_location: getPageLocation()
    }, getSafeParameters(eventName, parameters)));
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
