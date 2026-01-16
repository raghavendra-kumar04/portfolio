// Smooth scrolling for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu after click
      navList.classList.remove('open');
    }
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle?.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');

function updateThemeIcon() {
  if (root.classList.contains('light')) {
    themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
  } else {
    themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
  }
}
updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  updateThemeIcon();
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
revealEls.forEach(el => observer.observe(el));

// Simple contact form validation (front-end only)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    // Clear previous
    form.querySelectorAll('.error').forEach(el => el.textContent = '');

    if (!name.value.trim()) {
      name.nextElementSibling.textContent = 'Please enter your name';
      ok = false;
    }

    if (!email.value.trim()) {
      email.nextElementSibling.textContent = 'Please enter your email';
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.nextElementSibling.textContent = 'Please enter a valid email';
      ok = false;
    }

    if (!message.value.trim()) {
      message.nextElementSibling.textContent = 'Please enter a message';
      ok = false;
    }

    if (ok) {
      form.reset();
      alert('Thanks! Your message has been sent.');
    }
  });
}

// Current year
document.getElementById('year').textContent = new Date().getFullYear();
