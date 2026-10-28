(function () {
  "use strict";

  const modal = document.querySelector("#itinerary-modal");
  const feedback = document.querySelector("#itinerary-feedback");
  if (!modal || !feedback) return;

  const closeButton = modal.querySelector(".itinerary-modal__close");
  const overlay = modal.querySelector(".itinerary-modal__overlay");
  const titleElement = modal.querySelector("#itinerary-modal-title");
  const subtitleElement = modal.querySelector("#itinerary-modal-subtitle");
  const introElement = modal.querySelector("#itinerary-modal-intro");
  const bodyElement = modal.querySelector("#itinerary-modal-body");
  const planLink = modal.querySelector(".itinerary-modal__cta");

  if (!closeButton || !overlay || !titleElement || !subtitleElement
    || !introElement || !bodyElement || !planLink) {
    console.error("The itinerary modal is missing required elements.");
    return;
  }

  let itinerariesPromise;
  let activeOpener = null;
  let bodyWasLocked = false;
  let activeItinerary = null;
  let openRequestId = 0;

  bodyElement.addEventListener("toggle", function (event) {
    const openedDay = event.target;
    if (!(openedDay instanceof HTMLDetailsElement)
      || !openedDay.open
      || !openedDay.matches(".itinerary-modal__day")) {
      return;
    }

    const section = openedDay.closest(".itinerary-modal__section");
    if (!section || !bodyElement.contains(section)) return;

    section.querySelectorAll("details.itinerary-modal__day[open]").forEach(function (day) {
      if (day !== openedDay) day.open = false;
    });
  }, true);

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function requireRecord(value, path) {
    if (!isRecord(value)) {
      throw new Error(path + " must be an object.");
    }
    return value;
  }

  function requireString(value, path) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(path + " must be a non-empty string.");
    }
  }

  function validateOptionalStrings(record, fields, path) {
    fields.forEach(function (field) {
      if (record[field] !== undefined && typeof record[field] !== "string") {
        throw new Error(path + "." + field + " must be a string.");
      }
    });
  }

  function validateItineraries(data) {
    requireRecord(data, "Itinerary data");
    if (!Array.isArray(data.itineraries)) {
      throw new Error("Itinerary data must contain an itineraries array.");
    }

    const ids = new Set();
    data.itineraries.forEach(function (itinerary, itineraryIndex) {
      const path = "itineraries[" + itineraryIndex + "]";
      requireRecord(itinerary, path);
      requireString(itinerary.id, path + ".id");
      requireString(itinerary.title, path + ".title");
      if (ids.has(itinerary.id)) {
        throw new Error("Duplicate itinerary id: " + itinerary.id);
      }
      ids.add(itinerary.id);

      const duration = requireRecord(itinerary.duration, path + ".duration");
      ["days", "nights"].forEach(function (field) {
        const minimum = field === "days" ? 1 : 0;
        if (!Number.isInteger(duration[field]) || duration[field] < minimum) {
          const requirement = field === "days" ? "positive" : "non-negative";
          throw new Error(path + ".duration." + field + " must be a " + requirement + " integer.");
        }
      });

      validateOptionalStrings(itinerary, ["eyebrow", "intro", "description"], path);
      if (!Array.isArray(itinerary.days)) {
        throw new Error(path + ".days must be an array.");
      }
      itinerary.days.forEach(function (day, dayIndex) {
        const dayPath = path + ".days[" + dayIndex + "]";
        requireRecord(day, dayPath);
        if (!Number.isInteger(day.day) || day.day < 1) {
          throw new Error(dayPath + ".day must be a positive integer.");
        }
        validateOptionalStrings(day, ["date", "title", "overnight"], dayPath);
        if (day.date && !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
          throw new Error(dayPath + ".date must use YYYY-MM-DD format.");
        }
        if (day.date) {
          const dateParts = day.date.split("-").map(Number);
          const parsedDate = new Date(0);
          parsedDate.setUTCFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
          if (parsedDate.getUTCFullYear() !== dateParts[0]
            || parsedDate.getUTCMonth() !== dateParts[1] - 1
            || parsedDate.getUTCDate() !== dateParts[2]) {
            throw new Error(dayPath + ".date must be a valid calendar date.");
          }
        }
        if (!Array.isArray(day.activities)) {
          throw new Error(dayPath + ".activities must be an array.");
        }
        day.activities.forEach(function (activity, activityIndex) {
          const activityPath = dayPath + ".activities[" + activityIndex + "]";
          requireRecord(activity, activityPath);
          requireString(activity.title, activityPath + ".title");
          validateOptionalStrings(activity, ["time", "description"], activityPath);
        });
      });

      if (itinerary.enquiry !== undefined) {
        validateOptionalStrings(requireRecord(itinerary.enquiry, path + ".enquiry"),
          ["destination", "departureDate", "returnDate", "requirements"], path + ".enquiry");
      }
    });
    return data.itineraries;
  }

  function loadItineraries() {
    if (!itinerariesPromise) {
      itinerariesPromise = fetch("assets/data/itineraries.json")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Itinerary request failed with HTTP " + response.status + ".");
          }
          return response.json();
        })
        .then(validateItineraries)
        .catch(function (error) {
          itinerariesPromise = null;
          throw error;
        });
    }
    return itinerariesPromise;
  }

  function element(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function createSection(parent, title, className) {
    const section = element("section", "itinerary-modal__section" + (className ? " " + className : ""));
    section.appendChild(element("h3", "", title));
    parent.appendChild(section);
    return section;
  }


  function renderDestinationGallery(parent, opener, itinerary) {
    const slide = opener.closest(".itinerary-tour-slide");
    if (!slide) return;

    // Read image paths from data-itinerary-images.
    const imagePaths = (slide.dataset.itineraryImages || "")
      .split(",")
      .map(function (path) {
        return path.trim();
      })
      .filter(Boolean);

    // Fallback: use images already inside the slide.
    if (!imagePaths.length) {
      slide.querySelectorAll("img").forEach(function (image) {
        const src = image.getAttribute("src");
        if (src) imagePaths.push(src);
      });
    }

    if (!imagePaths.length) return;

    const gallery = element("section", "itinerary-modal__gallery");
    gallery.setAttribute(
      "aria-label",
      itinerary.title + " destination images"
    );

    const mainImage = document.createElement("img");
    mainImage.className = "itinerary-modal__gallery-main";
    mainImage.src = imagePaths[0];
    mainImage.alt = itinerary.title + " destination";
    mainImage.decoding = "async";
    gallery.appendChild(mainImage);

    const thumbnails = element(
      "div",
      "itinerary-modal__gallery-thumbnails"
    );

    imagePaths.forEach(function (src, index) {
      const thumbnail = document.createElement("button");
      thumbnail.className = "itinerary-modal__gallery-thumbnail";
      thumbnail.type = "button";
      thumbnail.setAttribute(
        "aria-label",
        "Show destination image " + (index + 1)
      );
      thumbnail.setAttribute(
        "aria-pressed",
        index === 0 ? "true" : "false"
      );

      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = src;
      thumbnailImage.alt = "";
      thumbnailImage.loading = "lazy";

      thumbnail.appendChild(thumbnailImage);

      thumbnail.addEventListener("click", function () {
        mainImage.src = src;
        mainImage.alt =
          itinerary.title + " destination " + (index + 1);

        if (typeof mainImage.animate === "function") {
          mainImage.animate(
            [{ opacity: 0.72 }, { opacity: 1 }],
            { duration: 220, easing: "ease-out" }
          );
        }

        thumbnails
          .querySelectorAll(".itinerary-modal__gallery-thumbnail")
          .forEach(function (item) {
            item.setAttribute(
              "aria-pressed",
              item === thumbnail ? "true" : "false"
            );
          });
      });

      thumbnails.appendChild(thumbnail);
    });

    gallery.appendChild(thumbnails);
    parent.appendChild(gallery);
  }


  function renderPackageOverview(parent, itinerary) {
    if (typeof itinerary.description !== "string" || !itinerary.description.trim()) return;

    const overview = element("section", "itinerary-modal__package-overview");
    overview.setAttribute("aria-labelledby", "itinerary-modal-package-overview-title");
    overview.appendChild(element("p", "itinerary-modal__package-eyebrow",
      itinerary["tag-line"] || "YOUR JOURNEY, BEAUTIFULLY PLANNED")
    );
    const heading = element("h3", "", itinerary["sub-title"] || "Discover This Journey");
    heading.id = "itinerary-modal-package-overview-title";
    overview.appendChild(heading);
    overview.appendChild(element("p", "itinerary-modal__package-description", itinerary.description));
    parent.appendChild(overview);
  }

  function renderDays(parent, itinerary) {
    const section = createSection(parent, "Itinerary");
    if (!itinerary.days.length) {
      section.appendChild(element("p", "itinerary-modal__empty",
        "The detailed day-by-day itinerary is coming soon."));
      return;
    }

    const list = element("div", "itinerary-modal__days");
    itinerary.days.forEach(function (day) {
      const card = document.createElement("details");
      card.className = "itinerary-modal__day";
      card.setAttribute("name", "adhvan-itinerary-days");
      const summary = document.createElement("summary");
      summary.className = "itinerary-modal__day-summary";
      summary.appendChild(element("span", "itinerary-modal__day-number", "Day " + day.day));
      if (day.title) summary.appendChild(element("span", "itinerary-modal__summary-title", day.title));
      const chevron = element("span", "itinerary-modal__chevron");
      chevron.setAttribute("aria-hidden", "true");
      summary.appendChild(chevron);
      card.appendChild(summary);

      const content = element("div", "itinerary-modal__day-content");
      if (day.overnight) {
        content.appendChild(element("p", "itinerary-modal__overnight", "Overnight: " + day.overnight));
      }

      const activities = element("div", "itinerary-modal__activities-list");
      (Array.isArray(day.activities) ? day.activities : []).forEach(function (activity) {
        const item = element("div", "itinerary-modal__activity");
        if (activity.time && activity.time.trim()) {
          item.appendChild(element("p", "itinerary-modal__activity-time", activity.time));
        }
        item.appendChild(element("h5", "itinerary-modal__activity-title", activity.title));
        if (activity.description && activity.description.trim()) {
          item.appendChild(element("p", "itinerary-modal__activity-description", activity.description));
        }
        if (item.childElementCount) activities.appendChild(item);
      });
      if (activities.childElementCount) {
        content.appendChild(activities);
      } else {
        content.appendChild(element("p", "itinerary-modal__empty", "No activities are listed for this day."));
      }
      card.appendChild(content);
      list.appendChild(card);
    });
    section.appendChild(list);
  }

  function renderItinerary(itinerary, opener) {
    titleElement.textContent = itinerary.title;
    // subtitleElement.textContent = itinerary.duration.days + " Days / " + itinerary.duration.nights + " Nights";

    subtitleElement.innerHTML = `
      <span class="itinerary-duration__item">
        <span class="itinerary-duration__icon itinerary-duration__icon--day">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2 M12 20v2 M2 12h2 M20 12h2"></path>
            <path d="m4.93 4.93 1.42 1.42 M17.65 17.65l1.42 1.42"></path>
            <path d="m19.07 4.93-1.42 1.42 M6.35 17.65l-1.42 1.42"></path>
          </svg>
        </span>
        <strong>${itinerary.duration.days}</strong>
        <span>Days</span>
      </span>

      <span class="itinerary-duration__divider"></span>

      <span class="itinerary-duration__item">
        <span class="itinerary-duration__icon itinerary-duration__icon--night">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.9 13A9 9 0 0 1 11 3.1
              9 9 0 1 0 20.9 13Z"></path>
          </svg>
        </span>
        <strong>${itinerary.duration.nights}</strong>
        <span>Nights</span>
      </span>
    `;

    introElement.textContent = itinerary.intro || "";
    introElement.hidden = !itinerary.intro;
    bodyElement.replaceChildren();

    const introLayout = element("div", "itinerary-modal__intro-layout");
    renderDestinationGallery(introLayout, opener, itinerary);
    renderPackageOverview(introLayout, itinerary);
    if (introLayout.childElementCount) bodyElement.appendChild(introLayout);

    renderDays(bodyElement, itinerary);
  }

  function showFeedback(message, isError) {
    feedback.textContent = message;
    feedback.hidden = !message;
    feedback.classList.toggle("itinerary-feedback--error", Boolean(isError));
  }

  function openModal(opener) {
    activeOpener = opener;
    if (modal.hidden) {
      bodyWasLocked = document.body.classList.contains("locked");
    }
    modal.hidden = false;
    document.body.classList.add("locked");
    closeButton.focus();
  }

  function closeModal(restoreFocus) {
    openRequestId += 1;
    modal.hidden = true;
    activeItinerary = null;
    bodyElement.setAttribute("aria-busy", "false");
    if (!bodyWasLocked) document.body.classList.remove("locked");
    if (restoreFocus && activeOpener && activeOpener.isConnected) activeOpener.focus();
  }

  function showModalState(message, state) {
    titleElement.textContent = state === "loading" ? "Loading itinerary…" : "Itinerary unavailable";
    subtitleElement.textContent = "";
    introElement.textContent = "";
    introElement.hidden = true;
    const status = element("p", "itinerary-modal__state itinerary-modal__state--" + state, message);
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    bodyElement.replaceChildren(status);
    bodyElement.setAttribute("aria-busy", state === "loading" ? "true" : "false");
  }

  async function openItinerary(opener) {
    const id = opener.dataset.itineraryId;
    if (!id) {
      const error = new Error("The selected tour card has no data-itinerary-id.");
      console.error(error);
      showFeedback("This itinerary is not available yet. Please contact our team for details.", true);
      return;
    }

    const requestId = ++openRequestId;
    activeItinerary = null;
    showFeedback("", false);
    showModalState("Loading itinerary details…", "loading");
    openModal(opener);
    try {
      const itineraries = await loadItineraries();
      if (requestId !== openRequestId) return;
      const itinerary = itineraries.find(function (item) {
        return item.id === id;
      });
      if (!itinerary) {
        throw new Error("No itinerary found for id: " + id);
      }
      renderItinerary(itinerary, opener);
      activeItinerary = itinerary;
      bodyElement.setAttribute("aria-busy", "false");
    } catch (error) {
      if (requestId !== openRequestId) return;
      console.error("Unable to open itinerary \"" + id + "\".", error);
      showModalState("We couldn't load this itinerary right now. Please try again or contact our team.", "error");
    }
  }

  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;
    const opener = event.target.closest("[data-itinerary-open]");
    if (opener) openItinerary(opener);
  });

  closeButton.addEventListener("click", function () {
    closeModal(true);
  });

  modal.addEventListener("click", function (event) {
    if (event.target === overlay) closeModal(true);
  });

  modal.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal(true);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      modal.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")
    ).filter(function (item) {
      return !item.disabled && item.getClientRects().length > 0;
    });
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  planLink.addEventListener("click", function (event) {
    event.preventDefault();
    const form = document.querySelector("#travel-enquiry-form");
    if (!form) {
      closeModal(false);
      window.location.hash = "plan-your-trip";
      return;
    }

    const enquiry = activeItinerary && activeItinerary.enquiry;
    if (activeItinerary) {
      [
        ["#travel-destination", activeItinerary.title],
        ["#travel-departure", enquiry && enquiry.departureDate],
        ["#travel-return", enquiry && enquiry.returnDate],
        ["#travel-requirements", enquiry && enquiry.requirements]
      ].forEach(function (field) {
        const input = form.querySelector(field[0]);
        if (!input || !field[1]) return;
        input.value = field[1];
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    const href = planLink.getAttribute("href");
    closeModal(false);
    if (href && window.location.hash !== href) {
      window.history.replaceState(null, "", href);
    }
    window.requestAnimationFrame(function () {
      const travelSection = document.querySelector("#plan-your-trip");
      if (!travelSection) {
        window.location.hash = "plan-your-trip";
        return;
      }
      const stickyHeader = document.querySelector(".sticky-header--cloned.active");
      const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;
      const sectionTop = window.pageYOffset + travelSection.getBoundingClientRect().top;
      window.scrollTo({
        top: Math.max(0, sectionTop - headerOffset - 16),
        behavior: "smooth"
      });
      const destinationInput = form.querySelector("#travel-destination");
      if (destinationInput) destinationInput.focus({ preventScroll: true });
    });
  });
})();
