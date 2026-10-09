/**
 * Raghavendra Kumar Budati — Advanced Interactive Portfolio Controller
 * Features: Ambient Particle Canvas, 3D Perspective Tilt, Project Filtering & Modals,
 * Dynamic Typing, Animated Metric Counters, Toast System, Active Scrollspy & Keyboard Shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypingEffect();
  init3DTilt();
  initStatsCounters();
  initProjectSystem();
  initSkillsFilter();
  initContactFormAndCopy();
  initThemeManager();
  initScrollSpyAndNavigation();
  initCursorGlow();
  initKeyboardShortcuts();
});

/* --------------------------------------------------------------------------
   1. Ambient Interactive Particle Canvas
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };
  let particles = [];

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive repel / soft attract
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = (dx / distance) * force * this.density * 0.4;
          let directionY = (dy / distance) * force * this.density * 0.4;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let opacity = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  initParticles();
  animate();
}

/* --------------------------------------------------------------------------
   2. Dynamic Text Typing Effect
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = [
    'Full-Stack Web Applications',
    'Intelligent AI & ML Models',
    'High-Performance Backends',
    'Automated Workflow Systems',
    'Scalable Cloud Architectures'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. 3D Perspective Tilt on Cards
   -------------------------------------------------------------------------- */
function init3DTilt() {
  // Only enable on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Animated Metric Stats Counters
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const step = Math.max(Math.floor(duration / target), 20);
          let count = 0;
          const inc = target / (duration / step);

          const timer = setInterval(() => {
            count += inc;
            if (count >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(count);
            }
          }, step);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.hero-stats-container');
  if (statsContainer) observer.observe(statsContainer);
}

/* --------------------------------------------------------------------------
   5. Interactive Project Data, Filtering & Modal System
   -------------------------------------------------------------------------- */
const PROJECT_DATABASE = {
  campusloop: {
    title: 'CampusLoop',
    category: 'Full-Stack Web Platform',
    badge: 'Active Project',
    summary: 'A comprehensive campus community & collaboration network engineered to streamline student-faculty engagement, club events, peer-to-peer networking, and academic resource exchange.',
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs'],
    features: [
      'Interactive feed for university announcements, student queries, and club events.',
      'Real-time academic resource repository with categorization and search.',
      'Peer networking channels for study groups and collaborative hackathons.',
      'Role-based access management with secure JWT authentication and responsive UI.'
    ],
    github: 'https://github.com/raghavendra-kumar04',
    live: '#'
  },
  emailautomation: {
    title: 'Email Automation System',
    category: 'Automation & Workflow Pipeline',
    badge: 'Completed System',
    summary: 'A robust email automation engine designed for mass personalized outreach, scheduled communications, dynamic HTML template rendering, and delivery tracking.',
    technologies: ['Node.js', 'Python', 'Nodemailer / SMTP', 'HTML5 Email Templates', 'Cron Jobs', 'JSON Parser'],
    features: [
      'Configurable automated scheduling and batch dispatching with rate-limiting.',
      'Dynamic variable replacement for high-touch personalized email campaigns.',
      'Delivery status logging with error recovery and bounce notification handling.',
      'Responsive multi-client email template engine tested across major providers.'
    ],
    github: 'https://github.com/raghavendra-kumar04',
    live: '#'
  },
  media2markdown: {
    title: 'Media2Markdown Engine',
    category: 'Backend Processing & AI Tools',
    badge: 'Active Engine',
    summary: 'A high-throughput multimedia transformation backend built with FastAPI and Python, designed to parse and convert various multimedia formats into structured, clean Markdown.',
    technologies: ['FastAPI', 'Python 3.11', 'Uvicorn', 'Async Workers', 'Temp File Lifecycle', 'REST API'],
    features: [
      'Asynchronous file processing with strict payload limits and cleanup schedulers.',
      'Structured conversion of rich documents and media metadata into standardized Markdown.',
      'Automated temporary workspace management with TTL expiration.',
      'Interactive OpenAPI / Swagger documentation and robust error handling.'
    ],
    github: 'https://github.com/raghavendra-kumar04',
    live: '#'
  },
  co2emission: {
    title: 'Prediction of CO₂ Emission',
    category: 'Machine Learning & Predictive Analytics',
    badge: 'Internship Project • R² 0.98',
    summary: 'A machine learning regression pipeline built during internship that accurately predicts national and regional carbon emission levels based on country-specific socio-economic and industrial parameters.',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib / Seaborn', 'Jupyter Notebook'],
    features: [
      'Achieved a strong cross-validated average R² score of 0.98 across multiple test folds.',
      'Comprehensive exploratory data analysis (EDA) and feature correlation matrix evaluation.',
      'Outlier detection, data normalization, and feature importance analysis.',
      'Robust model generalization to unseen multinational datasets.'
    ],
    github: 'https://github.com/raghavendra-kumar04/carbon_emission_prediction.git',
    live: '#'
  },
  fakenews: {
    title: 'Fake News Detector',
    category: 'NLP & Machine Learning Classification',
    badge: 'Completed • 99% Accuracy',
    summary: 'An NLP-driven supervised machine learning classifier utilizing the Random Forest algorithm to evaluate and predict the authenticity of news articles in real-time.',
    technologies: ['Python', 'Random Forest Classifier', 'NLP / NLTK', 'TF-IDF Vectorization', 'Flask', 'HTML/CSS/JS'],
    features: [
      'Attained a 99% accuracy rate in differentiating legitimate news from deceptive text.',
      'Natural Language Processing pipeline featuring tokenization, lemmatization, and stopword removal.',
      'Interactive web interface for instant text paste and real-time authenticity scoring.',
      'High precision and recall metrics across balanced news verification corpora.'
    ],
    github: 'https://github.com/raghavendra-kumar04/fake_news_detector.git',
    live: '#'
  }
};

