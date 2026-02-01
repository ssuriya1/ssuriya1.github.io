class Portfolio {
    constructor() {
        this.config = {};
        this.init();
    }

    async init() {
        this.loadTheme();
        await this.loadConfig();
        this.setupContent();
        this.setupAnimations();
        this.setupInteractions();
        this.setupThemeToggle();
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    setupContent() {
        this.updateTitle();
        this.updateNavigation();
        this.updateHero();
        this.updateAbout();
        this.updateSkills();
        this.updateExperience();
        this.updateContact();
    }

    updateTitle() {
        document.title = `${this.config.personal.name} - ${this.config.personal.title}`;
        document.querySelector('.logo-text').textContent = this.config.personal.logo;
        document.getElementById('footer-name').textContent = this.config.personal.name;
    }

    updateNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.innerHTML = this.config.navigation.map(item => 
            `<li><a href="${item.href}" class="nav-link">${item.name}</a></li>`
        ).join('');
    }

    updateHero() {
        const heroTitle = document.querySelector('.hero-title');
        heroTitle.innerHTML = `
            <span class="title-line">Hi, I'm</span>
            <span class="title-line name-highlight">${this.config.personal.name}</span>
        `;
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        heroSubtitle.innerHTML = `
            <span class="typing-container">
                I'm a <span class="typing-text"></span>
            </span>
        `;
        
        this.startTypingAnimation();
        
        const codeContent = document.querySelector('.code-content');
        codeContent.innerHTML = `
            <div class="code-line"><span class="keyword">const</span> <span class="variable">developer</span> = {</div>
            <div class="code-line">  <span class="property">name</span>: <span class="string">'${this.config.personal.name}'</span>,</div>
            <div class="code-line">  <span class="property">skills</span>: [<span class="string">'${this.config.about.skills.Frontend.slice(0,3).join("', '")}'</span>],</div>
            <div class="code-line">  <span class="property">focus</span>: <span class="string">'Angular & Cloud'</span></div>
            <div class="code-line">};</div>
        `;

        // Setup Get In Touch button
        document.getElementById('get-in-touch-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    updateAbout() {
        document.querySelector('.section-title').textContent = this.config.about.title;
        
        const aboutText = document.querySelector('.about-text');
        aboutText.innerHTML = `
            <p>${this.config.about.description}</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-number" data-count="${this.config.about.stats.repositories}">${this.config.about.stats.repositories}</span>
                    <span class="stat-label">Repositories</span>
                </div>
                <div class="stat">
                    <span class="stat-number" data-count="${this.config.about.stats.certifications}">${this.config.about.stats.certifications}</span>
                    <span class="stat-label">Certifications</span>
                </div>
                <div class="stat">
                    <span class="stat-number" data-count="${this.config.about.stats.technologies}">${this.config.about.stats.technologies}</span>
                    <span class="stat-label">Technologies</span>
                </div>
            </div>
        `;
        
        const techOrbit = document.getElementById('tech-orbit');
        techOrbit.innerHTML = this.config.about.techOrbit.map((tech, index) => `
            <div class="tech-icon tech-${index + 1}" style="color: ${tech.color}" title="${tech.name}">
                <i class="${tech.icon}"></i>
            </div>
        `).join('');
    }

    updateSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        skillsGrid.innerHTML = Object.entries(this.config.about.skills).map(([category, skills]) => `
            <div class="skill-category">
                <h3>${category}</h3>
                <div class="skill-items">
                    ${skills.map(skill => `
                        <div class="skill-item">
                            <i class="fas fa-code"></i>
                            <span>${skill}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    updateExperience() {
        const skillsSection = document.querySelector('#skills');
        let experienceSection = document.querySelector('#experience');
        
        if (!experienceSection) {
            experienceSection = document.createElement('section');
            experienceSection.id = 'experience';
            experienceSection.className = 'experience';
            skillsSection.insertAdjacentElement('afterend', experienceSection);
        }
        
        experienceSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <span class="section-number">03</span>
                    <h2 class="section-title">${this.config.experience.title}</h2>
                </div>
                <div class="experience-grid">
                    ${this.config.experience.items.map(item => `
                        <div class="experience-card">
                            <h3>${item.title}</h3>
                            <a href="${item.url}" target="_blank" class="experience-link">
                                <i class="fas fa-external-link-alt"></i> View Certificate
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateContact() {
        document.querySelector('#contact .section-title').textContent = this.config.contact.title;
        
        const contactInfo = document.querySelector('.contact-info');
        contactInfo.innerHTML = `
            <p>Ready to bring your ideas to life? Let's create something amazing together.</p>
            <div class="social-cards">
                ${this.config.contact.social.map(social => `
                    <a href="${social.url}" target="_blank" class="social-card">
                        <i class="${social.icon}"></i>
                        <span>${social.name}</span>
                    </a>
                `).join('')}
            </div>
        `;
        
        const contactForm = document.querySelector('.contact-form');
        contactForm.innerHTML = `
            ${this.config.contact.form.fields.map(field => {
                if (field.type === 'textarea') {
                    return `
                        <div class="form-group">
                            <textarea id="${field.name}" ${field.required ? 'required' : ''}></textarea>
                            <label for="${field.name}">${field.placeholder}</label>
                        </div>
                    `;
                } else {
                    return `
                        <div class="form-group">
                            <input type="${field.type}" id="${field.name}" ${field.required ? 'required' : ''}>
                            <label for="${field.name}">${field.placeholder}</label>
                        </div>
                    `;
                }
            }).join('')}
            <button type="submit" class="btn btn-primary">
                <i class="${this.config.contact.form.submitIcon}"></i> ${this.config.contact.form.submitText}
            </button>
        `;
    }

    startTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        const texts = this.config.personal.typingTexts;
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : this.config.settings.typingSpeed;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = this.config.settings.typingPause;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(type, typeSpeed);
        };
        
        type();
    }

    setupAnimations() {
        this.setupCursor();
        this.setupScrollEffects();
        this.setupObserver();
    }

    setupCursor() {
        const cursorDot = document.querySelector('[data-cursor-dot]');
        const cursorOutline = document.querySelector('[data-cursor-outline]');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX - 4}px`;
            cursorDot.style.top = `${posY - 4}px`;
            
            cursorOutline.animate({
                left: `${posX - 20}px`,
                top: `${posY - 20}px`
            }, { duration: 500, fill: 'forwards' });
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .logo-text, .nav-link, .btn, .social-card, .experience-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Parallax effect
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    setupObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.classList.contains('stats')) {
                        const counters = entry.target.querySelectorAll('.stat-number');
                        counters.forEach(counter => {
                            const target = parseInt(counter.getAttribute('data-count'));
                            this.animateCounter(counter, target);
                        });
                    }
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
        
        const leftElements = document.querySelectorAll('.about-text, .contact-info');
        leftElements.forEach(el => {
            el.classList.add('slide-in-left');
            observer.observe(el);
        });
        
        const rightElements = document.querySelectorAll('.about-image, .contact-form');
        rightElements.forEach(el => {
            el.classList.add('slide-in-right');
            observer.observe(el);
        });
        
        const stats = document.querySelector('.stats');
        if (stats) {
            observer.observe(stats);
        }
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }

    setupInteractions() {
        this.setupNavigation();
        this.setupFormHandling();
        this.setupButtonHandlers();
    }

    setupButtonHandlers() {
        // View Work button
        document.getElementById('view-work-btn').href = this.config.projects.githubUrl;
        document.getElementById('view-work-btn').target = '_blank';
        
        // Get In Touch button
        document.getElementById('get-in-touch-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        // Logo click handler
        document.querySelector('.logo-text').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupFormHandling() {
        document.querySelector('.contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            alert('Thank you for your message! I\'ll get back to you soon.');
            e.target.reset();
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggle(savedTheme);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            this.updateThemeToggle(newTheme);
        });
    }

    updateThemeToggle(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark';
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});