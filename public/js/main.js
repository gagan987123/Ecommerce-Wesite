const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

// Function to show a specific slide
function showSlide(n) {
  slides.forEach((slide, index) => {
    slide.style.display = "none";
    dots[index].classList.remove("active");
  });
  slides[n].style.display = "block";
  dots[n].classList.add("active");
}

// Show the initial slide
showSlide(currentSlide);

// Function to move to the next or previous slide
function nextSlide(n) {
  currentSlide += n;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  showSlide(currentSlide);
}

// Auto-slide function
function autoSlide() {
  nextSlide(1);
}

// Set the auto-slide interval (change slides every 3 seconds)
setInterval(autoSlide, 3000);

// Add event listeners for manual controls
document
  .getElementById("left-arrow")
  .addEventListener("click", () => nextSlide(-1));
document
  .getElementById("right-arrow")
  .addEventListener("click", () => nextSlide(1));
