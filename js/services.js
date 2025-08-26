// ===== GESTIONNAIRE DE LA PAGE SERVICES =====
class ServicesManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
  }

  setupEventListeners() {
    // Animation des cartes de services au scroll
    this.setupServiceCardsAnimation();

    // Gestion des boutons CTA
    this.setupCTAButtons();
  }

  setupServiceCardsAnimation() {
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

    // Observer les cartes de services
    document.querySelectorAll('.service-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  setupCTAButtons() {
    // Bouton "Prendre RDV" dans la section CTA
    const ctaRdvBtn = document.getElementById('openRdvBtn');
    if (ctaRdvBtn) {
      ctaRdvBtn.addEventListener('click', () => {
        const modal = document.getElementById('rdvModal');
        if (modal) {
          modal.classList.add('open');
          modal.setAttribute('aria-hidden', 'false');
        }
      });
    }

    // Fermer le modal avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('rdvModal');
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      }
    });
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
  window.servicesManager = new ServicesManager();
});

