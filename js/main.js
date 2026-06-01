/**
 * Portfolio — main.js
 * ES Module: loads config from Firestore (live), falls back to config.json
 */

import { db } from '../firebase-config.js';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

/* ════════════════════════════════════════════════════════════ */
class Portfolio {
  constructor() {
    this.config        = {};
    this.rafId         = null;
    this.cursorX       = 0;
    this.cursorY       = 0;
    this.cursorDot     = document.querySelector('[data-cursor-dot]');
    this.cursorOutline = document.querySelector('[data-cursor-outline]');
    this.init();
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  async init() {
    this.loadTheme();
    await this.loadConfig();
    this.renderAll();
    this.setupAnimations();
    this.setupInteractions();
    this.setupThemeToggle();
  }

  /* ── Config: Firestore first, fallback config.json ──────── */
  async loadConfig() {
    try {
      const snap = await getDoc(doc(db, 'portfolioConfig', 'main'));
      if (snap.exists()) {
        this.config = snap.data();
        return;
      }
    } catch (err) {
      console.info('Firestore unavailable, using config.json fallback:', err.message);
    }
    try {
      const res = await fetch('config.json');
      this.config = await res.json();
    } catch (err) {
      console.error('Config load failed:', err);
    }
  }

  /* ── Render all sections ────────────────────────────────── */
  renderAll() {
    this.updateTitle();
    this.updateNavigation();
    this.updateHero();
    this.updateAbout();
    this.updateSkills();
    this.updateAISkills();
    this.updateExperience();
    this.updateHighlights();
    this.updateContact();
  }

  /* ── Title / logo ───────────────────────────────────────── */
  updateTitle() {
    const { name, title, logo } = this.config.personal;
    document.title = `${name} — ${title}`;
    document.querySelector('.logo-text').textContent = logo;
  }

  /* ── Navigation ─────────────────────────────────────────── */
  updateNavigation() {
    const menu = document.querySelector('.nav-menu');
    menu.innerHTML = this.config.navigation
      .map(item =>
        `<li><a href="${item.href}" class="nav-link">${item.name}</a></li>`
      ).join('');
  }

  /* ── Hero ───────────────────────────────────────────────── */
  updateHero() {
    const { name, subtitle, typingTexts, resumeUrl } = this.config.personal;
    const githubUrl = this.config.projects?.githubUrl || '#';

    // Title
    document.querySelector('.hero-title').innerHTML =
      `<span class="title-line name-highlight">${name}</span>`;

    // Subtitle
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl) subtitleEl.textContent = subtitle || '';

    // Code window
    document.querySelector('.code-content').innerHTML = `
      <div class="code-line"><span class="keyword">const</span> <span class="variable">engineer</span> <span class="keyword">=</span> {</div>
      <div class="code-line">&nbsp;&nbsp;<span class="property">name</span>: <span class="string">'${name}'</span>,</div>
      <div class="code-line">&nbsp;&nbsp;<span class="property">role</span>: <span class="string">'GenAI / Agentic AI Engineer'</span>,</div>
      <div class="code-line">&nbsp;&nbsp;<span class="property">expertise</span>: [<span class="string">'LangChain'</span>, <span class="string">'Claude API'</span>, <span class="string">'RAG'</span>],</div>
      <div class="code-line">&nbsp;&nbsp;<span class="property">experience</span>: <span class="number">5.8</span>, <span class="comment">// years</span></div>
      <div class="code-line">&nbsp;&nbsp;<span class="property">cloud</span>: [<span class="string">'GCP'</span>, <span class="string">'AWS'</span>, <span class="string">'Azure'</span>]</div>
      <div class="code-line">};</div>
    `;

    // Typing animation
    this.startTypingAnimation(typingTexts);

    // Buttons
    const viewWorkBtn = document.getElementById('view-work-btn');
    if (viewWorkBtn) viewWorkBtn.href = githubUrl;

    const resumeBtn = document.getElementById('download-resume-btn');
    if (resumeBtn && resumeUrl) {
      resumeBtn.href = resumeUrl;
      resumeBtn.setAttribute('download', '');
    }

    document.getElementById('get-in-touch-btn')?.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── About ──────────────────────────────────────────────── */
  updateAbout() {
    const { description, highlights = [], techOrbit } = this.config.about;
    const techCount = this.getTechnologiesCount();

    const statsHTML = highlights.map(h => {
      const val = h.countFromSkills ? techCount : h.value;
      const suf = h.suffix || '';
      return `
        <div class="stat">
          <span class="stat-number" data-count="${val}">${val}</span><span class="stat-suffix">${suf}</span>
          <span class="stat-label">${h.label}</span>
        </div>`;
    }).join('');

    document.querySelector('.about-text').innerHTML = `
      <p>${description}</p>
      <div class="stats">${statsHTML}</div>
    `;

    // Tech orbit icons
    const orbit = document.getElementById('tech-orbit');
    orbit.innerHTML =
      techOrbit.map((t, i) =>
        `<div class="tech-icon tech-${i + 1}" style="color:${t.color}" title="${t.name}">
           <i class="${t.icon}"></i>
         </div>`
      ).join('') +
      `<div class="orbit-center">${this.config.personal.logo}</div>`;
  }

  /* ── Skills ─────────────────────────────────────────────── */
  updateSkills() {
    document.querySelector('.skills-grid').innerHTML =
      Object.entries(this.config.about.skills).map(([cat, skills]) => `
        <div class="skill-category stagger-child">
          <h3>${cat}</h3>
          <div class="skill-items">
            ${skills.map(s => `<div class="skill-chip"><span>${s}</span></div>`).join('')}
          </div>
        </div>
      `).join('');
  }

  /* ── AI Skills ──────────────────────────────────────────── */
  updateAISkills() {
    const ai = this.config.aiSkills;
    if (!ai?.categories?.length) return;

    const secNum = document.querySelector('#ai-skills .section-number');
    if (secNum && ai.sectionNumber) secNum.textContent = ai.sectionNumber;

    const grid = document.getElementById('ai-skills-grid');
    grid.innerHTML = ai.categories.map(cat => `
      <div class="ai-card stagger-child" style="--card-accent:${cat.color}">
        <div class="ai-card-icon" style="background:${cat.color}18; color:${cat.color}">
          <i class="${cat.icon}"></i>
        </div>
        <div class="ai-card-title">${cat.title}</div>
        <ul class="ai-card-items">
          ${cat.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  /* ── Certifications ─────────────────────────────────────── */
  updateExperience() {
    const { title, items, sectionNumber = '04' } = this.config.experience;
    const section = document.querySelector('#certifications');
    if (!section) return;

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-number">${sectionNumber}</span>
          <h2 class="section-title">${title}</h2>
        </div>
        <div class="experience-grid">
          ${items.map(item => `
            <div class="experience-card stagger-child">
              <div class="experience-card-icon">
                <i class="${item.icon || 'fas fa-certificate'}"></i>
              </div>
              <h3>${item.title}</h3>
              ${item.dateEarned ? `<span class="experience-card-date">${item.dateEarned}</span>` : ''}
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="experience-link">
                <i class="fas fa-external-link-alt"></i> View
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ── Technical Highlights ───────────────────────────────── */
  updateHighlights() {
    const cfg = this.config.highlights;
    if (!cfg?.items?.length) return;

    const section = document.querySelector('#highlights');
    if (!section) return;

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-number">${cfg.sectionNumber || '05'}</span>
          <h2 class="section-title">${cfg.title || 'Technical Highlights'}</h2>
          <p class="section-subtitle">Key capabilities and areas of deep expertise</p>
        </div>
        <div class="highlights-grid">
          ${cfg.items.map(item => `
            <div class="highlight-card stagger-child" style="--highlight-color:${item.color}">
              <div class="highlight-icon" style="background:${item.color}18; color:${item.color}; border-color:${item.color}30">
                <i class="${item.icon}"></i>
              </div>
              <div class="highlight-body">
                <div class="highlight-title">${item.title}</div>
                <p class="highlight-desc">${item.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ── Contact ────────────────────────────────────────────── */
  updateContact() {
    const { title, tagline, social, form, sectionNumber = '06' } = this.config.contact;

    const secNum = document.querySelector('#contact .section-number');
    if (secNum && sectionNumber) secNum.textContent = sectionNumber;

    const titleEl = document.querySelector('#contact .section-title');
    if (titleEl) titleEl.textContent = title;

    document.querySelector('.contact-info').innerHTML = `
      <p class="contact-tagline">${tagline || ''}</p>
      <div class="social-cards">
        ${social.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-card">
            <i class="${s.icon}"></i>
            <span>${s.name}</span>
          </a>`).join('')}
      </div>
    `;

    document.querySelector('.contact-form').innerHTML = `
      ${form.fields.map(f => {
        if (f.type === 'textarea') {
          return `<div class="form-group">
            <textarea id="${f.name}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''}></textarea>
            <label for="${f.name}">${f.placeholder}</label>
          </div>`;
        }
        return `<div class="form-group">
          <input type="${f.type}" id="${f.name}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''}>
          <label for="${f.name}">${f.placeholder}</label>
        </div>`;
      }).join('')}
      <div class="form-message" id="form-message"></div>
      <button type="submit" class="btn btn-primary">
        <i class="${form.submitIcon}"></i> ${form.submitText}
      </button>
    `;
  }

  /* ── Helpers ────────────────────────────────────────────── */
  getTechnologiesCount() {
    return Object.values(this.config.about.skills)
      .reduce((acc, arr) => acc + arr.length, 0);
  }

  /* ── Typing animation ───────────────────────────────────── */
  startTypingAnimation(texts = []) {
    if (!texts.length) return;
    const el = document.querySelector('.typing-text');
    if (!el) return;

    let ti = 0, ci = 0, deleting = false;

    const tick = () => {
      const current = texts[ti];
      if (deleting) {
        el.textContent = current.substring(0, ci - 1);
        ci--;
      } else {
        el.textContent = current.substring(0, ci + 1);
        ci++;
      }

      let delay = deleting ? 40 : (this.config.settings?.typingSpeed ?? 100);
      if (!deleting && ci === current.length) {
        delay = this.config.settings?.typingPause ?? 2500;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        ti = (ti + 1) % texts.length;
      }

      setTimeout(tick, delay);
    };
    tick();
  }

  /* ── Counter animation ──────────────────────────────────── */
  animateCounter(el, target) {
    let current = 0;
    const inc = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current);
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }

  /* ── Animations setup ───────────────────────────────────── */
  setupAnimations() {
    this.setupCursor();
    this.setupScrollEffects();
    this.setupObserver();
  }

  /* ── Cursor (rAF-based for smoothness) ──────────────────── */
  setupCursor() {
    if (!this.cursorDot || !this.cursorOutline) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    let outlineX = 0, outlineY = 0;

    const render = () => {
      this.cursorDot.style.left   = `${this.cursorX}px`;
      this.cursorDot.style.top    = `${this.cursorY}px`;

      outlineX += (this.cursorX - outlineX) * 0.18;
      outlineY += (this.cursorY - outlineY) * 0.18;
      this.cursorOutline.style.left = `${outlineX}px`;
      this.cursorOutline.style.top  = `${outlineY}px`;

      this.rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', e => {
      this.cursorX = e.clientX;
      this.cursorY = e.clientY;
    });

    render();

    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .skill-chip, .experience-card, .highlight-card, .ai-card, .social-card')) {
        this.cursorOutline.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .skill-chip, .experience-card, .highlight-card, .ai-card, .social-card')) {
        this.cursorOutline.classList.remove('hover');
      }
    });
  }

  /* ── Scroll effects ─────────────────────────────────────── */
  setupScrollEffects() {
    const nav         = document.querySelector('.nav');
    const progressBar = document.getElementById('scroll-progress');
    const backToTop   = document.getElementById('back-to-top');
    const navLinks    = document.querySelectorAll('.nav-link');

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) progressBar.style.width = `${scrollPct}%`;
      nav?.classList.toggle('scrolled', scrollTop > 20);
      backToTop?.classList.toggle('visible', scrollTop > 300);

      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(sec => {
        if (scrollTop >= sec.offsetTop - 100) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Intersection Observer ──────────────────────────────── */
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');

        // Counter animation on stats block
        if (el.classList.contains('stats') || el.closest?.('.stats')) {
          el.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count') || '0', 10);
            this.animateCounter(counter, target);
          });
        }

        observer.unobserve(el); // fire once
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('section').forEach(sec => {
      sec.classList.add('fade-in');
      observer.observe(sec);
    });

    document.querySelectorAll('.about-text, .contact-info').forEach(el => {
      el.classList.add('slide-in-left');
      observer.observe(el);
    });
    document.querySelectorAll('.about-image, .contact-form').forEach(el => {
      el.classList.add('slide-in-right');
      observer.observe(el);
    });

    const stats = document.querySelector('.stats');
    if (stats) observer.observe(stats);

    // Stagger grids
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 80);
        });
        staggerObserver.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

    document.querySelectorAll(
      '.skills-grid, .ai-skills-grid, .experience-grid, .highlights-grid'
    ).forEach(grid => staggerObserver.observe(grid));
  }

  /* ── Interactions ───────────────────────────────────────── */
  setupInteractions() {
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupFormHandling();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.closeMobileMenu();
      });
    });

    document.querySelector('.logo-text')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-container')) this.closeMobileMenu();
    });
  }

  closeMobileMenu() {
    document.getElementById('nav-menu')?.classList.remove('open');
    const toggle = document.getElementById('mobile-menu-toggle');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* ── Contact form → Firestore ───────────────────────────── */
  setupFormHandling() {
    const form  = document.querySelector('.contact-form');
    const msgEl = document.getElementById('form-message');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name    = document.getElementById('name')?.value.trim();
      const email   = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        this.showFormMsg(msgEl, 'error', 'Please fill in all fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      try {
        await addDoc(collection(db, 'contacts'), {
          name, email, message,
          timestamp: serverTimestamp(),
          source: 'portfolio'
        });
        this.showFormMsg(msgEl, 'success', '✓ Message sent! I\'ll get back to you soon.');
        form.reset();
      } catch (err) {
        console.error('Form submit error:', err);
        this.showFormMsg(msgEl, 'error', 'Something went wrong. Please try emailing directly.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="${this.config.contact?.form?.submitIcon || 'fas fa-paper-plane'}"></i> ${this.config.contact?.form?.submitText || 'Send Message'}`;
      }
    });
  }

  showFormMsg(el, type, text) {
    if (!el) return;
    el.className = `form-message ${type}`;
    el.innerHTML = text;
    el.style.display = 'flex';
    setTimeout(() => { el.style.display = 'none'; }, 6000);
  }

  /* ── Theme ──────────────────────────────────────────────── */
  loadTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('portfolio-theme') || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeToggle(saved);
  }

  setupThemeToggle() {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      this.updateThemeToggle(next);
    });
  }

  updateThemeToggle(theme) {
    const btn  = document.getElementById('theme-toggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    if (theme === 'dark') {
      icon.className   = 'fas fa-sun';
      text.textContent = 'Light';
    } else {
      icon.className   = 'fas fa-moon';
      text.textContent = 'Dark';
    }
  }
}

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => new Portfolio());
