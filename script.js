// Mobile Navigation Toggle
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}
function closeMenu() {
  document.getElementById("navLinks").classList.remove("open");
}

// Set Dynamic Copyright Year
document.getElementById("year").textContent = new Date().getFullYear();

// Header Scroll & Scroll-to-Top Button Visibility
const header = document.getElementById("mainHeader");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const progressBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (scrollY > 50) {
    header.classList.add("scrolled");
    scrollTopBtn.classList.add("visible");
  } else {
    header.classList.remove("scrolled");
    scrollTopBtn.classList.remove("visible");
  }

  // Scroll Progress Bar Update
  if (docHeight > 0) {
    const progress = (scrollY / docHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  // Dynamic Navigation Highlight
  const sections = document.querySelectorAll("main section");
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll("nav a").forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === "#" + id) {
          a.classList.add("active");
        }
      });
    }
  });
});

// Dark/Light Mode Switcher
const themeToggleBtn = document.getElementById("themeToggle");
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀️";
  }
});

// Intersection Observer for Scroll Reveals & Counters
let counted = false;
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      
      // Animate Stats when in view
      if (!counted && entry.target.querySelector(".stat-number")) {
        startCounters();
        counted = true;
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

function startCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = target / 50;
    const updateCount = () => {
      count += speed;
      if (count < target) {
        counter.textContent = Math.ceil(count) + "+";
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target + "+";
      }
    };
    updateCount();
  });
}

// Lightbox Functionality
const lightbox = document.getElementById("imageLightbox");
const lightboxImg = document.getElementById("lightboxImg");

function openLightbox(item) {
  const img = item.querySelector("img");
  lightboxImg.src = img.src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Gallery Filtering
function filterGallery(category, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const items = document.querySelectorAll(".gallery-item");
  items.forEach(item => {
    if (category === "all" || item.getAttribute("data-cat") === category) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Testimonials Carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".test-dot");

function setSlide(idx) {
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = idx;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

let carouselInterval = setInterval(() => {
  let next = (currentSlide + 1) % slides.length;
  setSlide(next);
}, 5000);

document.querySelector(".testimonial-carousel-wrap").addEventListener("mouseenter", () => clearInterval(carouselInterval));
document.querySelector(".testimonial-carousel-wrap").addEventListener("mouseleave", () => {
  carouselInterval = setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    setSlide(next);
  }, 5000);
});

// FAQ Accordion Toggle
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle("active");
}

// Form Submission Handling
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const btn = this.querySelector("button[type='submit']");
  const originalText = btn.textContent;
  btn.textContent = "Sending Enquiry...";
  btn.disabled = true;

  const formData = new FormData(this);

  fetch(this.action, {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      formStatus.className = "form-status success";
      formStatus.textContent = "Thank you! Your enquiry has been received. We will get back to you shortly.";
      contactForm.reset();
    } else {
      formStatus.className = "form-status error";
      formStatus.textContent = "Oops! There was a problem sending your message. Please try again or WhatsApp us.";
    }
  }).catch(() => {
    formStatus.className = "form-status error";
    formStatus.textContent = "Network error. Please try again later or reach us directly via WhatsApp.";
  }).finally(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  });
});