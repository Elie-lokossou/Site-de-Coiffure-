// ===== GESTIONNAIRE DES PAGES DÉTAIL SERVICE =====
class ServiceDetailManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupImageGallery();
  }

  setupEventListeners() {
    // Gestion des boutons de réservation
    this.setupReservationButtons();

    // Animation des éléments au scroll
    this.setupScrollAnimations();
  }

  setupImageGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.gallery-thumbs img');

    console.log('Setting up image gallery...');
    console.log('Main image:', mainImage);
    console.log('Thumbnails found:', thumbs.length);

    if (mainImage && thumbs.length > 0) {
      thumbs.forEach((thumb, index) => {
        console.log(`Thumbnail ${index}:`, thumb.src, thumb.alt);
        thumb.addEventListener('click', () => {
          console.log('Thumbnail clicked:', thumb.src);
          // Mettre à jour l'image principale
          mainImage.src = thumb.src; // Use src instead of dataset.src
          mainImage.alt = thumb.alt;

          // Mettre à jour les classes actives
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    } else {
      console.warn('Image gallery elements not found');
    }
  }

  setupReservationButtons() {
    // Tous les boutons "Prendre RDV"
    const rdvButtons = [
      document.getElementById('openRdvBtn'),
      document.getElementById('openRdvBtn2'),
      document.getElementById('openRdvBtn3')
    ];

    rdvButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          const modal = document.getElementById('rdvModal');
          if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
          }
        });
      }
    });

    // Fermer le modal
    const closeBtn = document.getElementById('closeRdv');
    const modal = document.getElementById('rdvModal');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });

      // Fermer en cliquant à l'extérieur
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    // Gestion du formulaire de réservation
    const rdvForm = document.getElementById('rdvForm');
    if (rdvForm) {
      rdvForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReservationForm(rdvForm);
      });
    }

    // Bouton WhatsApp dans le modal
    const sendWhatsBtn = document.getElementById('sendWhats');
    if (sendWhatsBtn && rdvForm) {
      sendWhatsBtn.addEventListener('click', () => {
        this.sendWhatsAppReservation(rdvForm);
      });
    }
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observer les éléments à animer
    const animatedElements = [
      ...document.querySelectorAll('.service-item'),
      ...document.querySelectorAll('.reason-item'),
      ...document.querySelectorAll('.testimonial-card')
    ];

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  handleReservationForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateReservationForm(data)) {
      return;
    }

    // Créer le rendez-vous
    const appointment = {
      ...data,
      userId: this.getCurrentUserId(),
      serviceType: 'coiffure-dames',
      createdAt: new Date().toISOString()
    };

    // Sauvegarder dans localStorage
    const appointments = Utils.loadFromStorage('appointments') || [];
    appointments.push(appointment);
    Utils.saveToStorage('appointments', appointments);

    // Ajouter des points si utilisateur connecté
    const currentUser = Utils.loadFromStorage('currentUser');
    if (currentUser) {
      const users = Utils.loadFromStorage('users') || [];
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex].loyaltyPoints = (users[userIndex].loyaltyPoints || 0) + 10;
        Utils.saveToStorage('users', users);
      }
    }

    this.showNotification('Réservation enregistrée avec succès !', 'success');
    form.reset();

    // Fermer le modal
    const modal = document.getElementById('rdvModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  validateReservationForm(data) {
    if (!data.rname || data.rname.trim().length < 2) {
      this.showNotification('Veuillez entrer un nom valide', 'error');
      return false;
    }

    if (!data.rphone || !Utils.isValidPhone(data.rphone)) {
      this.showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
      return false;
    }

    if (!data.rservice) {
      this.showNotification('Veuillez sélectionner un service', 'error');
      return false;
    }

    if (!data.rdate) {
      this.showNotification('Veuillez sélectionner une date', 'error');
      return false;
    }

    // Vérifier que la date n'est pas dans le passé
    const selectedDate = new Date(data.rdate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      this.showNotification('Veuillez sélectionner une date future', 'error');
      return false;
    }

    return true;
  }

  sendWhatsAppReservation(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const message = `Bonjour Anna, je souhaite prendre un rendez-vous pour une coiffure dames :

Nom: ${data.rname || '[Non renseigné]'}
Téléphone: ${data.rphone || '[Non renseigné]'}
Service: ${data.rservice || '[Non renseigné]'}
Date souhaitée: ${data.rdate || '[Non renseigné]'}
Préférences: ${data.rnote || '[Aucune préférence]']}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+2290197463209?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  getCurrentUserId() {
    const currentUser = Utils.loadFromStorage('currentUser');
    return currentUser ? currentUser.id : null;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;

    // Ajouter au body
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Fermer automatiquement
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);

    // Fermer manuellement
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      });
    }
  }

  initializeComponents() {
    // Année dans le footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Vérifier l'authentification pour mettre à jour l'interface
    this.checkAuthentication();
  }

  checkAuthentication() {
    const currentUser = Utils.loadFromStorage('currentUser');
    const loginBtn = document.getElementById('loginBtn');
    
    if (currentUser && loginBtn) {
      loginBtn.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${currentUser.name}</span>
        <i class="fas fa-chevron-down"></i>
      `;
      loginBtn.href = 'dashboard.html';
      
      // Ajouter un menu déroulant pour l'utilisateur connecté
      this.setupUserDropdown();
    }
  }

  setupUserDropdown() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    // Créer le menu déroulant
    const dropdown = document.createElement('ul');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
      <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Mon Espace</a></li>
      <li><a href="profile.html"><i class="fas fa-user-edit"></i> Mon Profil</a></li>
      <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
    `;

    // Ajouter le dropdown au conteneur du bouton
    const container = loginBtn.parentElement;
    container.style.position = 'relative';
    container.appendChild(dropdown);

    // Gérer l'ouverture/fermeture du dropdown
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
}

// ===== FONCTIONS GLOBALES =====
function logout() {
  Utils.saveToStorage('currentUser', null);
  window.location.href = 'index.html';
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  window.serviceDetailManager = new ServiceDetailManager();
});









