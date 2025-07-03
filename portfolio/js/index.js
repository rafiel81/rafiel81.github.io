(() => {
  let lastScrollY = window.scrollY;

  const elements = document.querySelectorAll("[data-scroll-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scrollingUp = window.scrollY < lastScrollY;

        if (entry.isIntersecting) {
          entry.target.classList.add("scrolled-to");
        } else {
          if (scrollingUp) {
            entry.target.classList.remove("scrolled-to");
          }
        }
      });

      lastScrollY = window.scrollY;
    },
    {
      threshold: 0.7,
    }
  );

  elements.forEach((el) => observer.observe(el));

  function trackNormalizedMouse(callback) {
    window.addEventListener("mousemove", (event) => {
      const normalizedX = event.clientX / window.innerWidth;
      const normalizedY = event.clientY / window.innerHeight;

      callback({ x: normalizedX, y: normalizedY });
    });
  }

  trackNormalizedMouse((mouse) => {
    document.documentElement.style.setProperty("--mouse-x", mouse.x);
    document.documentElement.style.setProperty("--mouse-y", mouse.y);
  });

  function updateRainbow() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clamp = Math.min(Math.max(scrollTop / 400, 0), 1);

    document.documentElement.style.setProperty(
      "--rainbow-animation-ratio",
      clamp
    );
  }

  function updateBackToTopButton() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    let value = 1;

    if (scrollTop > 800) value = 0;

    document.documentElement.style.setProperty(
      "--back-to-top-hide",
      value
    );
  }

  window.addEventListener("scroll", () => {
    updateRainbow();
    updateBackToTopButton();
  });
    window.addEventListener("resize", () => {
    updateRainbow();
    updateBackToTopButton();
  });
  updateRainbow();

  const parallaxElements = document.querySelectorAll("[data-parallax]");

  function updateParallax() {
    const viewportHeight = window.innerHeight;

    parallaxElements.forEach((el) => {
      const ratio = parseFloat(el.dataset.parallax);
      const rotation = parseFloat(el.dataset.rotation) || 0;
      const rect = el.getBoundingClientRect();

      // Only apply when element is at least partially visible
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Normalize progress: 0 when entering, 1 when fully inside
        const distanceIntoView = viewportHeight - rect.top;
        const elementHeight = Math.min(rect.height, viewportHeight);
        const normalizedProgress = Math.min(
          Math.max(distanceIntoView / (viewportHeight + elementHeight), 0),
          1
        );

        // Apply offset based on ratio and normalized progress
        const offset = ratio * normalizedProgress * viewportHeight;
        el.style.translate = `0px ${offset}px`;
        el.style.rotate = `${
          rotation * normalizedProgress * viewportHeight
        }deg`;
      } else {
      }
    });
  }

  window.addEventListener("scroll", updateParallax);
  window.addEventListener("resize", updateParallax); // for responsive safety
  updateParallax(); // initial call
})();
