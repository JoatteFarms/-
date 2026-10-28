(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const backToTop = document.querySelector("#back-to-top");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  // Reveal sections gently as they enter the viewport; content remains visible if JS is unavailable.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".intro-copy, .intro-photo, .section-heading, .value-card, .crop-card, .paddy-content, .story-card, .channel-cta, .vision-inner, .contact-panel"
    );
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      if (element.matches(".value-card, .crop-card, .story-card")) {
        element.style.transitionDelay = `${(index % 3) * 90}ms`;
      }
    });
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach((element) => observer.observe(element));
  }


  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        menuButton.focus();
      }
    });
  }

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
