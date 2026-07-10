const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
      setTimeout(() => loader && loader.classList.add("hide"), 650);
    });

    const cursor = document.getElementById("cursorGlow");
    document.addEventListener("mousemove", (e) => {
      if (!cursor) return;
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    const stars = document.getElementById("stars");
    if (stars) {
      for (let i = 0; i < 105; i++) {
        const s = document.createElement("span");
        s.className = "star";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = Math.random() * 4 + "s";
        s.style.animationDuration = 2.4 + Math.random() * 3.2 + "s";
        stars.appendChild(s);
      }
    }

    const sakura = document.getElementById("sakura");
    if (sakura) {
      for (let i = 0; i < 42; i++) {
        const p = document.createElement("span");
        p.className = "petal";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = 8 + Math.random() * 12 + "s";
        p.style.animationDelay = Math.random() * 10 + "s";
        p.style.opacity = 0.25 + Math.random() * 0.55;
        sakura.appendChild(p);
      }
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    const links = document.querySelectorAll(".navlinks a");
    const sections = document.querySelectorAll("main section[id]");
    function setActive() {
      let current = "home";
      sections.forEach(section => {
        const top = section.offsetTop - 160;
        if (scrollY >= top) current = section.id;
      });
      links.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    }
    window.addEventListener("scroll", setActive);
    setActive();

    document.querySelectorAll("#cvButton, #cvButton2").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("CV مازال ما تضفش. من بعد نحطو cv.pdf ونربطو هاد الزر.");
      });
    });

    // V5: image names expected in /image/: profile-photo.jpg, projects-banner.jpg, timeline-banner.jpg, lab-banner.jpg, project-airbnb.jpg, project-bbva.jpg, project-binary.jpg, project-devops.jpg, project-ui.jpg, project-ai.jpg
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const mail = "mailto:ouzoumarta@icloud.com?subject=Contact depuis le portfolio Anida&body=Bonjour Anasse,%0D%0A%0D%0AJe vous contacte depuis votre portfolio.";
        window.location.href = mail;
      });
    }

// Lightweight project filter visual state.
document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
  });
});

// Prevent placeholder links from jumping to the top.
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
