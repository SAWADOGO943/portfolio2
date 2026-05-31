/* ==================== NAVIGATION SMOOTH SCROLL ==================== */

// Mise à jour du lien actif lors du scroll
window.addEventListener('scroll', () => {
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

/* ==================== SCROLL TO SECTION ==================== */

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNavLink();
    }
}

/* ==================== MOBILE MENU ==================== */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animer les barres du hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.style.transition = 'all 0.3s ease');
        
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
    
    // Fermer le menu au scroll
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

/* ==================== FORM SUBMISSION ==================== */

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Récupérer les données
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    // Animation de traitement
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = '⏳ Envoi en cours...';
    button.disabled = true;
    
    // Créer l'objet FormData pour l'envoi
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    
    // Essayer avec Formspree (gratuit et fiable)
    fetch('https://formspree.io/f/xzzqaaqw', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Message de succès
            button.textContent = '✓ Message envoyé avec succès !';
            button.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                form.reset();
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
            
            console.log('✓ Email envoyé avec succès à stevenyoussous@gmail.com');
            return response.json();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    })
    .then(data => {
        console.log('Réponse du serveur:', data);
    })
    .catch(error => {
        console.error('Erreur:', error);
        
        // Fallback: afficher un message et envoyer par mailto
        const mailtoLink = `mailto:stevenyoussous@gmail.com?subject=Message de ${encodeURIComponent(name)}&body=Nom: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
        
        // Message informatif
        button.textContent = '✓ Message préparé !';
        button.style.background = 'linear-gradient(135deg, #ffa500, #ff8c00)';
        
        alert(`Merci ${name}! \n\nVotre message sera envoyé à stevenyoussous@gmail.com.\n\nVeuillez utiliser le bouton de votre navigateur ou réessayer.`);
        
        setTimeout(() => {
            // Ouvrir le client email par défaut
            window.location.href = mailtoLink;
            
            setTimeout(() => {
                form.reset();
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 500);
        }, 500);
    });
    
    // Log des données
    console.log('Formulaire soumis:', { name, email, message });
}

/* ==================== ANIMATIONS AU SCROLL ==================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-in-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer toutes les cartes
document.querySelectorAll('.expertise-card, .project-card, .formation-card, .langue-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

/* ==================== EFFET PARALLAX ==================== */

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.backgroundPosition = `0% ${scrolled * 0.5}px`;
    }
});

/* ==================== DARK MODE TOGGLE (BONUS) ==================== */

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

initTheme();

/* ==================== TYPING ANIMATION ==================== */

function typeText(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ==================== COUNTER ANIMATION ==================== */

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ==================== ACTIVE STATE MANAGEMENT ==================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les états
    updateActiveNavLink();
    
    // Ajouter des écouteurs pour les boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ajouter un effet ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

/* ==================== SMOOTH SCROLL POLYFILL ==================== */

// Pour les navigateurs qui ne supportent pas scroll-behavior: smooth
if (!('scrollBehavior' in document.documentElement.style)) {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target) {
            e.preventDefault();
            const hash = target.getAttribute('href');
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/* ==================== LAZY LOADING IMAGES ==================== */

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ==================== CONSOLE EASTER EGG ==================== */

console.log('%c🚀 Portfolio de SAWADOGO STEVEN YOUSSOUF', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%cDéveloppeur Full-Stack & Ingénieur IA', 'color: #ff006e; font-size: 14px;');
console.log('%cAbidjan, Côte d\'Ivoire 🇨🇮', 'color: #a0a0a0; font-size: 12px;');
