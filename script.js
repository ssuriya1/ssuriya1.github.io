// Load configuration
let config = {};

async function loadConfig() {
    try {
        const response = await fetch('./config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        console.log('Config loaded:', config);
        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        // Fallback config
        config = {
            personal: {
                name: "Suriya S",
                logo: "SS",
                title: "Portfolio",
                typingTexts: ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Problem Solver"]
            },
            navigation: [
                { name: "Home", href: "#hero" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Contact", href: "#contact" }
            ],
            about: {
                title: "About Me",
                description: "I'm a passionate frontend developer who transforms ideas into stunning, interactive web experiences. With expertise in modern frameworks and a keen eye for design, I create digital solutions that not only look amazing but perform flawlessly across all devices.",
                skills: {
                    "Frontend": ["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS"],
                    "Design": ["Figma", "Adobe XD", "Photoshop", "UI/UX Design", "Prototyping"],
                    "Tools": ["Git", "Webpack", "Vite", "GSAP", "Three.js"]
                }
            },
            experience: {
                title: "Certifications",
                items: [
                    { title: "GitHub Foundations", url: "#" }
                ]
            },
            projects: {
                title: "Featured Projects",
                github: { username: "ssuriya1", initialCount: 4 }
            },
            contact: {
                title: "Let's Connect",
                social: [{ name: "LinkedIn", url: "#", icon: "fab fa-linkedin" }],
                form: {
                    fields: [
                        { name: "name", type: "text", placeholder: "Your Name", required: true },
                        { name: "email", type: "email", placeholder: "Your Email", required: true },
                        { name: "message", type: "textarea", placeholder: "Your Message", required: true }
                    ],
                    submitText: "Send Message",
                    submitIcon: "fas fa-paper-plane"
                }
            },
            settings: { typingSpeed: 100, typingPause: 3000 }
        };
        return config;
    }
}

// Initialize page content from config
function initializePageContent() {
    // Set page title
    document.getElementById('page-title').textContent = `${config.personal.name} - ${config.personal.title}`;
    
    // Set navigation
    const navLogo = document.getElementById('nav-logo');
    const navLinks = document.getElementById('nav-links');
    
    navLogo.textContent = config.personal.logo;
    navLinks.innerHTML = config.navigation.map(item => 
        `<a href="${item.href}">${item.name}</a>`
    ).join('');
    
    // Set hero content
    document.getElementById('hero-name').textContent = config.personal.name;
    document.getElementById('hero-description').textContent = 'Crafting pixel-perfect, interactive web experiences that captivate users and drive business growth';
    
    // Initialize sections
    initializeAboutSection();
    initializeExperienceSection();
    initializeContactSection();
    
    // Set projects title
    document.getElementById('projects-title').textContent = config.projects.title;
}

function initializeAboutSection() {
    const aboutText = document.getElementById('about-text');
    const skillsShowcase = document.getElementById('skills-showcase');
    
    aboutText.innerHTML = `<p>${config.about.description}</p>`;
    
    const skillsHtml = Object.entries(config.about.skills).map(([category, skills]) => `
        <div class="skill-category">
            <h3>${category}</h3>
            <div class="skill-list">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    skillsShowcase.innerHTML = skillsHtml;
}

function initializeExperienceSection() {
    const experienceGrid = document.getElementById('experience-grid');
    
    const experienceHtml = config.experience.items.map(item => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="experience-card">
            <h3>${item.title}</h3>
            ${item.description ? `<p>${item.description}</p>` : ''}
            ${item.dateEarned ? `<div class="experience-date">${new Date(item.dateEarned).toLocaleDateString()}</div>` : ''}
        </a>
    `).join('');
    
    experienceGrid.innerHTML = experienceHtml;
}

function initializeContactSection() {
    const contactMethods = document.getElementById('contact-methods');
    const contactFormContainer = document.getElementById('contact-form-container');
    
    const socialHtml = config.contact.social.map(social => `
        <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="contact-method">
            <i class="${social.icon}"></i>
            <span>${social.name}</span>
        </a>
    `).join('');
    
    contactMethods.innerHTML = socialHtml;
    
    const formHtml = `
        <form id="contactForm" class="contact-form">
            ${config.contact.form.fields.map(field => {
                if (field.type === 'textarea') {
                    return `
                        <div class="form-group">
                            <label for="${field.name}">${field.placeholder}</label>
                            <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>
                        </div>
                    `;
                } else {
                    return `
                        <div class="form-group">
                            <label for="${field.name}">${field.placeholder}</label>
                            <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                        </div>
                    `;
                }
            }).join('')}
            <button type="submit" class="btn-primary">
                <i class="${config.contact.form.submitIcon}"></i>
                ${config.contact.form.submitText}
            </button>
            <div id="formStatus" class="form-status"></div>
        </form>
    `;
    
    contactFormContainer.innerHTML = formHtml;
}

// Typing animation with proper cleanup
let typingInterval = null;
let typingTimeout = null;

function typeText(element, text) {
    // Clear any existing intervals
    if (typingInterval) clearInterval(typingInterval);
    if (typingTimeout) clearTimeout(typingTimeout);
    
    let index = 0;
    element.innerHTML = '';
    
    typingInterval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
        }
    }, config.settings?.typingSpeed || 100);
}

