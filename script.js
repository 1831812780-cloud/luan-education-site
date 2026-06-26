const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const numberItems = document.querySelectorAll("[data-count]");
const heroSlides = document.querySelectorAll(".hero-slide");

const setHeaderState = () => {
  header.dataset.elevated = String(window.scrollY > 12);
};

const closeMobileNav = () => {
  mobileNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

window.closeMobileNav = closeMobileNav;

window.addEventListener("scroll", setHeaderState);
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileNav();
  }
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const formatNumber = (value) => {
  if (value >= 100000) return "100000+";
  return `${value}+`;
};

const animateNumber = (element) => {
  const target = Number(element.dataset.count);
  const isYear = element.dataset.type === "year";
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = isYear ? String(value) : formatNumber(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = isYear ? String(target) : formatNumber(target);
    }
  };

  requestAnimationFrame(tick);
};

const numberObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        numberObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

numberItems.forEach((item) => numberObserver.observe(item));

let activeSlide = 0;

if (heroSlides.length > 1) {
  const prefersMobileHero = window.matchMedia("(max-width: 720px)").matches;
  const heroImageKey = prefersMobileHero ? "mobileSrc" : "desktopSrc";

  const loadHeroSlide = (index) => {
    const slide = heroSlides[index];
    if (!slide || slide.dataset.loaded === "true") return;

    const imageUrl = slide.dataset[heroImageKey] || slide.dataset.desktopSrc;
    if (!imageUrl) return;

    if (index === 0) {
      slide.style.backgroundImage = `url("${imageUrl}")`;
      slide.dataset.loaded = "true";
      return;
    }

    const image = new Image();
    image.onload = () => {
      slide.style.backgroundImage = `url("${imageUrl}")`;
      slide.dataset.loaded = "true";
    };
    image.src = imageUrl;
  };

  loadHeroSlide(0);

  setInterval(() => {
    heroSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    loadHeroSlide(activeSlide);
    heroSlides[activeSlide].classList.add("is-active");
    window.setTimeout(() => {
      loadHeroSlide((activeSlide + 1) % heroSlides.length);
    }, 900);
  }, 4000);

  window.setTimeout(() => {
    loadHeroSlide(1);
  }, 1200);
}
