// ===== CONFIGURATION =====
const CONFIG = {
  WHATSAPP_NUMBER: '+2290197463209',
  WHATSAPP_MESSAGE: 'Bonjour Anna, je souhaite des informations',
  ANIMATION_DURATION: 3000,
  SLIDER_INTERVAL: 5000
};

// ===== UTILITAIRES =====
const Utils = {
  // Animation des nombres
  animateNumber: (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  },

  // Validation d'email
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validation de téléphone
  isValidPhone: (phone) => {
    const re = /^\+?[0-9\s\-\(\)]{8,}$/;
    return re.test(phone);
  },

  // Formatage de date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Génération d'ID unique
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Sauvegarde en localStorage
  saveToStorage: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      return false;
    }
  },

  // Lecture depuis localStorage
  loadFromStorage: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur de lecture:', error);
      return null;
    }
  }
};

// ===== GESTIONNAIRE DE DONNÉES =====
class DataManager {
  constructor() {
    this.users = Utils.loadFromStorage('users') || [];
    this.testimonials = Utils.loadFromStorage('testimonials') || [];
    this.appointments = Utils.loadFromStorage('appointments') || [];
    this.loyaltyPoints = Utils.loadFromStorage('loyaltyPoints') || {};
  }

  // Gestion des utilisateurs
  addUser(userData) {
    const user = {
      id: Utils.generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      points: 0,
      visits: 0
    };
    this.users.push(user);
    Utils.saveToStorage('users', this.users);
    return user;
  }

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  updateUser(userId, updates) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      Utils.saveToStorage('users', this.users);
      return true;
    }
    return false;
  }

  // Gestion des témoignages
  addTestimonial(testimonialData) {
    const testimonial = {
      id: Utils.generateId(),
      ...testimonialData,
      createdAt: new Date().toISOString(),
      approved: false
    };
    this.testimonials.push(testimonial);
    Utils.saveToStorage('testimonials', this.testimonials);
    return testimonial;
  }

  getApprovedTestimonials() {
    return this.testimonials.filter(t => t.approved);
  }

  approveTestimonial(testimonialId) {
    const testimonial = this.testimonials.find(t => t.id === testimonialId);
    if (testimonial) {
      testimonial.approved = true;
      Utils.saveToStorage('testimonials', this.testimonials);
      return true;
    }
    return false;
  }

  // Gestion des rendez-vous
  addAppointment(appointmentData) {
    const appointment = {
      id: Utils.generateId(),
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.appointments.push(appointment);
    Utils.saveToStorage('appointments', this.appointments);
    return appointment;
  }

  getAppointmentsByUser(userId) {
    return this.appointments.filter(a => a.userId === userId);
  }

  updateAppointmentStatus(appointmentId, status) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      Utils.saveToStorage('appointments', this.appointments);
      return true;
    }
    return false;
  }

  // Système de fidélité
  addPoints(userId, points) {
    if (!this.loyaltyPoints[userId]) {
      this.loyaltyPoints[userId] = 0;
    }
    this.loyaltyPoints[userId] += points;
    Utils.saveToStorage('loyaltyPoints', this.loyaltyPoints);
    
    // Mettre à jour l'utilisateur
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.points = this.loyaltyPoints[userId];
      user.visits += 1;
      Utils.saveToStorage('users', this.users);
    }
  }

  getTopClients(limit = 3) {
    const clientsWithPoints = this.users.map(user => ({
      ...user,
      points: this.loyaltyPoints[user.id] || 0
    }));
    
    return clientsWithPoints
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
}

// ===== GESTIONNAIRE D'INTERFACE =====
class UIManager {
  constructor() {
    this.dataManager = new DataManager();
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.checkAuthentication();
  }

  setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Lightbox pour la galerie
    this.setupLightbox();

    // Slider de témoignages
    this.setupTestimonialsSlider();

    // Formulaires
    this.setupForms();

    // Modal de réservation
    this.setupReservationModal();