function initProjectSystem() {
  // Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('show'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Project Details Modal
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const detailBtns = document.querySelectorAll('.btn-details');

  function openProjectModal(projectId) {
    const proj = PROJECT_DATABASE[projectId];
    if (!proj || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-cat-tag">${proj.category}</span>
        <h2 class="modal-proj-title">${proj.title}</h2>
        <div class="modal-tech-pills">
          ${proj.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <p class="body-text">${proj.summary}</p>

      <h3 class="modal-section-title">Key Engineering Highlights</h3>
      <ul class="modal-feature-list">
        ${proj.features.map(f => `<li><i class='bx bx-check-circle'></i><span>${f}</span></li>`).join('')}
      </ul>

      <div class="modal-action-row">
        <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class='bx bxl-github'></i>
          <span>View Source Code</span>
        </a>
        <button class="btn btn-glass" onclick="closeProjectModal()">
          <span>Close Details</span>
        </button>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  window.closeProjectModal = function() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  detailBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);

  modal?.addEventListener('click', e => {
    if (e.target === modal) closeProjectModal();
  });
}

/* --------------------------------------------------------------------------
   6. Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillBoxes = document.querySelectorAll('.skill-box');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCat = tab.getAttribute('data-skill-tab');

      skillBoxes.forEach(box => {
        const boxCat = box.getAttribute('data-skill-cat');
        if (targetCat === 'all' || boxCat === targetCat) {
          box.classList.remove('hidden');
        } else {
          box.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form & Copy to Clipboard
   -------------------------------------------------------------------------- */
function initContactFormAndCopy() {
  // Copy Email Buttons
  const copyButtons = document.querySelectorAll('.copy-email-btn, .copy-small-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const email = 'raghavendrakumarbudati@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  });

  // Contact Form Validation & Submission
  const form = document.getElementById('contactForm');
  const successOverlay = document.getElementById('formSuccessOverlay');
  const resetBtn = document.getElementById('resetFormBtn');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');

      // Clear errors
      [nameError, emailError, messageError].forEach(el => {
        if (el) el.textContent = '';
      });

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email.';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      }

      if (isValid) {
        // Mock sending feedback
        const submitBtn = document.getElementById('submitBtn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Sending...";

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          successOverlay?.classList.add('active');
          showToast('Message sent successfully! Thank you.');
        }, 800);
      }
    });

    resetBtn?.addEventListener('click', () => {
      form.reset();
      successOverlay?.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   8. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class='bx bx-check-circle'></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

/* --------------------------------------------------------------------------
   9. Theme Manager (Dark / Light Theme with Persistence)
   -------------------------------------------------------------------------- */
function initThemeManager() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';

  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark 🌙' : 'Light ☀️'} mode`);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' 
      ? "<i class='bx bx-sun'></i>" 
      : "<i class='bx bx-moon'></i>";
  }
}

/* --------------------------------------------------------------------------
   10. Scroll Spy, Reveal on Scroll & Back to Top
   -------------------------------------------------------------------------- */
function initScrollSpyAndNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTop');

  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navList?.classList.toggle('open');
  });

  // In-page smooth scrolling & close mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        targetSection?.scrollIntoView({ behavior: 'smooth' });
        navList?.classList.remove('open');
      }
    });
  });

  // Back to top
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Active section scroll spy & back-to-top visibility
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;

    // Back to top visibility
    if (window.scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }

    // Scroll spy
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Update Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   11. Custom Cursor Glow
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow || window.matchMedia('(pointer: coarse)').matches) return;

  cursorGlow.classList.add('active');

  window.addEventListener('mousemove', e => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

/* --------------------------------------------------------------------------
   12. Keyboard Shortcuts
   -------------------------------------------------------------------------- */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    // Ignore if user is typing in form inputs
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 't' || e.key === 'T') {
      document.getElementById('themeToggle')?.click();
    } else if (e.key === 'p' || e.key === 'P') {
      document.querySelector('a[href="#projects"]')?.click();
    } else if (e.key === 'c' || e.key === 'C') {
      document.querySelector('a[href="#contact"]')?.click();
    } else if (e.key === 'Escape') {
      window.closeProjectModal?.();
      document.getElementById('navList')?.classList.remove('open');
    }
  });
}
