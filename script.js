let introScreen = document.getElementById("introScreen");
let introSkip = document.getElementById("introSkip");
let introVideo = document.getElementById("introVideo");
const replayIntro = document.getElementById("replayIntro");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const siteHeader = document.getElementById("siteHeader");
const petals = document.getElementById("petals");
const year = document.getElementById("year");

let introTimer;
let introFadeTimer;

function hideIntro() {
  if (!introScreen || introScreen.classList.contains("is-hidden")) return;
  introScreen.classList.add("is-hidden");
  introScreen.classList.remove("is-exiting");
  introScreen.setAttribute("aria-hidden", "true");
  document.body.classList.remove("intro-active");
  introVideo?.pause();
  window.clearTimeout(introTimer);
  window.clearTimeout(introFadeTimer);
}

function playIntro() {
  if (!introScreen || !introVideo) return;
  window.clearTimeout(introTimer);
  window.clearTimeout(introFadeTimer);
  document.body.classList.add("intro-active");
  introScreen.classList.remove("is-hidden");
  introScreen.classList.remove("is-exiting");
  introScreen.setAttribute("aria-hidden", "false");
  introVideo.currentTime = 0;
  introVideo.play().catch(hideIntro);
  introFadeTimer = window.setTimeout(() => introScreen.classList.add("is-exiting"), 5150);
  introTimer = window.setTimeout(hideIntro, 6200);
}

if (introScreen && introVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  playIntro();
} else {
  hideIntro();
}

introSkip?.addEventListener("click", hideIntro);
introVideo?.addEventListener("ended", hideIntro);
introVideo?.addEventListener("error", hideIntro);
replayIntro?.addEventListener("click", playIntro);

function closeMenu() {
  menuButton?.classList.remove("is-open");
  nav?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Ouvrir le menu");
}

menuButton?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", Boolean(open));
  menuButton.setAttribute("aria-expanded", String(Boolean(open)));
  menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

function updateHeader() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

function setActiveSection() {
  const marker = window.scrollY + 180;
  let activeId = "";

  sections.forEach((section) => {
    if (marker >= section.offsetTop) activeId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

window.addEventListener("scroll", setActiveSection, { passive: true });
setActiveSection();

if (petals && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${10 + Math.random() * 12}s`;
    petal.style.animationDelay = `${-Math.random() * 18}s`;
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.opacity = String(0.14 + Math.random() * 0.28);
    fragment.appendChild(petal);
  }

  petals.appendChild(fragment);
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}
