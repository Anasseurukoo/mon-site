console.log("Anasse Anida V1.1 Loaded");

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 900);
});

// Reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade");
    }
  });
}, {
  threshold: 0.18
});

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

// Active nav
const sections = document.querySelectorAll(".section");
const links = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 180;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  links.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Rain
const rainContainer = document.querySelector(".rain");

for (let i = 0; i < 55; i++) {
  const drop = document.createElement("span");
  drop.className = "drop";
  drop.style.left = `${Math.random() * 100}%`;
  drop.style.animationDuration = `${0.6 + Math.random() * 0.8}s`;
  drop.style.animationDelay = `${Math.random() * 4}s`;
  drop.style.opacity = `${0.15 + Math.random() * 0.35}`;
  rainContainer.appendChild(drop);
}

// Sakura
const sakuraContainer = document.querySelector(".sakura");

for (let i = 0; i < 28; i++) {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${7 + Math.random() * 9}s`;
  petal.style.animationDelay = `${Math.random() * 8}s`;
  petal.style.opacity = `${0.35 + Math.random() * 0.55}`;
  sakuraContainer.appendChild(petal);
}

// Parallax hero image
const heroImage = document.querySelector(".hero-visual img");
const moon = document.querySelector(".moon");

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  heroImage.style.transform = `translate(${x}px, ${y}px)`;
  moon.style.transform = `translate(${-x}px, ${-y}px)`;
});