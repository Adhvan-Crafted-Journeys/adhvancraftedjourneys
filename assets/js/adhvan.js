(function ($) {
  "use strict";

  let dynamicyearElm = $(".dynamic-year");
  if (dynamicyearElm.length) {
    let currentYear = new Date().getFullYear();
    dynamicyearElm.html(currentYear);
  }

  // Multi Date Picker
  if ($(".adhvan-multi-datepicker").length) {
    $(".adhvan-multi-datepicker").each(function () {
      let self = $(this);
      self.daterangepicker({
        autoUpdateInput: false
      });
      self.on("apply.daterangepicker", function (ev, picker) {
        $(this).val(
          picker.startDate.format("D MMM YY") +
          " - " +
          picker.endDate.format("D MMM YY")
        );
      });
    });
  }

  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: "linear",
            step: function () {
              $t.find(".count-text").text(Math.floor(this.countNum));
            },
            complete: function () {
              $t.find(".count-text").text(this.countNum);
            }
          });
        }
      }, {
      accY: 0
    }
    );
  }

  // custom coursor
  if ($(".custom-cursor").length) {
    var cursor = document.querySelector(".custom-cursor__cursor");
    var cursorinner = document.querySelector(".custom-cursor__cursor-two");
    var a = document.querySelectorAll("a");

    document.addEventListener("mousemove", function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });

    document.addEventListener("mousemove", function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursorinner.style.left = x + "px";
      cursorinner.style.top = y + "px";
    });

    document.addEventListener("mousedown", function () {
      cursor.classList.add("click");
      cursorinner.classList.add("custom-cursor__innerhover");
    });

    document.addEventListener("mouseup", function () {
      cursor.classList.remove("click");
      cursorinner.classList.remove("custom-cursor__innerhover");
    });

    a.forEach((item) => {
      item.addEventListener("mouseover", () => {
        cursor.classList.add("custom-cursor__hover");
      });
      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("custom-cursor__hover");
      });
    });
  }

  if ($(".contact-form-validated").length) {
    $(".contact-form-validated").validate({
      // initialize the plugin
      rules: {
        name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        message: {
          required: true
        },
        subject: {
          required: true
        }
      },
      submitHandler: function (form) {
        // sending value with ajax request
        $.post(
          $(form).attr("action"),
          $(form).serialize(),
          function (response) {
            $(form).parent().find(".result").append(response);
            $(form).find('input[type="text"]').val("");
            $(form).find('input[type="email"]').val("");
            $(form).find("textarea").val("");
          }
        );
        return false;
      }
    });
  }

  // mailchimp form
  if ($(".mc-form").length) {
    $(".mc-form").each(function () {
      var Self = $(this);
      var mcURL = Self.data("url");
      var mcResp = Self.parent().find(".mc-form__response");

      Self.ajaxChimp({
        url: mcURL,
        callback: function (resp) {
          // appending response
          mcResp.append(function () {
            return '<p class="mc-message">' + resp.msg + "</p>";
          });
          // making things based on response
          if (resp.result === "success") {
            // Do stuff
            Self.removeClass("errored").addClass("successed");
            mcResp.removeClass("errored").addClass("successed");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
          if (resp.result === "error") {
            Self.removeClass("successed").addClass("errored");
            mcResp.removeClass("successed").addClass("errored");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
        }
      });
    });
  }

  if ($(".video-popup").length) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,

      fixedContentPos: false
    });
  }

  if ($(".img-popup").length) {
    var groups = {};
    $(".img-popup").each(function () {
      var id = parseInt($(this).attr("data-group"), 10);

      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(this);
    });

    $.each(groups, function () {
      $(this).magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: {
          enabled: true
        }
      });
    });
  }

  let solinomImagePopupGallery = $(".card__popup");
  solinomImagePopupGallery.each(function () {
    let elm = $(this);
    let options = elm.data("gallery-options");
    let imageGallery = elm.magnificPopup(
      "object" === typeof options ? options : JSON.parse(options)
    );
  });

  function dynamicCurrentMenuClass(selector) {
    let FileName = window.location.href.split("/").reverse()[0];

    selector.find("li").each(function () {
      let anchor = $(this).find("a");
      if ($(anchor).attr("href") == FileName) {
        $(this).addClass("current");
      }
    });
    // if any li has .current elmnt add class
    selector.children("li").each(function () {
      if ($(this).find(".current").length) {
        $(this).addClass("current");
      }
    });
    // if no file name return
    if ("" == FileName) {
      selector.find("li").eq(0).addClass("current");
    }
  }

  if ($(".main-menu__list").length) {
    // dynamic current class
    let mainNavUL = $(".main-menu__list");
    dynamicCurrentMenuClass(mainNavUL);
  }

  if ($(".service-sidebar__nav").length) {
    // dynamic current class
    let mainNavUL = $(".service-sidebar__nav");
    dynamicCurrentMenuClass(mainNavUL);
  }

  if ($(".main-menu").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".sticky-header").length) {
    $(".sticky-header")
      .clone()
      .insertAfter(".sticky-header")
      .addClass("sticky-header--cloned");
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .dropdown > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }

  //Show Popup menu
  $(document).on("click", ".megamenu-clickable--toggler > a", function (e) {
    $("body").toggleClass("megamenu-popup-active");
    $(this).parent().find("ul").toggleClass("megamenu-clickable--active");
    e.preventDefault();
  });
  $(document).on("click", ".megamenu-clickable--close", function (e) {
    $("body").removeClass("megamenu-popup-active");
    $(".megamenu-clickable--active").removeClass("megamenu-clickable--active");
    e.preventDefault();
  });

  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  if ($(".search-toggler").length) {
    $(".search-toggler").on("click", function (e) {
      e.preventDefault();
      $(".search-popup").toggleClass("active");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }
  if ($(".mini-cart__toggler").length) {
    $(".mini-cart__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mini-cart").toggleClass("expanded");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }
  if ($(".odometer").length) {
    $(".odometer").appear(function (e) {
      var odo = $(".odometer");
      odo.each(function () {
        var countNumber = $(this).attr("data-count");
        $(this).html(countNumber);
      });
    });
  }

  if ($(".wow").length) {
    var wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // animation css class (default is animated)
      mobile: true, // trigger animations on mobile devices (default is true)
      live: true // act on asynchronously loaded content (default is true)
    });
    wow.init();
  }

  //accrodion
  if ($(".adhvan-accrodion").length) {
    var accrodionGrp = $(".adhvan-accrodion");
    accrodionGrp.each(function () {
      var accrodionName = $(this).data("grp-name");
      var Self = $(this);
      var accordion = Self.find(".accrodion");
      Self.addClass(accrodionName);
      Self.find(".accrodion .accrodion-content").hide();
      Self.find(".accrodion.active").find(".accrodion-content").show();
      accordion.each(function () {
        $(this)
          .find(".accrodion-title")
          .on("click", function () {
            if ($(this).parent().hasClass("active") === false) {
              $(".adhvan-accrodion." + accrodionName)
                .find(".accrodion")
                .removeClass("active");
              $(".adhvan-accrodion." + accrodionName)
                .find(".accrodion")
                .find(".accrodion-content")
                .slideUp();
              $(this).parent().addClass("active");
              $(this).parent().find(".accrodion-content").slideDown();
            }
          });
      });
    });
  }

  function thmOwlInit() {
    // owl slider
    let adhvanowlCarousel = $(".adhvan-owl__carousel");
    if (adhvanowlCarousel.length) {
      adhvanowlCarousel.each(function () {
        let elm = $(this);
        let options = elm.data("owl-options");
        let thmOwlCarousel = elm.owlCarousel(
          "object" === typeof options ? options : JSON.parse(options)
        );
        elm.find("button").each(function () {
          $(this).attr("aria-label", "carousel button");
        });
      });
    }
    let adhvanowlCarouselNav = $(".adhvan-owl__carousel--custom-nav");
    if (adhvanowlCarouselNav.length) {
      adhvanowlCarouselNav.each(function () {
        let elm = $(this);
        let owlNavPrev = elm.data("owl-nav-prev");
        let owlNavNext = elm.data("owl-nav-next");
        $(owlNavPrev).on("click", function (e) {
          elm.trigger("prev.owl.carousel");
          e.preventDefault();
        });

        $(owlNavNext).on("click", function (e) {
          elm.trigger("next.owl.carousel");
          e.preventDefault();
        });
      });
    }
  }

  function adhvanSlickInit() {
    // slick slider
    let adhvanslickCarousel = $(".adhvan-slick__carousel");
    if (adhvanslickCarousel.length) {
      adhvanslickCarousel.each(function () {
        let elm = $(this);
        let options = elm.data("slick-options");
        let adhvanslickCarousel = elm.slick(
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }
    let adhvanslickCarouselCounter = $(".adhvan-slick__custome-counter");
    if (adhvanslickCarouselCounter.length) {
      adhvanslickCarouselCounter.each(function () {
        let elm = $(this);
        let options = elm.data("slick-options");
        let currentSlide;
        let slidesCount;
        let sliderCounter = document.createElement('div');
        sliderCounter.classList.add('adhvan-slick__counter');

        let updateSliderCounter = function (slick, currentIndex) {
          currentSlide = slick.slickCurrentSlide() + 1;
          slidesCount = slick.slideCount;
          $(sliderCounter).html('<span class="adhvan-slick__counter__active">' + currentSlide + '</span>' + '' + '<span>' + slidesCount + '</span>')
        };
        elm.on('init', function (event, slick) {
          elm.append(sliderCounter);
          updateSliderCounter(slick);
        });
        elm.on('afterChange', function (event, slick, currentSlide) {
          updateSliderCounter(slick, currentSlide);
        });

        let adhvanslickCarousel = elm.slick(
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }
  }

  function adhvanPara() {
    let adhvanParaElm = $(".adhvan-splax");
    if (adhvanParaElm.length) {
      adhvanParaElm.each(function () {
        let self = $(this);
        let className = self.attr("class");
        var image = document.getElementsByClassName(className);
        let options = self.data("para-options");
        let adhvanPara = new simpleParallax(
          image,
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }
  }


  //Strech Column
  function adhvan_stretch() {
    var i = $(window).width();
    $(".row .adhvan-stretch-element-inside-column").each(function () {
      var $this = $(this),
        row = $this.closest(".row"),
        cols = $this.closest('[class^="col-"]'),
        colsheight = $this.closest('[class^="col-"]').height(),
        rect = this.getBoundingClientRect(),
        l = row[0].getBoundingClientRect(),
        s = cols[0].getBoundingClientRect(),
        r = rect.left,
        d = i - rect.right,
        c = l.left + (parseFloat(row.css("padding-left")) || 0),
        u = i - l.right + (parseFloat(row.css("padding-right")) || 0),
        p = s.left,
        f = i - s.right,
        styles = {
          "margin-left": 0,
          "margin-right": 0
        };
      if (Math.round(c) === Math.round(p)) {
        var h = parseFloat($this.css("margin-left") || 0);
        styles["margin-left"] = h - r;
      }
      if (Math.round(u) === Math.round(f)) {
        var w = parseFloat($this.css("margin-right") || 0);
        styles["margin-right"] = w - d;
      }
      $this.css(styles);
    });
  }
  adhvan_stretch();

  // window load event
  $(window).on("load", function () {
    var preload = $('.preloader');
    if (preload.length > 0) {
      preload.delay(800).fadeOut('slow');
    }
    thmOwlInit();
    adhvanSlickInit();
    adhvanPara();

    if ($(".circle-progress").length) {
      $(".circle-progress").appear(function () {
        let circleProgress = $(".circle-progress");
        circleProgress.each(function () {
          let progress = $(this);
          let progressOptions = progress.data("options");
          progress.circleProgress(progressOptions);
        });
      });
    }
    if ($(".masonry-layout").length) {
      $(".masonry-layout").imagesLoaded(function () {
        $(".masonry-layout").isotope({
          layoutMode: "masonry"
        });
      });
    }
    if ($(".fitRow-layout").length) {
      $(".fitRow-layout").imagesLoaded(function () {
        $(".fitRow-layout").isotope({
          layoutMode: "fitRows"
        });
      });
    }

    if ($(".post-filter").length) {
      var postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        var Self = $(this);
        var selector = Self.attr("data-filter");
        postFilterList.removeClass("active");
        Self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }

    if ($(".post-filter.has-dynamic-filter-counter").length) {
      // var allItem = $('.single-filter-item').length;

      var activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
        "li"
      );

      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this).append("<sup>[" + count + "]</sup>");
      });
    }
  });

  function stickyMenuAlways($targetMenu, $toggleClass) {
    window.addEventListener("scroll", function () {
      var st = window.pageYOffset || document.documentElement.scrollTop;

      if (st > 500) {
        // always show after 500px
        $targetMenu.addClass($toggleClass);
      } else {
        // hide near top
        $targetMenu.removeClass($toggleClass);
      }
    });
  }

  stickyMenuAlways($(".sticky-header--normal"), "active");

  let scrollTop = $('.scroll-to-top path');
  if (scrollTop.length) {
    var e = document.querySelector(".scroll-to-top path"),
      t = e.getTotalLength();
    (e.style.transition = e.style.WebkitTransition = "none"),
      (e.style.strokeDasharray = t + " " + t),
      (e.style.strokeDashoffset = t),
      e.getBoundingClientRect(),
      (e.style.transition = e.style.WebkitTransition =
        "stroke-dashoffset 10ms linear");
    var o = function () {
      var o = $(window).scrollTop(),
        r = $(document).height() - $(window).height(),
        i = t - (o * t) / r;
      e.style.strokeDashoffset = i;
    };
    o(), $(window).scroll(o);
    var back = $(".scroll-to-top"),
      body = $("body, html");
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > $(window).height()) {
        back.addClass("scroll-to-top--active");
      } else {
        back.removeClass("scroll-to-top--active");
      }
    });
  }

  $(window).on("resize", function () {
    adhvan_stretch();
  });
  (function () {
    if (!('IntersectionObserver' in window)) {
      // fallback: reveal all
      document.querySelectorAll('.service-card').forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.service-card[data-animate]').forEach(el => {
      io.observe(el);
    });
  })();

  const travelEnquiryForm = document.querySelector("#travel-enquiry-form");
  if (travelEnquiryForm) {
    const whatsappNumber = "919597229511";
    let travelFormSubmitted = false;
    const travelFormFields = Array.from(
      travelEnquiryForm.querySelectorAll("input, select, textarea")
    );
    const departureDateInput = travelEnquiryForm.querySelector("#travel-departure");
    const returnDateInput = travelEnquiryForm.querySelector("#travel-return");

    function getTravelFieldError(field) {
      const value = field.value.trim();

      if (field.id === "travel-name" && !value) {
        return "Please enter your full name.";
      }
      if (field.id === "travel-phone") {
        const digits = value.replace(/\D/g, "");
        if (!value) {
          return "Please enter your WhatsApp number.";
        }
        if (!/^\+?[0-9\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
          return "Enter a valid phone number with 7 to 15 digits.";
        }
      }
      if (field.id === "travel-email") {
        if (!value) {
          return "Please enter your email address.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Enter a valid email address.";
        }
      }
      if (field.id === "travel-destination" && !value) {
        return "Please enter your destination.";
      }
      if (field.id === "travel-departure" && !value) {
        return "Please select a departure date.";
      }
      if (field.id === "travel-return") {
        if (!value) {
          return "Please select a return date.";
        }
        if (departureDateInput.value && value < departureDateInput.value) {
          return "Return date cannot be earlier than departure date.";
        }
      }
      if (field.id === "travel-adults") {
        if (!value) {
          return "Please enter the number of adults.";
        }
        if (!Number.isInteger(Number(value)) || Number(value) < 1) {
          return "Enter a whole number of at least 1 adult.";
        }
      }
      if (field.id === "travel-children" && (field.validity.badInput || (value &&
        (!Number.isInteger(Number(value)) || Number(value) < 0)))) {
        return "Enter a whole number of 0 or more children.";
      }
      if (field.id === "travel-type" && !value) {
        return "Please select a trip type.";
      }
      if (field.id === "travel-budget" && !value) {
        return "Please select an approximate budget.";
      }

      return "";
    }

    function showTravelFieldError(field, message) {
      const error = document.querySelector(`#${field.id}-error`);
      field.setAttribute("aria-invalid", message ? "true" : "false");
      error.textContent = message;
      error.hidden = !message;
    }

    function validateTravelForm() {
      let isValid = true;
      let firstInvalidField = null;

      travelFormFields.forEach(function (field) {
        const message = getTravelFieldError(field);
        showTravelFieldError(field, message);
        if (message) {
          isValid = false;
          firstInvalidField = firstInvalidField || field;
        }
      });

      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return isValid;
    }

    function formatTravelDate(value) {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      }).format(new Date(`${value}T00:00:00Z`));
    }

    function buildWhatsAppMessage(form) {
      const values = new FormData(form);
      const travelers = [`${values.get("adults")} ${Number(values.get("adults")) === 1 ? "Adult" : "Adults"}`];
      const children = String(values.get("children") || "").trim();
      if (children) {
        travelers.push(`${children} ${Number(children) === 1 ? "Child" : "Children"}`);
      }

      const lines = [
        "Hello Adhvan Crafted Journeys,",
        "",
        String(values.get("tripType")) === "Visa Assistance"
          ? "I would like to enquire about visa assistance."
          : "I would like to plan a trip.",
        "",
        String(values.get("tripType")) === "Visa Assistance"
          ? "*Visa Assistance Enquiry*"
          : "*Travel Enquiry*",
        "",
        `Name: ${String(values.get("name")).trim()}`,
        `WhatsApp: ${String(values.get("phone")).trim()}`,
        `Email: ${String(values.get("email")).trim()}`,
        `Destination: ${String(values.get("destination")).trim()}`,
        `Travel Dates: ${formatTravelDate(String(values.get("departure")))} – ${formatTravelDate(String(values.get("return")))}`,
        `Travelers: ${travelers.join("\n")}`,
        `Trip Type: ${String(values.get("tripType"))}`,
        `Budget: ${String(values.get("budget"))}`
      ];

      const requirements = String(values.get("requirements") || "").trim();
      if (requirements) {
        lines.push("", "Additional Requirements:", requirements);
      }
      lines.push("", "Thank you.");
      return lines.join("\n");
    }

    function openWhatsApp(message) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    departureDateInput.addEventListener("change", function () {
      returnDateInput.min = departureDateInput.value;
      if (travelFormSubmitted || returnDateInput.value) {
        showTravelFieldError(returnDateInput, getTravelFieldError(returnDateInput));
      }
    });

    travelFormFields.forEach(function (field) {
      field.addEventListener("blur", function () {
        showTravelFieldError(field, getTravelFieldError(field));
      });
      field.addEventListener("input", function () {
        if (travelFormSubmitted || field.getAttribute("aria-invalid") === "true") {
          showTravelFieldError(field, getTravelFieldError(field));
        }
      });
      field.addEventListener("change", function () {
        if (travelFormSubmitted || field.getAttribute("aria-invalid") === "true") {
          showTravelFieldError(field, getTravelFieldError(field));
        }
      });
    });

    travelEnquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      travelFormSubmitted = true;
      const status = document.querySelector("#travel-enquiry-status");
      status.hidden = true;
      status.textContent = "";

      if (!validateTravelForm()) {
        return;
      }

      openWhatsApp(buildWhatsAppMessage(travelEnquiryForm));
      status.textContent = "Your enquiry is ready in WhatsApp. Please tap Send to contact our travel team.";
      status.hidden = false;
    });
  }

  const visaAssistanceCta = document.querySelector(".visa-assistance__button--primary");
  if (visaAssistanceCta && travelEnquiryForm) {
    visaAssistanceCta.addEventListener("click", function (event) {
      event.preventDefault();
      const tripTypeInput = travelEnquiryForm.querySelector("#travel-type");
      tripTypeInput.value = "Visa Assistance";
      tripTypeInput.dispatchEvent(new Event("change", { bubbles: true }));

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector("#plan-your-trip").scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  const videoGalleryModal = document.getElementById("video-gallery-modal");
  if (videoGalleryModal && videoGalleryModal.dataset.initialized !== "true") {
    videoGalleryModal.dataset.initialized = "true";
    const destinations = {
      "tamil-nadu": {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        videos: [
          {
            id: "culture-of-tamil-nadu",
            title: "Culture of Tamil Nadu",
            thumbnail: "assets/images/video-gallery/tamil-nadu/culture-of-tamil-nadu.webp",
            youtubeId: "MRvKJdjPx28"
          },
          {
            id: "the-craftsman-with-the-tiles",
            title: "Making of Athangudi Tiles | Handicrafts of Karaikudi",
            thumbnail: "assets/images/video-gallery/tamil-nadu/the-craftsman-with-the-tiles.webp",
            youtubeId: "TZu2u0cx75U"
          },
          {
            id: "chettinad-kandangi-saree",
            title: "Traditional Handloom weaving of Chettinad Kandangi Saree",
            thumbnail: "assets/images/video-gallery/tamil-nadu/chettinad-kandangi-saree.webp",
            youtubeId: "wK5EtQifYAI"
          },
          {
            id: "thanjavur-thalaiyatti-bommai",
            title: "Making of Thanjavur Thalaiyatti Bommai",
            thumbnail: "assets/images/video-gallery/tamil-nadu/thanjavur-thalaiyatti-bommai.webp",
            youtubeId: "sSeVp0qJ6Dg"
          },
          {
            id: "making-of-veena",
            title: "Making of Veena",
            thumbnail: "assets/images/video-gallery/tamil-nadu/making-of-veena.webp",
            youtubeId: "Kc5GKqmX4vI"
          },
          {
            id: "treasures-of-thanjavur",
            title: "Treasures of Thanjavur",
            thumbnail: "assets/images/video-gallery/tamil-nadu/treasures-of-thanjavur.webp",
            youtubeId: "KGJVxARvm7c"
          }
        ]
      },
      keralam: {
        id: "keralam",
        name: "Keralam",
        videos: [
          {
            id: "keralam-backwaters",
            title: "Keralam’s Tranquil Backwaters",
            thumbnail: "assets/images/video-gallery/keralam.jpg",
            youtubeId: "REPLACE_WITH_KERALAM_BACKWATERS_VIDEO_ID"
          },
          {
            id: "keralam-green-escapes",
            title: "Keralam’s Green Escapes",
            thumbnail: "assets/images/video-gallery/keralam-green-escapes.jpg",
            youtubeId: "REPLACE_WITH_KERALAM_GREEN_ESCAPES_VIDEO_ID"
          }
        ]
      }
    };
    const videoGalleryTitle = document.getElementById("video-gallery-modal-title");
    const videoGalleryCloseButton = videoGalleryModal.querySelector(".video-gallery-modal__close");
    const videoGalleryPlayer = videoGalleryModal.querySelector(".video-gallery-modal__player");
    const videoGalleryThumbnails = videoGalleryModal.querySelector(".video-gallery-modal__thumbnails");
    const videoGalleryOverlay = videoGalleryModal.querySelector(".video-gallery-modal__overlay");
    let activeCard = null;
    let activeDestination = null;
    let wasBodyLocked = false;
    let closeTimeoutId = null;

    function syncVideoGalleryDimensions() {
      if (window.matchMedia("(max-width: 767px)").matches) {
        videoGalleryPlayer.style.maxWidth = "";
        videoGalleryThumbnails.style.height = "";
        return;
      }

      const maxPlayerHeight = Math.max(0, Math.min(450, window.innerHeight - 220));
      videoGalleryPlayer.style.maxWidth = `${Math.min(800, maxPlayerHeight * 16 / 9)}px`;
      const playerHeight = videoGalleryPlayer.offsetHeight;
      if (playerHeight) {
        videoGalleryThumbnails.style.height = `${playerHeight}px`;
      }
    }

    function stopVideoPlayback() {
      if (!videoGalleryPlayer) {
        return;
      }

      const currentVideo = videoGalleryPlayer.querySelector("video");
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.removeAttribute("src");
        currentVideo.querySelectorAll("source").forEach(function (source) {
          source.removeAttribute("src");
        });
        currentVideo.load();
      }

      videoGalleryPlayer.querySelectorAll("iframe").forEach(function (iframe) {
        iframe.src = "about:blank";
        iframe.remove();
      });

      videoGalleryPlayer.querySelectorAll("video").forEach(function (video) {
        video.remove();
      });
    }

    function showVideoPlaceholder(message) {
      const placeholder = document.createElement("div");
      placeholder.className = "video-gallery-modal__placeholder";

      const icon = document.createElement("span");
      icon.className = "video-gallery-modal__placeholder-icon";
      icon.setAttribute("aria-hidden", "true");

      const state = document.createElement("span");
      state.className = "video-gallery-modal__state";
      state.textContent = message || "Video coming soon";

      placeholder.append(icon, state);
      videoGalleryPlayer.replaceChildren(placeholder);
    }

    function renderVideoThumbnails(destination) {
      videoGalleryThumbnails.replaceChildren();
      destination.videos.forEach(function (video, index) {
        const button = document.createElement("button");
        button.className = "video-gallery-modal__thumbnail-button";
        button.type = "button";
        button.dataset.videoIndex = String(index);
        button.setAttribute("aria-label", `Play ${video.title}`);
        button.setAttribute("aria-pressed", "false");

        const image = document.createElement("img");
        image.src = video.thumbnail;
        image.alt = `${video.title} thumbnail`;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", function () {
          image.hidden = true;
        });

        const playIndicator = document.createElement("span");
        playIndicator.className = "video-gallery-modal__thumbnail-play";
        playIndicator.setAttribute("aria-hidden", "true");

        const title = document.createElement("span");
        title.className = "video-gallery-modal__thumbnail-title";
        title.textContent = video.title;

        button.append(image, playIndicator, title);
        videoGalleryThumbnails.appendChild(button);
      });
    }

    function scrollSelectedThumbnail(button) {
      if (videoGalleryModal.hidden || !videoGalleryModal.classList.contains("is-open")) {
        return;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior = reducedMotion ? "auto" : "smooth";
      const containerBounds = videoGalleryThumbnails.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();

      if (window.matchMedia("(max-width: 767px)").matches) {
        if (buttonBounds.left < containerBounds.left) {
          videoGalleryThumbnails.scrollTo({
            left: videoGalleryThumbnails.scrollLeft + buttonBounds.left - containerBounds.left,
            behavior: behavior
          });
        } else if (buttonBounds.right > containerBounds.right) {
          videoGalleryThumbnails.scrollTo({
            left: videoGalleryThumbnails.scrollLeft + buttonBounds.right - containerBounds.right,
            behavior: behavior
          });
        }
        return;
      }

      if (buttonBounds.top < containerBounds.top) {
        videoGalleryThumbnails.scrollTo({
          top: videoGalleryThumbnails.scrollTop + buttonBounds.top - containerBounds.top,
          behavior: behavior
        });
      } else if (buttonBounds.bottom > containerBounds.bottom) {
        videoGalleryThumbnails.scrollTo({
          top: videoGalleryThumbnails.scrollTop + buttonBounds.bottom - containerBounds.bottom,
          behavior: behavior
        });
      }
    }

    function selectVideo(index) {
      if (!activeDestination || !activeDestination.videos[index]) {
        return;
      }

      stopVideoPlayback();
      const video = activeDestination.videos[index];
      videoGalleryTitle.textContent = `Now playing: ${video.title}`;
      videoGalleryThumbnails.querySelectorAll(".video-gallery-modal__thumbnail-button")
        .forEach(function (button, buttonIndex) {
          const isSelected = buttonIndex === index;
          button.setAttribute("aria-pressed", String(isSelected));
          button.classList.toggle("is-selected", isSelected);
        });

      const selectedThumbnail = videoGalleryThumbnails.querySelector(
        `[data-video-index="${index}"]`
      );
      scrollSelectedThumbnail(selectedThumbnail);

      const isValidYoutubeId = /^[A-Za-z0-9_-]{11}$/.test(video.youtubeId);
      if (!isValidYoutubeId) {
        showVideoPlaceholder("Video coming soon");
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&rel=0`;
      iframe.title = video.title;
      iframe.loading = "eager";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.addEventListener("error", function () {
        iframe.remove();
        showVideoPlaceholder("This video is temporarily unavailable.");
      });
      videoGalleryPlayer.replaceChildren(iframe);
    }

    function openVideoGalleryModal(card) {
      const destination = destinations[card.dataset.destinationId];
      if (!destination) {
        return;
      }

      window.clearTimeout(closeTimeoutId);
      activeCard = card;
      activeDestination = destination;
      renderVideoThumbnails(destination);
      selectVideo(0);

      if (videoGalleryModal.hidden || !videoGalleryModal.classList.contains("is-open")) {
        wasBodyLocked = document.body.classList.contains("locked");
        document.body.classList.add("locked");
      }
      videoGalleryModal.hidden = false;
      videoGalleryModal.setAttribute("aria-hidden", "false");
      window.requestAnimationFrame(function () {
        videoGalleryModal.classList.add("is-open");
        videoGalleryCloseButton.focus();
        syncVideoGalleryDimensions();
        scrollSelectedThumbnail(videoGalleryThumbnails.querySelector(".is-selected"));
      });
    }

    function closeVideoGalleryModal() {
      if (videoGalleryModal.hidden) {
        return;
      }

      videoGalleryModal.classList.remove("is-open");
      videoGalleryModal.setAttribute("aria-hidden", "true");
      stopVideoPlayback();
      showVideoPlaceholder();
      if (!wasBodyLocked) {
        document.body.classList.remove("locked");
      }
      if (activeCard) {
        activeCard.focus();
      }

      closeTimeoutId = window.setTimeout(function () {
        videoGalleryModal.hidden = true;
      }, 220);
    }

    document.addEventListener("click", function (event) {
      const card = event.target.closest(".video-card");
      if (card) {
        openVideoGalleryModal(card);
      }
    });

    videoGalleryThumbnails.addEventListener("click", function (event) {
      const button = event.target.closest(".video-gallery-modal__thumbnail-button");
      if (button) {
        selectVideo(Number(button.dataset.videoIndex));
      }
    });

    document.addEventListener("keydown", function (event) {
      const card = event.target.closest(".video-card");
      if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openVideoGalleryModal(card);
        return;
      }

      if (videoGalleryModal.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeVideoGalleryModal();
        return;
      }

      const thumbnailButton = event.target.closest(".video-gallery-modal__thumbnail-button");
      if (thumbnailButton && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        event.preventDefault();
        const currentIndex = Number(thumbnailButton.dataset.videoIndex);
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const videoCount = activeDestination.videos.length;
        const nextIndex = (currentIndex + direction + videoCount) % videoCount;
        selectVideo(nextIndex);
        videoGalleryThumbnails.querySelector(`[data-video-index="${nextIndex}"]`).focus();
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = videoGalleryModal.querySelectorAll(
          "button:not([disabled]), iframe, [href], [tabindex]:not([tabindex='-1'])"
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });

    videoGalleryModal.addEventListener("click", function (event) {
      if (event.target === videoGalleryOverlay || event.target === videoGalleryModal) {
        closeVideoGalleryModal();
      }
    });

    videoGalleryCloseButton.addEventListener("click", closeVideoGalleryModal);
    window.addEventListener("resize", syncVideoGalleryDimensions);

    if ("ResizeObserver" in window) {
      new ResizeObserver(syncVideoGalleryDimensions).observe(videoGalleryPlayer);
    }

    videoGalleryModal.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.hidden = true;
      });
    });

    document.querySelectorAll(".video-card__poster").forEach(function (image) {
      image.addEventListener("error", function () {
        image.hidden = true;
      });
    });
  }
})(jQuery);