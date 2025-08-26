// ===== GESTION RESPONSIVE AVANCÉE =====

class ResponsiveManager {
  constructor() {
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.isMenuOpen = false;
    this.isAnimating = false;
    this.resizeTimer = null;
    
    this.init();
  }

  // Déterminer le breakpoint actuel
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    if (width <= 1024) return 'desktop';
    return 'large';
  }

  // Initialisation
  init() {
    this.setupMobileMenu();
    this.setupResponsiveHandlers();
    this.setupAccessibility();
    this.setupPerformanceOptimizations();
  }

  // Configuration du menu mobile
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;

    // Gestionnaire du bouton hamburger
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Fermer le menu en cliquant sur les liens
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', (e) => {
        this.addClickFeedback(link);
        setTimeout(() => this.closeMobileMenu(), 200);
      });
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && 
          !mobileMenuBtn.contains(e.target) && 
          !navLinks.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  // Ouvrir le menu mobile
  openMobileMenu() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isMenuOpen = true;
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;

    // Animation d'ouverture
    navLinks.style.display = 'flex';
    navLinks.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animation des liens avec délai
    const navItems = navLinks.querySelectorAll('li');
    navItems.forEach((item, index) => {
      item.style.animationDelay = `${0.1 * (index + 1)}s`;
      item.style.animation = 'fadeInUp 0.5s ease forwards';
    });
    
    // Mettre à jour l'état ARIA
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  // Fermer le menu mobile
  closeMobileMenu() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isMenuOpen = false;
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;

    // Animation de fermeture
    navLinks.style.animation = 'slideOutToTop 0.3s ease forwards';
    
    setTimeout(() => {
      navLinks.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
      navLinks.style.display = 'none';
      navLinks.style.animation = '';
      
      // Mettre à jour l'état ARIA
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      
      this.isAnimating = false;
    }, 300);
  }

  // Basculer le menu mobile
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  // Ajouter un feedback visuel au clic
  addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = '';
    }, 150);
  }

  // Configuration des gestionnaires responsive
  setupResponsiveHandlers() {
    // Gestionnaire de redimensionnement optimisé
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
          this.handleBreakpointChange(newBreakpoint);
        }
        
        // Fermer le menu si on passe en desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      }, 250);
    });

    // Gestionnaire d'orientation
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 500);
    });
  }

  // Gérer le changement de breakpoint
  handleBreakpointChange(newBreakpoint) {
    const oldBreakpoint = this.currentBreakpoint;
    this.currentBreakpoint = newBreakpoint;
    
    console.log(`Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
    
    // Actions spécifiques selon le breakpoint
    switch (newBreakpoint) {
      case 'mobile':
        this.optimizeForMobile();
        break;
      case 'tablet':
        this.optimizeForTablet();
        break;
      case 'desktop':
        this.optimizeForDesktop();
        break;
    }
  }

  // Optimisations pour mobile
  optimizeForMobile() {
    // Réduire les animations si nécessaire
    if (this.isLowPerformanceDevice()) {
      document.body.classList.add('reduced-motion');
    }
    
    // Optimiser les images
    this.lazyLoadImages();
  }

  // Optimisations pour tablette
  optimizeForTablet() {
    // Ajuster les grilles
    this.adjustGridLayouts();
  }

  // Optimisations pour desktop
  optimizeForDesktop() {
    // Restaurer les animations complètes
    document.body.classList.remove('reduced-motion');
  }

  // Gérer le changement d'orientation
  handleOrientationChange() {
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isPortrait) {
      // Mode portrait
      this.optimizeForPortrait();
    } else {
      // Mode paysage
      this.optimizeForLandscape();
    }
  }

  // Optimisations pour le mode portrait
  optimizeForPortrait() {
    // Ajuster la hauteur du hero
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.height = '70vh';
    }
  }

  // Optimisations pour le mode paysage
  optimizeForLandscape() {
    // Ajuster la hauteur du hero
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.height = '100vh';
    }
  }

  // Configuration de l'accessibilité
  setupAccessibility() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-label', 'Menu de navigation');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
    }

    // Améliorer la navigation au clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });

    // Améliorer le focus visible
    this.setupFocusManagement();
  }

  // Gérer la navigation au clavier
  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  // Configuration de la gestion du focus
  setupFocusManagement() {
    // Améliorer le focus pour les éléments interactifs
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focus-visible');
      });
    });
  }

  // Optimisations de performance
  setupPerformanceOptimizations() {
    // Détecter les appareils moins puissants
    if (this.isLowPerformanceDevice()) {
      this.enablePerformanceMode();
    }
    
    // Optimiser le scroll
    this.optimizeScroll();
    
    // Lazy loading des images
    this.setupLazyLoading();
  }

  // Détecter les appareils moins puissants
  isLowPerformanceDevice() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    return (
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      hardwareConcurrency < 4
    );
  }

  // Activer le mode performance
  enablePerformanceMode() {
    document.body.classList.add('performance-mode');
    
    // Réduire les animations
    const style = document.createElement('style');
    style.textContent = `
      .performance-mode * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Optimiser le scroll
  optimizeScroll() {
    let ticking = false;
    
    const updateScroll = () => {
      // Optimisations de scroll ici
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Configuration du lazy loading
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Chargement différé des images
  lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // Ajuster les grilles
  adjustGridLayouts() {
    const grids = document.querySelectorAll('.grid, .services-grid, .gallery-grid');
    grids.forEach(grid => {
      const columns = this.getOptimalColumns(grid);
      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    });
  }

  // Obtenir le nombre optimal de colonnes
  getOptimalColumns(grid) {
    const width = window.innerWidth;
    const gridType = grid.className;
    
    if (gridType.includes('services')) {
      return width > 768 ? 3 : width > 480 ? 2 : 1;
    }
    
    if (gridType.includes('gallery')) {
      return width > 768 ? 4 : width > 480 ? 2 : 1;
    }
    
    return width > 768 ? 3 : width > 480 ? 2 : 1;
  }
}

// ===== UTILITAIRES RESPONSIVE =====

const ResponsiveUtils = {
  // Détecter si c'est un appareil tactile
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Détecter si c'est un appareil mobile
  isMobileDevice: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Obtenir la taille de l'écran
  getScreenSize: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight
    };
  },

  // Vérifier si l'élément est visible
  isElementVisible: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire responsive
  window.responsiveManager = new ResponsiveManager();
  
  // Exposer les utilitaires globalement
  window.ResponsiveUtils = ResponsiveUtils;
});

// ===== EXPORT POUR UTILISATION GLOBALE =====
window.ResponsiveManager = ResponsiveManager;
