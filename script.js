console.log("Anasse Anida Final Anime Portfolio Loaded");

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");

    if (loader) {
      loader.classList.add("hide");
    }
  }, 900);
});

// Cursor Glow
const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;

  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade");
    }
  });
}, {
  threshold: 0.18
});

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Active Nav
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 180;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Rain Effect
const rainContainer = document.querySelector(".rain");

if (rainContainer) {
  for (let i = 0; i < 55; i++) {
    const drop = document.createElement("span");

    drop.className = "drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.6 + Math.random() * 0.8}s`;
    drop.style.animationDelay = `${Math.random() * 4}s`;
    drop.style.opacity = `${0.15 + Math.random() * 0.35}`;

    rainContainer.appendChild(drop);
  }
}

// Sakura Effect
const sakuraContainer = document.querySelector(".sakura");

if (sakuraContainer) {
  for (let i = 0; i < 32; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${7 + Math.random() * 9}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.opacity = `${0.35 + Math.random() * 0.55}`;

    sakuraContainer.appendChild(petal);
  }
}

// Stars Effect
const starsContainer = document.querySelector(".stars");

if (starsContainer) {
  for (let i = 0; i < 70; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;

    starsContainer.appendChild(star);
  }
}

// Mouse Parallax
const heroImage = document.querySelector(".hero-visual img");
const moon = document.querySelector(".moon");

document.addEventListener("mousemove", (event) => {
  if (!heroImage || !moon) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 24;
  const y = (event.clientY / window.innerHeight - 0.5) * 24;

  heroImage.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
  moon.style.transform = `translate(${-x}px, ${-y}px)`;
});