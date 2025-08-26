// ===== GESTIONNAIRE D'AUTHENTIFICATION =====
class AuthManager {
  constructor() {
    this.dataManager = new DataManager();
    this.currentForm = 'login';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormValidation();
    this.checkForRedirect();
  }

  setupEventListeners() {
    // Formulaires
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(loginForm);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister(registerForm);
      });
    }

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleForgotPassword(forgotPasswordForm);
      });
    }

    // Validation en temps réel
    this.setupRealTimeValidation();
  }

  setupFormValidation() {
    // Validation du mot de passe
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validatePassword(input);
      });
    });

    // Validation de l'email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateEmail(input);
      });
    });

    // Validation du téléphone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validatePhone(input);
      });
    });
  }

  setupRealTimeValidation() {
    // Validation de la confirmation du mot de passe
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const passwordInput = document.getElementById('registerPassword');

    if (confirmPasswordInput && passwordInput) {
      confirmPasswordInput.addEventListener('input', () => {
        this.validatePasswordConfirmation(passwordInput, confirmPasswordInput);
      });
    }
  }

  // ===== GESTION DES FORMULAIRES =====
  async handleLogin(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateLoginForm(data)) {
      return;
    }

    // Afficher l'état de chargement
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    try {
      // Simuler un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tentative de connexion
      const success = this.dataManager.login(data.email, data.password);
      
      if (success) {
        this.showMessage('Connexion réussie ! Redirection...', 'success');
        
        // Rediriger vers le dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        this.showMessage('Email ou mot de passe incorrect', 'error');
      }
    } catch (error) {
      this.showMessage('Erreur lors de la connexion', 'error');
    } finally {
      // Restaurer le bouton
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  async handleRegister(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateRegisterForm(data)) {
      return;
    }

    // Afficher l'état de chargement
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    try {
      // Simuler un délai d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Vérifier si l'email existe déjà
      const existingUser = this.dataManager.getUserByEmail(data.email);
      if (existingUser) {
        this.showMessage('Un compte avec cet email existe déjà', 'error');
        return;
      }

      // Créer l'utilisateur
      const user = this.dataManager.addUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });

      this.showMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
      
      // Basculer vers le formulaire de connexion
      setTimeout(() => {
        this.switchToLogin();
      }, 2000);

    } catch (error) {
      this.showMessage('Erreur lors de la création du compte', 'error');
    } finally {
      // Restaurer le bouton
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  async handleForgotPassword(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateForgotPasswordForm(data)) {
      return;
    }

    // Afficher l'état de chargement
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Vérifier si l'email existe
      const user = this.dataManager.getUserByEmail(data.email);
      if (!user) {
        this.showMessage('Aucun compte trouvé avec cet email', 'error');
        return;
      }

      this.showMessage('Un email de réinitialisation a été envoyé à votre adresse', 'success');
      
      // Basculer vers le formulaire de connexion
      setTimeout(() => {
        this.switchToLogin();
      }, 3000);

    } catch (error) {
      this.showMessage('Erreur lors de l\'envoi de l\'email', 'error');
    } finally {
      // Restaurer le bouton
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  // ===== VALIDATION DES FORMULAIRES =====
  validateLoginForm(data) {
    if (!data.email || !Utils.isValidEmail(data.email)) {
      this.showMessage('Veuillez entrer une adresse email valide', 'error');
      return false;
    }

    if (!data.password || data.password.length < 6) {
      this.showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return false;
    }

    return true;
  }

  validateRegisterForm(data) {
    if (!data.name || data.name.trim().length < 2) {
      this.showMessage('Le nom doit contenir au moins 2 caractères', 'error');
      return false;
    }

    if (!data.email || !Utils.isValidEmail(data.email)) {
      this.showMessage('Veuillez entrer une adresse email valide', 'error');
      return false;
    }

    if (!data.phone || !Utils.isValidPhone(data.phone)) {
      this.showMessage('Veuillez entrer un numéro de téléphone valide', 'error');
      return false;
    }

    if (!data.password || data.password.length < 6) {
      this.showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return false;
    }

    if (data.password !== data.confirmPassword) {
      this.showMessage('Les mots de passe ne correspondent pas', 'error');
      return false;
    }

    if (!data.termsAccepted) {
      this.showMessage('Veuillez accepter les conditions d\'utilisation', 'error');
      return false;
    }

    return true;
  }

  validateForgotPasswordForm(data) {
    if (!data.email || !Utils.isValidEmail(data.email)) {
      this.showMessage('Veuillez entrer une adresse email valide', 'error');
      return false;
    }

    return true;
  }

  // ===== VALIDATION EN TEMPS RÉEL =====
  validatePassword(input) {
    const password = input.value;
    const strength = this.getPasswordStrength(password);
    
    // Supprimer l'ancien indicateur de force
    const existingIndicator = input.parentElement.querySelector('.password-strength');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Créer le nouvel indicateur
    const indicator = document.createElement('div');
    indicator.className = `password-strength ${strength.level}`;
    indicator.innerHTML = `
      <div class="password-strength-text">${strength.text}</div>
      <div class="password-strength-bar">
        <div class="password-strength-fill"></div>
      </div>
    `;

    input.parentElement.appendChild(indicator);
  }

  validateEmail(input) {
    const email = input.value;
    const isValid = Utils.isValidEmail(email);
    
    this.updateInputValidation(input, isValid, 'Veuillez entrer une adresse email valide');
  }

  validatePhone(input) {
    const phone = input.value;
    const isValid = Utils.isValidPhone(phone);
    
    this.updateInputValidation(input, isValid, 'Veuillez entrer un numéro de téléphone valide');
  }

  validatePasswordConfirmation(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const isValid = password === confirmPassword && password.length > 0;
    
    this.updateInputValidation(confirmInput, isValid, 'Les mots de passe ne correspondent pas');
  }

  updateInputValidation(input, isValid, errorMessage) {
    const inputGroup = input.closest('.input-group');
    const formGroup = input.closest('.form-group');
    
    // Supprimer les anciens messages d'erreur
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Supprimer les anciennes classes
    inputGroup.classList.remove('error', 'success');
    formGroup.classList.remove('error', 'success');

    if (input.value.length > 0) {
      if (isValid) {
        inputGroup.classList.add('success');
        formGroup.classList.add('success');
      } else {
        inputGroup.classList.add('error');
        formGroup.classList.add('error');
        
        // Ajouter le message d'erreur
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        formGroup.appendChild(errorElement);
      }
    }
  }

  getPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;

    if (score < 2) {
      return { level: 'weak', text: 'Mot de passe faible' };
    } else if (score < 3) {
      return { level: 'fair', text: 'Mot de passe moyen' };
    } else if (score < 4) {
      return { level: 'good', text: 'Bon mot de passe' };
    } else {
      return { level: 'strong', text: 'Mot de passe fort' };
    }
  }

  // ===== NAVIGATION ENTRE FORMULAIRES =====
  switchToLogin() {
    this.showForm('login');
    this.currentForm = 'login';
  }

  switchToRegister() {
    this.showForm('register');
    this.currentForm = 'register';
  }

  showForgotPassword() {
    this.showForm('forgotPassword');
    this.currentForm = 'forgotPassword';
  }

  showForm(formType) {
    // Masquer tous les formulaires
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });

    // Afficher le formulaire demandé
    const targetForm = document.getElementById(`${formType}Form`);
    if (targetForm) {
      targetForm.classList.add('active');
    }

    // Mettre à jour le header
    this.updateHeader(formType);
  }

  updateHeader(formType) {
    const header = document.querySelector('.auth-header');
    if (!header) return;

    const titles = {
      login: {
        title: 'Bienvenue chez Ana Coiffure',
        subtitle: 'Connectez-vous à votre espace personnel'
      },
      register: {
        title: 'Créer votre compte',
        subtitle: 'Rejoignez la communauté Ana Coiffure'
      },
      forgotPassword: {
        title: 'Mot de passe oublié',
        subtitle: 'Nous vous aiderons à le récupérer'
      }
    };

    const content = titles[formType];
    if (content) {
      header.querySelector('h1').textContent = content.title;
      header.querySelector('p').textContent = content.subtitle;
    }
  }

  // ===== UTILITAIRES =====
  showMessage(message, type = 'info') {
    // Supprimer les anciens messages
    const existingMessages = document.querySelectorAll('.auth-message');
    existingMessages.forEach(msg => msg.remove());

    // Créer le nouveau message
    const messageElement = document.createElement('div');
    messageElement.className = `auth-message ${type}`;
    messageElement.textContent = message;

    // Insérer le message dans le formulaire actif
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
      activeForm.insertBefore(messageElement, activeForm.firstChild);
    }

    // Auto-suppression après 5 secondes
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }

  checkForRedirect() {
    // Vérifier s'il y a un paramètre de redirection
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
      // Stocker la redirection pour l'utiliser après connexion
      sessionStorage.setItem('redirectAfterLogin', redirect);
    }
  }

  // ===== FONCTIONS GLOBALES =====
  togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
      input.type = 'text';
      toggleBtn.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      toggleBtn.className = 'fas fa-eye';
    }
  }
}

// ===== FONCTIONS GLOBALES =====
function switchToLogin() {
  if (window.authManager) {
    window.authManager.switchToLogin();
  }
}

function switchToRegister() {
  if (window.authManager) {
    window.authManager.switchToRegister();
  }
}

function showForgotPassword() {
  if (window.authManager) {
    window.authManager.showForgotPassword();
  }
}

function togglePassword(inputId) {
  if (window.authManager) {
    window.authManager.togglePassword(inputId);
  }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
  
  // Année dans le footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});


