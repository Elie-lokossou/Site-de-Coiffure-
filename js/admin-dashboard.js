// Admin Dashboard JavaScript - Version simple et fonctionnelle

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard initialisé');
    
    // Initialiser la navigation
    initializeNavigation();
    
    // Initialiser les onglets
    initializeTabs();
    
    // Initialiser les modales
    initializeModals();
    
    // Initialiser les graphiques
    initializeCharts();
    
    // Initialiser les formulaires
    initializeForms();
    
    // Initialiser les boutons d'action
    initializeActionButtons();
});

// Navigation entre les sections
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionName = this.getAttribute('data-section');
            showSection(sectionName);
        });
    });
}

function showSection(sectionName) {
    console.log('Affichage de la section:', sectionName);
    
    // Cacher toutes les sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Retirer la classe active de tous les éléments de navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Ajouter la classe active à l'élément de navigation
    const sidebarItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (sidebarItem) {
        sidebarItem.classList.add('active');
    }
}

// Gestion des onglets dans les paramètres
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    console.log('Affichage de l\'onglet:', tabName);
    
    // Cacher tous les contenus d'onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Retirer la classe active de tous les boutons d'onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Ajouter la classe active au bouton d'onglet
    const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }
}

// Gestion des modales
function initializeModals() {
    // Fermer les modales en cliquant sur le bouton de fermeture
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Fermer les modales en cliquant à l'extérieur
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Fonctions globales pour les modales
function openAddOfferModal() {
    document.getElementById('addOfferModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialisation des graphiques Chart.js
function initializeCharts() {
    // Vérifier si Chart.js est disponible
    if (typeof Chart === 'undefined') {
        console.log('Chart.js non disponible');
        return;
    }
    
    console.log('Initialisation des graphiques...');
    
    // Graphique des visites
    const visitsCtx = document.getElementById('visitsChart');
    if (visitsCtx) {
        new Chart(visitsCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Visites',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Graphique des pages visitées
    const pagesCtx = document.getElementById('pagesChart');
    if (pagesCtx) {
        new Chart(pagesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Accueil', 'Services', 'Galerie', 'Contact', 'À propos'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Graphique des sources de trafic
    const sourcesCtx = document.getElementById('sourcesChart');
    if (sourcesCtx) {
        new Chart(sourcesCtx, {
            type: 'pie',
            data: {
                labels: ['Google', 'Facebook', 'Instagram', 'Direct', 'Autres'],
                datasets: [{
                    data: [40, 25, 20, 10, 5],
                    backgroundColor: [
                        '#4285f4',
                        '#1877f2',
                        '#e4405f',
                        '#25d366',
                        '#6c757d'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Graphique des appareils
    const devicesCtx = document.getElementById('devicesChart');
    if (devicesCtx) {
        new Chart(devicesCtx, {
            type: 'bar',
            data: {
                labels: ['Mobile', 'Desktop', 'Tablet'],
                datasets: [{
                    label: 'Utilisateurs',
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialisation des formulaires
function initializeForms() {
    // Formulaire d'ajout d'offre
    const addOfferForm = document.getElementById('addOfferForm');
    if (addOfferForm) {
        addOfferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const offerData = {
                title: document.getElementById('offerTitle').value,
                description: document.getElementById('offerDescription').value,
                originalPrice: document.getElementById('originalPrice').value,
                discountedPrice: document.getElementById('discountedPrice').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value
            };
            
            console.log('Nouvelle offre:', offerData);
            
            // Fermer la modale
            closeModal('addOfferModal');
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Afficher une notification
            showNotification('Offre ajoutée avec succès !', 'success');
        });
    }
    
    // Formulaires de paramètres
    document.querySelectorAll('.settings-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Sauvegarde des paramètres...');
            showNotification('Paramètres sauvegardés avec succès !', 'success');
        });
    });
}

// Initialisation des boutons d'action
function initializeActionButtons() {
    // Gestion des boutons d'action dans les tableaux
    document.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const icon = actionBtn.querySelector('i');
            const isEdit = icon && icon.classList.contains('fa-edit');
            const isDelete = icon && icon.classList.contains('fa-trash');
            const isView = icon && icon.classList.contains('fa-eye');
            
            if (isDelete) {
                if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                    const row = actionBtn.closest('tr');
                    if (row) {
                        row.remove();
                        showNotification('Élément supprimé avec succès !', 'success');
                    }
                }
            } else if (isEdit) {
                showNotification('Fonctionnalité d\'édition à implémenter', 'info');
            } else if (isView) {
                showNotification('Fonctionnalité de visualisation à implémenter', 'info');
            }
        }
    });
}

// Fonction de notification
function showNotification(message, type = 'info') {
    console.log(`Notification [${type}]:`, message);
    
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = 'index.html';
    }
}

// Fonctions de sauvegarde (placeholders)
function createBackup() {
    showNotification('Fonctionnalité de sauvegarde à implémenter', 'info');
}

function restoreBackup() {
    showNotification('Fonctionnalité de restauration à implémenter', 'info');
}