function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement || !config.personal?.typingTexts) return;
    
    let textIndex = 0;
    
    function displayNextText() {
        if (typingTimeout) clearTimeout(typingTimeout);
        
        typeText(typingElement, config.personal.typingTexts[textIndex]);
        textIndex = (textIndex + 1) % config.personal.typingTexts.length;
        
        typingTimeout = setTimeout(displayNextText, config.settings?.typingPause || 3000);
    }
    
    displayNextText();
}

// GSAP Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animations
    gsap.fromTo('.hero-badge', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    );
    
    gsap.fromTo('.hero-title', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4 }
    );
    
    gsap.fromTo('.hero-subtitle', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6 }
    );
    
    gsap.fromTo('.hero-description', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8 }
    );
    
    gsap.fromTo('.hero-actions', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1 }
    );
    
    // Floating cards animation
    gsap.fromTo('.floating-card', 
        { opacity: 0, scale: 0.8, rotation: -10 },
        { 
            opacity: 1, 
            scale: 1, 
            rotation: 0, 
            duration: 1.2, 
            delay: 1.2,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }
    );
    
    // Section animations
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header.querySelector('.section-label'),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%'
                }
            }
        );
        
        gsap.fromTo(header.querySelector('.section-title'),
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.2,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%'
                }
            }
        );
    });
    
    // Skills animation
    gsap.utils.toArray('.skill-category').forEach((skill, i) => {
        gsap.fromTo(skill,
            { opacity: 0, x: -60, rotationY: -15 },
            {
                opacity: 1,
                x: 0,
                rotationY: 0,
                duration: 1,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: skill,
                    start: 'top 85%'
                }
            }
        );
    });
    
    // Experience cards animation
    gsap.utils.toArray('.experience-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 60, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            }
        );
    });
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 80, rotationX: 15 },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            }
        );
    });
    
    // Contact section animation
    gsap.fromTo('.contact-info',
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 80%'
            }
        }
    );
    
    gsap.fromTo('.contact-form-container',
        { opacity: 0, x: 50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 80%'
            }
        }
    );
    
    // Parallax effects
    gsap.utils.toArray('.floating-card').forEach(card => {
        gsap.to(card, {
            y: -30,
            rotation: 5,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    });
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const username = config.projects?.github?.username || 'ssuriya1';
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        
        const projects = repos.filter(repo => !repo.fork).slice(0, 6);
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        projects.forEach((project) => {
            const technologies = project.topics || [];
            const hasWebsite = project.homepage && project.homepage.length > 0;
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description || 'No description available'}</p>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                    </div>
                    <div class="project-tech">
                        ${technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${hasWebsite ? `
                            <a href="${project.homepage}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.getElementById('projects-grid').innerHTML = `
            <div class="project-card">
                <p>Error loading projects. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    
    // Load configuration first
    await loadConfig();
    
    console.log('Config loaded, initializing content...');
    
    // Initialize page content
    initializePageContent();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Initialize animations
    setTimeout(() => {
        initAnimations();
    }, 100);
    
    // Load GitHub projects
    fetchGitHubProjects();
    
    console.log('Initialization complete');
});