    // Animations des statistiques
    this.setupStatsAnimation();
  }

  setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // Ouvrir lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    // Fermer lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  setupTestimonialsSlider() {
    const slides = Array.from(document.querySelectorAll('.testimonial'));
    const dots = Array.from(document.querySelectorAll('.slider-dot'));
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    // Navigation par points
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
      });
    });

    // Auto-play
    setInterval(nextSlide, CONFIG.SLIDER_INTERVAL);
  }

  setupForms() {
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(contactForm);
      });

      // Bouton WhatsApp
      const whatsappBtn = document.getElementById('contactWhats');
      if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
          this.sendWhatsAppMessage(contactForm);
        });
      }
    }

    // Formulaire de newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterForm(newsletterForm);
      });
    }
  }

  setupReservationModal() {
    const modal = document.getElementById('rdvModal');
    const openBtn = document.getElementById('openRdvBtn');
    const closeBtn = document.getElementById('closeRdv');
    const form = document.getElementById('rdvForm');
    const sendWhatsBtn = document.getElementById('sendWhats');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReservationForm(form);
      });
    }

    if (sendWhatsBtn) {
      sendWhatsBtn.addEventListener('click', () => {
        this.sendWhatsAppReservation(form);
      });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  setupStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat-number');
          numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            Utils.animateNumber(number, target);
          });
          observer.unobserve(entry.target);
        }
      });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  initializeComponents() {
    // Année dans le footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Respect des préférences utilisateur
    this.respectUserPreferences();
  }

  respectUserPreferences() {
    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const video = document.querySelector('.hero video');
      if (video) video.pause();
    }

    // Respect save-data
    if (navigator.connection && navigator.connection.saveData) {
      const video = document.querySelector('.hero video');
      if (video) video.pause();
    }
  }

  // ===== GESTION DES FORMULAIRES =====
  handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateContactForm(data)) {
      return;
    }

    // Sauvegarder le message
    const message = {
      ...data,
      type: 'contact',
      createdAt: new Date().toISOString()
    };

    // Simuler envoi
    this.showNotification('Message envoyé avec succès !', 'success');
    form.reset();

    // Envoyer par WhatsApp si demandé
    this.sendWhatsAppMessage(form);
  }

  handleReservationForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateReservationForm(data)) {
      return;
    }

    // Créer le rendez-vous
    const appointment = this.dataManager.addAppointment({
      ...data,
      userId: this.currentUser?.id || null
    });

    // Ajouter des points si utilisateur connecté
    if (this.currentUser) {
      this.dataManager.addPoints(this.currentUser.id, 10);
    }

    this.showNotification('Réservation enregistrée avec succès !', 'success');
    form.reset();

    // Fermer le modal
    const modal = document.getElementById('rdvModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  handleNewsletterForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const messageElement = document.getElementById('newsletterMessage');
    const submitBtn = form.querySelector('.newsletter-btn');

    // Validation
    if (!data.email || !Utils.isValidEmail(data.email)) {
      this.showNewsletterMessage('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Simuler l'envoi (dans un vrai projet, ce serait une requête API)
    setTimeout(() => {
      // Sauvegarder l'email dans localStorage
      const subscribers = Utils.loadFromStorage('newsletter_subscribers') || [];
      if (!subscribers.includes(data.email)) {
        subscribers.push(data.email);
        Utils.saveToStorage('newsletter_subscribers', subscribers);
      }

      this.showNewsletterMessage('Inscription réussie ! Vous recevrez nos nouveautés.', 'success');
      form.reset();
      
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }, 1500);
  }

  showNewsletterMessage(message, type = 'info') {
    const messageElement = document.getElementById('newsletterMessage');
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.className = `newsletter-message ${type}`;
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'newsletter-message';
      }, 5000);
    }
  }

  validateContactForm(data) {
    if (!data.name || data.name.trim().length < 2) {
      this.showNotification('Veuillez entrer un nom valide', 'error');
      return false;
    }

    if (!data.phone || !Utils.isValidPhone(data.phone)) {
      this.showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
      return false;
    }

    if (data.email && !Utils.isValidEmail(data.email)) {
      this.showNotification('Veuillez entrer une adresse email valide', 'error');
      return false;
    }

    if (!data.service) {
      this.showNotification('Veuillez sélectionner un service', 'error');
      return false;
    }

    return true;
  }

  validateReservationForm(data) {
    return this.validateContactForm(data);
  }

  // ===== WHATSAPP =====
  sendWhatsAppMessage(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const message = `Bonjour Anna, je souhaite des informations :

Nom: ${data.name || '[Non renseigné]'}
Téléphone: ${data.phone || '[Non renseigné]'}
Email: ${data.email || '[Non renseigné]'}
Service: ${data.service || '[Non renseigné]'}
Date souhaitée: ${data.date || '[Non renseigné]'}
Message: ${data.message || '[Aucun message]'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  sendWhatsAppReservation(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const message = `Bonjour Anna, je souhaite prendre un rendez-vous :

Nom: ${data.rname || '[Non renseigné]'}
Téléphone: ${data.rphone || '[Non renseigné]'}
Service: ${data.rservice || '[Non renseigné]'}
Date souhaitée: ${data.rdate || '[Non renseigné]'}
Préférences: ${data.rnote || '[Aucune préférence]'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  // ===== NOTIFICATIONS =====
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Styles pour la notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 100000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Fermer la notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });

    // Auto-fermeture
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  // ===== AUTHENTIFICATION =====
  checkAuthentication() {
    const userData = Utils.loadFromStorage('currentUser');
    if (userData) {
      this.currentUser = userData;
      this.updateUIForAuthenticatedUser();
    }
  }

  login(email, password) {
    const user = this.dataManager.getUserByEmail(email);
    if (user && user.password === password) {
      this.currentUser = user;
      Utils.saveToStorage('currentUser', user);
      this.updateUIForAuthenticatedUser();
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.updateUIForUnauthenticatedUser();
  }

  updateUIForAuthenticatedUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
      loginBtn.href = 'dashboard.html';
    }
  }

  updateUIForUnauthenticatedUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> Connexion`;
      loginBtn.href = 'connexion.html';
    }
  }
}

// ===== GESTION DU MENU MOBILE =====
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    let isMenuOpen = false;
    let isAnimating = false;
    
    // Fonction pour ouvrir le menu
    const openMenu = () => {
      if (isAnimating) return;
      isAnimating = true;
      isMenuOpen = true;
      
      // Ajouter les classes avec animation
      navLinks.style.display = 'flex';
      navLinks.classList.add('active');
      mobileMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Réinitialiser les animations des liens
      const navItems = navLinks.querySelectorAll('li');
      navItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 * (index + 1)}s`;
        item.style.animation = 'fadeInUp 0.5s ease forwards';
      });
      
      setTimeout(() => {
        isAnimating = false;
      }, 600);
    };
    
    // Fonction pour fermer le menu
    const closeMenu = () => {
      if (isAnimating) return;
      isAnimating = true;
      isMenuOpen = false;
      
      // Animation de fermeture
      navLinks.style.animation = 'slideOutToTop 0.3s ease forwards';
      
      setTimeout(() => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
        navLinks.style.display = 'none';
        navLinks.style.animation = '';
        isAnimating = false;
      }, 300);
    };
    
    // Gestionnaire du bouton hamburger
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fermer le menu quand on clique sur un lien
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', (e) => {
        // Ajouter un effet de feedback visuel
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
          link.style.transform = '';
        }, 150);
        
        // Fermer le menu après un délai pour voir l'animation
        setTimeout(() => {
          closeMenu();
        }, 200);
      });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        closeMenu();
      }
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });

    // Gérer le redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && isMenuOpen) {
          closeMenu();
        }
      }, 250);
    });
    
    // Améliorer l'accessibilité
    mobileMenuBtn.setAttribute('aria-label', 'Menu de navigation');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    // Mettre à jour l'état ARIA
    const updateAriaState = () => {
      mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen.toString());
    };
    
    // Observer les changements de classe pour mettre à jour ARIA
    const observer = new MutationObserver(updateAriaState);
    observer.observe(mobileMenuBtn, { attributes: true, attributeFilter: ['class'] });
  }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  window.uiManager = new UIManager();
  initMobileMenu();
});

// ===== EXPORT POUR UTILISATION GLOBALE =====
window.Utils = Utils;
window.DataManager = DataManager;
window.UIManager = UIManager;

