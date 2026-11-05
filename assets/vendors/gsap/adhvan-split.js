(function ($) {
  "use strict";

  $(window).on("load", function () {
    setTimeout(function () {
      var splitTargets = $(
        ".sec-title__title, .sec-title__tagline, .page-header__title, .sec-title__text, .p-text, .sub-title, .title"
      );

      if (splitTargets.length) {
        gsap.registerPlugin(SplitText);
        splitTargets.each(function (index, target) {
          var splitText = new SplitText(target, { type: "chars, words" });
          var targetElement = $(target);

          gsap.set(target, { perspective: 400 });
          if (targetElement.hasClass("bw-split-in-fade")) {
            gsap.set(splitText.chars, { opacity: 0, ease: "Back.easeOut" });
          }
          if (targetElement.hasClass("bw-split-in-right")) {
            gsap.set(splitText.chars, { opacity: 0, x: "20", ease: "Back.easeOut" });
          }
          if (targetElement.hasClass("bw-split-in-left")) {
            gsap.set(splitText.chars, { opacity: 0, x: "-20", ease: "Back.easeOut" });
          }
          if (targetElement.hasClass("bw-split-in-up")) {
            gsap.set(splitText.chars, {
              opacity: 0,
              y: "80",
              duration: 0.6,
              scale: 1,
              stagger: 0.01,
              transformOrigin: "0% 50% -50",
              ease: "Back.back"
            });
          }
          if (targetElement.hasClass("bw-split-in-up-fast")) {
            gsap.set(splitText.chars, {
              opacity: 0,
              y: "10",
              duration: 0.1,
              scale: 1,
              stagger: 0.01,
              transformOrigin: "0% 50% -50",
              ease: "Back.back"
            });
          }
          if (targetElement.hasClass("bw-split-in-down")) {
            gsap.set(splitText.chars, { opacity: 0, y: "-20", ease: "circ.out" });
          }
          if (targetElement.hasClass("bw-split-in-rotate")) {
            gsap.set(splitText.chars, { opacity: 0, rotateX: "50deg", ease: "circ.out" });
          }
          if (targetElement.hasClass("bw-split-in-scale")) {
            gsap.set(splitText.chars, { opacity: 0, rotateX: "50deg", ease: "circ.out" });
          }

          target.anim = gsap.to(splitText.chars, {
            scrollTrigger: {
              trigger: target,
              toggleActions: "restart pause resume reverse",
              start: "top 90%"
            },
            x: "0",
            y: "0",
            rotateX: "0",
            scale: 1,
            opacity: 1,
            duration: 1.2,
            stagger: 0.02
          });
        });
      }
    }, 200);

    var video = $(".video");
    var videoImage = video.find("img").get(0);
    if (!video.length || !videoImage) return;

    gsap.registerPlugin(ScrollTrigger);
    var videoTimeline = gsap.timeline({ ease: "none" });
    videoTimeline
      .from(videoImage, {
        scale: 0.8,
        duration: 1,
        transformOrigin: "center center"
      })
      .to(videoImage, { scale: 1, duration: 1 });

    ScrollTrigger.create({
      trigger: video[0],
      start: "center center",
      end: "+=100%",
      pin: true,
      animation: videoTimeline,
      scrub: 0.88,
      pinSpacing: false
    });
  });
})(jQuery);