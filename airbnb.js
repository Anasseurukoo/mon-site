const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    const image = button.querySelector("img");
    lightboxImage.src = image?.currentSrc || image?.src || "";
    lightboxImage.alt = image?.alt || "Aperçu du projet Airbnb";
    lightbox.showModal();
  });
});

closeButton?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.getElementById("year").textContent = new Date().getFullYear();
