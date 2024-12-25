import { db } from './firebase-config.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

// Typing animation constants
const typingTexts = [
    'Full Stack Developer',
    'Cloud Developer',
    'Problem Solver',
    'DevOps Engineer'
];

const TYPING_SPEED = 100;
const TYPING_PAUSE = 3000;

// Typing animation
function typeText(element, text) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, TYPING_SPEED);
        }
    }
    type();
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

const INITIAL_PROJECT_COUNT = 4;

// Fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/ssuriya1/repos');
        const repos = await response.json();
        
        const sortProjects = (repos) => {
            const gamesRepo = repos.find(repo => repo.name.toLowerCase().includes('games'));
            const otherRepos = repos.filter(repo => repo !== gamesRepo)
                                  .sort((a, b) => b.stargazers_count - a.stargazers_count);
            return gamesRepo ? [gamesRepo, ...otherRepos] : otherRepos;
        };

        const projects = sortProjects(repos.filter(repo => !repo.fork));
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const technologies = project.topics || [];
            const hasWebsite = project.homepage && project.homepage.length > 0;
            
            const projectCard = document.createElement('div');
            projectCard.className = `project-card glass-card ${index >= INITIAL_PROJECT_COUNT ? 'hidden' : ''}`;
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
                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="glass-button">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${hasWebsite ? `
                            <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="glass-button">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });

        if (projects.length > INITIAL_PROJECT_COUNT) {
            const showMoreContainer = document.createElement('div');
            showMoreContainer.className = 'show-more-container visible';
            showMoreContainer.innerHTML = '<button class="show-more-btn">Show More</button>';
            projectsGrid.parentElement.appendChild(showMoreContainer);

            const showMoreBtn = showMoreContainer.querySelector('.show-more-btn');
            showMoreBtn.addEventListener('click', () => toggleProjects(true));

            // Hide cards beyond initial count
            projects.forEach((_, index) => {
                if (index >= INITIAL_PROJECT_COUNT) {
                    const card = projectsGrid.children[index];
                    if (card) {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.querySelector('.projects-grid').innerHTML = `
            <div class="glass-card">
                <p>Error loading projects. Please try again later.</p>
            </div>
        `;
    }
}

function toggleProjects(show = true) {
    const projectCards = document.querySelectorAll('.project-card');
    const showMoreContainer = document.querySelector('.show-more-container');
    
    // Remove old event listeners
    const oldBtn = showMoreContainer.querySelector('button');
    if (oldBtn) {
        oldBtn.parentNode.removeChild(oldBtn);
    }

    const newBtn = document.createElement('button');
    newBtn.className = show ? 'show-less-btn' : 'show-more-btn';
    newBtn.textContent = show ? 'Show Less' : 'Show More';
    newBtn.addEventListener('click', () => toggleProjects(!show));
    showMoreContainer.appendChild(newBtn);

    // Handle visibility
    projectCards.forEach((card, index) => {
        if (index >= INITIAL_PROJECT_COUNT) {
            if (show) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.classList.remove('hidden');
                }, 10);
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });

    if (show) {
        const firstHiddenCard = projectCards[INITIAL_PROJECT_COUNT];
        if (firstHiddenCard) {
            setTimeout(() => {
                firstHiddenCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    } else {
        const lastVisibleCard = projectCards[INITIAL_PROJECT_COUNT - 1];
        if (lastVisibleCard) {
            setTimeout(() => {
                lastVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-text');
    let textIndex = 0;
    
    function displayNextText() {
        typeText(typingElement, typingTexts[textIndex]);
        textIndex = (textIndex + 1) % typingTexts.length;
        setTimeout(displayNextText, TYPING_PAUSE);
    }
    
    displayNextText();
    initSmoothScroll();
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        }),
        { threshold: 0.1 }
    );
    
    document.querySelectorAll('.glass-card').forEach(card => observer.observe(card));

    fetchGitHubProjects();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content')) {
            navLinks.classList.remove('active');
        }
    });
});

// Optimize scroll performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            document.querySelectorAll('.parallax-bg').forEach(bg => {
                const speed = 0.5;
                bg.style.transform = `translateY(${scrolled * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatus');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    try {
        submitButton.disabled = true;
        formStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const timestamp = new Date();
        const name = document.getElementById('name').value;
        const docId = `${name}_${timestamp.getTime()}`;
        
        const formData = {
            name: name,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: timestamp
        };
        
        await setDoc(doc(db, "github-messages", docId), formData);
        
        e.target.reset();
        formStatus.innerHTML = '<i class="fas fa-check"></i> Message sent successfully!';
        formStatus.style.color = 'var(--accent-color)';
        
        setTimeout(() => {
            formStatus.innerHTML = '';
        }, 5000);
        
    } catch (error) {
        console.error('Error sending message:', error);
        formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.';
        formStatus.style.color = '#ff4444';
    } finally {
        submitButton.disabled = false;
    }
});
