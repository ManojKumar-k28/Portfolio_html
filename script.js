// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const sections = document.querySelectorAll('.section');
const backToTopBtn = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loading-screen');
const typedText = document.getElementById('typedText');
const cursor = document.getElementById('cursor');
const statNumbers = document.querySelectorAll('.stat-number');
const skillBars = document.querySelectorAll('.skill-progress');

// Typing animation data
const typingWords = ['Software Developer', 'Web Developer', 'UI Designer', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a delay
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Initialize all functions
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTypingEffect();
    initializeStatCounters();
    initializeSkillBars();
    initializeFormSubmission();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            scrollToSection(targetSection);
            
            // Close mobile menu if open
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Update active link
            updateActiveLink(this);
        });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const targetSection = href.substring(1);
            scrollToSection(targetSection);
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Update header appearance
        updateHeaderAppearance(scrollY);
        
        // Update active section
        updateActiveSectionOnScroll();
        
        // Show/hide back to top button
        toggleBackToTopButton(scrollY);
        
        // Animate elements on scroll
        animateOnScroll();
    });

    // Back to top button
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update header appearance on scroll
function updateHeaderAppearance(scrollY) {
    const header = document.querySelector('header');
    if (scrollY > 100) {
        header.style.background = 'rgba(10, 15, 28, 0.95)';
        header.style.backdropFilter = 'blur(25px)';
    } else {
        header.style.background = 'rgba(10, 15, 28, 0.9)';
        header.style.backdropFilter = 'blur(20px)';
    }
}

// Update active section based on scroll position
function updateActiveSectionOnScroll() {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('header').offsetHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`[data-section="${sectionId}"]`);
            
            if (correspondingNavLink && !correspondingNavLink.classList.contains('active')) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingNavLink.classList.add('active');
            }
        }
    });
}

// Toggle back to top button visibility
function toggleBackToTopButton(scrollY) {
    if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.specialization-card, .skill-item, .timeline-item, .project-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Add intersection observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Trigger specific animations for different elements
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                } else if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.specialization-card, .timeline-item, .project-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Typing effect
function initializeTypingEffect() {
    if (!typedText) return;
    
    function typeEffect() {
        const currentWord = typingWords[wordIndex];
        
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typingWords.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
}

// Counter animation
function initializeStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const increment = target / 50;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 40);
}

// Skill bars animation
function initializeSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    const targetWidth = progressBar.getAttribute('data-width');
    
    setTimeout(() => {
        progressBar.style.width = targetWidth;
    }, 200);
}

// Form submission
function initializeFormSubmission() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show success message (you can integrate with a real backend here)
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Window resize handler
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
}, 250));

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        'https://images.pexels.com/photos/7821517/pexels-photo-7821517.jpeg',
        'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadImages();

// Expose scrollToSection function globally for button clicks
window.scrollToSection = scrollToSection;