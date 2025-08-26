// ===== GESTIONNAIRE DU DASHBOARD =====
class DashboardManager {
  constructor() {
    this.dataManager = new DataManager();
    this.currentUser = null;
    this.init();
  }

  init() {
    this.checkAuthentication();
    this.loadUserData();
    this.setupEventListeners();
    this.loadDashboardData();
  }

  checkAuthentication() {
    const userData = Utils.loadFromStorage('currentUser');
    if (!userData) {
      // Rediriger vers la page de connexion
      window.location.href = 'connexion.html?redirect=dashboard.html';
      return;
    }
    
    this.currentUser = userData;
    this.updateUserInterface();
  }

  updateUserInterface() {
    // Mettre à jour le nom d'utilisateur
    const userNameElements = document.querySelectorAll('#userName, #userNameHeader');
    userNameElements.forEach(element => {
      element.textContent = this.currentUser.name;
    });
  }

  setupEventListeners() {
    // Formulaire de réservation
    const reservationForm = document.getElementById('dashboardReservationForm');
    if (reservationForm) {
      reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReservation(reservationForm);
      });
    }

    // Formulaire de témoignage
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
      testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTestimonial(testimonialForm);
      });
    }

    // Filtre d'historique
    const historyFilter = document.getElementById('historyFilter');
    if (historyFilter) {
      historyFilter.addEventListener('change', () => {
        this.filterHistory();
      });
    }
  }

  loadDashboardData() {
    this.loadUserStats();
    this.loadUpcomingAppointments();
    this.loadAppointmentsHistory();
    this.loadUserTestimonials();
    this.loadLoyaltyProgram();
    this.loadTopClients();
  }

  // ===== STATISTIQUES UTILISATEUR =====
  loadUserStats() {
    const userPoints = this.dataManager.loyaltyPoints[this.currentUser.id] || 0;
    const userAppointments = this.dataManager.getAppointmentsByUser(this.currentUser.id);
    const topClients = this.dataManager.getTopClients();
    const userRank = topClients.findIndex(client => client.id === this.currentUser.id) + 1;
    const availableRewards = this.calculateAvailableRewards(userPoints);

    // Mettre à jour les statistiques
    document.getElementById('userPoints').textContent = userPoints;
    document.getElementById('totalAppointments').textContent = userAppointments.length;
    document.getElementById('userRank').textContent = userRank > 0 ? `#${userRank}` : '-';
    document.getElementById('availableRewards').textContent = availableRewards.length;
  }

  // ===== RENDEZ-VOUS À VENIR =====
  loadUpcomingAppointments() {
    const appointments = this.dataManager.getAppointmentsByUser(this.currentUser.id);
    const upcoming = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate >= today && apt.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const container = document.getElementById('upcomingAppointments');
    if (!container) return;

    if (upcoming.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <h3>Aucun rendez-vous à venir</h3>
          <p>Prenez votre premier rendez-vous pour commencer !</p>
        </div>
      `;
      return;
    }

    container.innerHTML = upcoming.map(appointment => this.renderAppointment(appointment)).join('');
  }

  // ===== HISTORIQUE DES RENDEZ-VOUS =====
  loadAppointmentsHistory() {
    const appointments = this.dataManager.getAppointmentsByUser(this.currentUser.id);
    const history = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate < today || apt.status === 'cancelled';
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    this.renderAppointmentsHistory(history);
  }

  renderAppointmentsHistory(appointments) {
    const container = document.getElementById('appointmentsHistory');
    if (!container) return;

    if (appointments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-history"></i>
          <h3>Aucun historique</h3>
          <p>Vos rendez-vous passés apparaîtront ici.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = appointments.map(appointment => this.renderAppointment(appointment)).join('');
  }

  filterHistory() {
    const filter = document.getElementById('historyFilter').value;
    const appointments = this.dataManager.getAppointmentsByUser(this.currentUser.id);
    
    let filtered = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate < today || apt.status === 'cancelled';
    });

    if (filter === 'completed') {
      filtered = filtered.filter(apt => apt.status === 'completed');
    } else if (filter === 'cancelled') {
      filtered = filtered.filter(apt => apt.status === 'cancelled');
    }

    this.renderAppointmentsHistory(filtered);
  }

  renderAppointment(appointment) {
    const serviceNames = {
      'coiffure-dame': 'Coiffure — Dame',
      'pose-perruque': 'Pose de perruque',
      'onglerie': 'Onglerie',
      'massage': 'Massage',
      'nouage-foulard': 'Nouage de foulard',
      'formation': 'Formation',
      'coupe-homme': 'Coupe — Homme',
      'taille-barbe': 'Taille / Entretien barbe',
      'coupe-enfant': 'Coupe — Enfant'
    };

    const statusLabels = {
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };

    const statusClasses = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    const date = new Date(appointment.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="appointment-item">
        <div class="appointment-header">
          <div class="appointment-title">${serviceNames[appointment.service] || appointment.service}</div>
          <div class="appointment-status ${statusClasses[appointment.status]}">
            ${statusLabels[appointment.status]}
          </div>
        </div>
        <div class="appointment-details">
          <div class="appointment-detail">
            <i class="fas fa-calendar"></i>
            <span>${date}</span>
          </div>
          ${appointment.time ? `
            <div class="appointment-detail">
              <i class="fas fa-clock"></i>
              <span>${appointment.time}</span>
            </div>
          ` : ''}
          ${appointment.note ? `
            <div class="appointment-detail">
              <i class="fas fa-comment"></i>
              <span>${appointment.note}</span>
            </div>
          ` : ''}
        </div>
        ${appointment.status === 'pending' ? `
          <div class="appointment-actions">
            <button class="btn-secondary btn-sm" onclick="cancelAppointment('${appointment.id}')">
              <i class="fas fa-times"></i> Annuler
            </button>
            <button class="btn-primary btn-sm" onclick="rescheduleAppointment('${appointment.id}')">
              <i class="fas fa-edit"></i> Modifier
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  // ===== TÉMOIGNAGES UTILISATEUR =====
  loadUserTestimonials() {
    const testimonials = this.dataManager.testimonials.filter(t => t.userId === this.currentUser.id);
    const container = document.getElementById('userTestimonials');
    
    if (!container) return;

    if (testimonials.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comments"></i>
          <h3>Aucun témoignage</h3>
          <p>Partagez votre expérience avec Ana Coiffure !</p>
        </div>
      `;
      return;
    }

    container.innerHTML = testimonials.map(testimonial => this.renderTestimonial(testimonial)).join('');
  }

  renderTestimonial(testimonial) {
    const serviceNames = {
      'coiffure-dame': 'Coiffure — Dame',
      'pose-perruque': 'Pose de perruque',
      'onglerie': 'Onglerie',
      'massage': 'Massage',
      'nouage-foulard': 'Nouage de foulard',
      'formation': 'Formation',
      'coupe-homme': 'Coupe — Homme',
      'taille-barbe': 'Taille / Entretien barbe',
      'coupe-enfant': 'Coupe — Enfant'
    };

    const date = new Date(testimonial.createdAt).toLocaleDateString('fr-FR');
    const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);

    return `
      <div class="testimonial-item">
        <div class="testimonial-header">
          <div class="testimonial-service">${serviceNames[testimonial.service] || testimonial.service}</div>
          <div class="testimonial-status ${testimonial.approved ? 'approved' : 'pending'}">
            ${testimonial.approved ? 'Approuvé' : 'En attente'}
          </div>
        </div>
        <div class="testimonial-rating">
          ${stars.split('').map(star => `<i class="fas fa-star" style="color: ${star === '★' ? '#FFD700' : '#ddd'}"></i>`).join('')}
        </div>
        <div class="testimonial-text">"${testimonial.text}"</div>
        <div class="testimonial-date">${date}</div>
      </div>
    `;
  }

  // ===== PROGRAMME DE FIDÉLITÉ =====
  loadLoyaltyProgram() {
    const userPoints = this.dataManager.loyaltyPoints[this.currentUser.id] || 0;
    const currentLevel = this.getLoyaltyLevel(userPoints);
    const nextLevelPoints = this.getNextLevelPoints(currentLevel);
    const progress = Math.min((userPoints / nextLevelPoints) * 100, 100);

    // Mettre à jour la barre de progression
    document.getElementById('loyaltyProgress').style.width = `${progress}%`;
    document.getElementById('currentPoints').textContent = userPoints;
    document.getElementById('nextLevelPoints').textContent = nextLevelPoints;

    // Mettre à jour les niveaux
    this.updateLoyaltyLevels(currentLevel);

    // Charger les récompenses disponibles
    this.loadAvailableRewards(userPoints);
  }

  getLoyaltyLevel(points) {
    if (points >= 300) return 'gold';
    if (points >= 100) return 'silver';
    return 'bronze';
  }

  getNextLevelPoints(currentLevel) {
    switch (currentLevel) {
      case 'bronze': return 100;
      case 'silver': return 300;
      case 'gold': return 500;
      default: return 100;
    }
  }

  updateLoyaltyLevels(currentLevel) {
    const levelItems = document.querySelectorAll('.level-item');
    levelItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.level === currentLevel) {
        item.classList.add('active');
      }
    });
  }

  loadAvailableRewards(userPoints) {
    const rewards = [
      {
        id: 'discount-10',
        name: 'Réduction 10%',
        description: '10% de réduction sur votre prochain service',
        points: 50,
        icon: 'fas fa-percentage'
      },
      {
        id: 'free-service',
        name: 'Service gratuit',
        description: 'Un service gratuit de votre choix',
        points: 200,
        icon: 'fas fa-gift'
      },
      {
        id: 'priority-booking',
        name: 'Réservation prioritaire',
        description: 'Accès prioritaire aux créneaux',
        points: 100,
        icon: 'fas fa-star'
      },
      {
        id: 'loyalty-bonus',
        name: 'Bonus fidélité',
        description: 'Double points sur votre prochaine visite',
        points: 150,
        icon: 'fas fa-plus-circle'
      }
    ];

    const availableRewards = rewards.filter(reward => userPoints >= reward.points);
    const container = document.getElementById('availableRewardsList');

    if (!container) return;

    if (availableRewards.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-gift"></i>
          <h3>Aucune récompense disponible</h3>
          <p>Continuez à accumuler des points pour débloquer des récompenses !</p>
        </div>
      `;
      return;
    }

    container.innerHTML = availableRewards.map(reward => `
      <div class="reward-item available">
        <i class="${reward.icon}"></i>
        <h4>${reward.name}</h4>
        <p>${reward.description}</p>
        <div class="points-required">${reward.points} points</div>
      </div>
    `).join('');
  }

  calculateAvailableRewards(userPoints) {
    const rewards = [
      { points: 50 },
      { points: 100 },
      { points: 150 },
      { points: 200 }
    ];
    return rewards.filter(reward => userPoints >= reward.points);
  }

  // ===== TOP CLIENTS =====
  loadTopClients() {
    const topClients = this.dataManager.getTopClients(3);
    const container = document.getElementById('topClients');

    if (!container) return;

    if (topClients.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-trophy"></i>
          <h3>Aucun classement disponible</h3>
          <p>Le classement sera mis à jour bientôt !</p>
        </div>
      `;
      return;
    }

    container.innerHTML = topClients.map((client, index) => `
      <div class="top-client-item">
        <div class="top-client-rank rank-${index + 1}">${index + 1}</div>
        <div class="top-client-info">
          <div class="top-client-name">${client.name}</div>
          <div class="top-client-points">${client.points} points</div>
        </div>
        <div class="top-client-visits">${client.visits} visites</div>
      </div>
    `).join('');
  }

  // ===== GESTION DES FORMULAIRES =====
  async handleReservation(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateReservationForm(data)) {
      return;
    }

    // Créer le rendez-vous
    const appointment = this.dataManager.addAppointment({
      ...data,
      userId: this.currentUser.id
    });

    // Ajouter des points
    this.dataManager.addPoints(this.currentUser.id, 10);

    this.showNotification('Rendez-vous créé avec succès !', 'success');
    form.reset();
    this.closeReservationModal();
    this.loadDashboardData();
  }

  async handleTestimonial(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!this.validateTestimonialForm(data)) {
      return;
    }

    // Créer le témoignage
    const testimonial = this.dataManager.addTestimonial({
      ...data,
      userId: this.currentUser.id,
      authorName: this.currentUser.name
    });

    // Ajouter des points bonus
    this.dataManager.addPoints(this.currentUser.id, 5);

    this.showNotification('Témoignage envoyé avec succès !', 'success');
    form.reset();
    this.closeTestimonialModal();
    this.loadDashboardData();
  }

  validateReservationForm(data) {
    if (!data.service) {
      this.showNotification('Veuillez sélectionner un service', 'error');
      return false;
    }

    if (!data.date) {
      this.showNotification('Veuillez sélectionner une date', 'error');
      return false;
    }

    const selectedDate = new Date(data.date);
    const today = new Date();
    if (selectedDate < today) {
      this.showNotification('La date sélectionnée est dans le passé', 'error');
      return false;
    }

    return true;
  }

  validateTestimonialForm(data) {
    if (!data.rating) {
      this.showNotification('Veuillez donner une note', 'error');
      return false;
    }

    if (!data.text || data.text.trim().length < 10) {
      this.showNotification('Le témoignage doit contenir au moins 10 caractères', 'error');
      return false;
    }

    return true;
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
}

// ===== FONCTIONS GLOBALES =====
let dashboardManager;

function openReservationModal() {
  const modal = document.getElementById('reservationModal');
  modal.classList.add('open');
}

function closeReservationModal() {
  const modal = document.getElementById('reservationModal');
  modal.classList.remove('open');
}

function openTestimonialModal() {
  const modal = document.getElementById('testimonialModal');
  modal.classList.add('open');
}

function closeTestimonialModal() {
  const modal = document.getElementById('testimonialModal');
  modal.classList.remove('open');
}

function filterHistory() {
  if (dashboardManager) {
    dashboardManager.filterHistory();
  }
}

function cancelAppointment(appointmentId) {
  if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
    dashboardManager.dataManager.updateAppointmentStatus(appointmentId, 'cancelled');
    dashboardManager.showNotification('Rendez-vous annulé', 'success');
    dashboardManager.loadDashboardData();
  }
}

function rescheduleAppointment(appointmentId) {
  // Ouvrir le modal de réservation avec les données du rendez-vous
  openReservationModal();
  // TODO: Pré-remplir le formulaire avec les données du rendez-vous
}

function logout() {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  dashboardManager = new DashboardManager();
  
  // Année dans le footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});


