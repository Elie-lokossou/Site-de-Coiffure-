// Système d'authentification avancé pour l'interface admin
class AdminAuthAdvanced {
    constructor() {
        // Liste des emails autorisés
        this.authorizedUsers = [
            {
                email: 'admin@anacoiffure.bj',
                password: 'AnaCoiffure2024!', // À changer !
                name: 'Administrateur Principal'
            },
            {
                email: 'manager@anacoiffure.bj',
                password: 'Manager2024!', // À changer !
                name: 'Manager'
            }
        ];
        
        this.isAuthenticated = false;
        this.currentUser = null;
        this.loginAttempts = 0;
        this.maxLoginAttempts = 3;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est déjà authentifié
        const authStatus = localStorage.getItem('adminAuthenticated');
        const lastLogin = localStorage.getItem('adminLastLogin');
        const currentTime = new Date().getTime();
        
        // Vérifier si la session n'a pas expiré (24h)
        if (authStatus === 'true' && lastLogin && (currentTime - parseInt(lastLogin)) < 24 * 60 * 60 * 1000) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(localStorage.getItem('adminUser'));
            this.showDashboard();
        } else {
            // Nettoyer les données expirées
            this.clearAuthData();
            this.showLoginForm();
        }
    }

    showLoginForm() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <i class="fas fa-user-shield"></i>
                            <h2>Accès Administration</h2>
                            <p>Connectez-vous avec vos identifiants</p>
                        </div>
                        
                        <div class="auth-tabs">
                            <button class="tab-btn active" data-tab="email">Email</button>
                            <button class="tab-btn" data-tab="code">Code d'accès</button>
                        </div>
                        
                        <!-- Formulaire Email -->
                        <form id="emailAuthForm" class="auth-form active">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Mot de passe</label>
                                <div class="password-input">
                                    <input type="password" id="password" required>
                                    <button type="button" class="toggle-password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Se connecter
                            </button>
                        </form>
                        
                        <!-- Formulaire Code -->
                        <form id="codeAuthForm" class="auth-form">
                            <div class="form-group">
                                <label for="adminCode">Code d'accès</label>
                                <input type="password" id="adminCode" required>
                            </div>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-key"></i> Se connecter
                            </button>
                        </form>
                        
                        <div class="auth-footer">
                            <a href="index.html" class="btn-secondary">
                                <i class="fas fa-arrow-left"></i> Retour au site
                            </a>
                        </div>
                        
                        <div class="security-info">
                            <p><i class="fas fa-shield-alt"></i> Connexion sécurisée</p>
                        </div>
                    </div>
                </div>
            `;

            // Ajouter les styles d'authentification
            this.addAuthStyles();

            // Gérer les onglets
            this.setupTabs();

            // Gérer la soumission des formulaires
            document.getElementById('emailAuthForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.authenticateByEmail();
            });

            document.getElementById('codeAuthForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.authenticateByCode();
            });

            // Gérer l'affichage du mot de passe
            document.querySelector('.toggle-password').addEventListener('click', (e) => {
                const input = document.getElementById('password');
                const icon = e.target;
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        }
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const authForms = document.querySelectorAll('.auth-form');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Activer l'onglet
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Afficher le formulaire correspondant
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tab}AuthForm`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    authenticateByEmail() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Vérifier les tentatives de connexion
        if (this.isLockedOut()) {
            this.showNotification('Trop de tentatives. Réessayez dans 15 minutes.', 'error');
            return;
        }

        // Vérifier les identifiants
        const user = this.authorizedUsers.find(u => u.email === email);
        
        if (user && user.password === password) {
            this.loginSuccess(user);
        } else {
            this.loginFailed();
        }
    }

    authenticateByCode() {
        const code = document.getElementById('adminCode').value.trim();
        
        // Code d'accès de secours
        const backupCode = 'ANA2024';
        
        if (code === backupCode) {
            this.loginSuccess({
                email: 'admin@anacoiffure.bj',
                name: 'Administrateur (Code)'
            });
        } else {
            this.loginFailed();
        }
    }

    loginSuccess(user) {
        this.isAuthenticated = true;
        this.currentUser = user;
        this.loginAttempts = 0;
        
        // Sauvegarder les données d'authentification
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('adminLastLogin', new Date().getTime().toString());
        
        this.showDashboard();
        this.showNotification(`Bienvenue, ${user.name} !`, 'success');
    }

    loginFailed() {
        this.loginAttempts++;
        localStorage.setItem('adminLoginAttempts', this.loginAttempts.toString());
        localStorage.setItem('adminLastAttempt', new Date().getTime().toString());
        
        if (this.loginAttempts >= this.maxLoginAttempts) {
            this.showNotification('Trop de tentatives. Réessayez dans 15 minutes.', 'error');
        } else {
            const remaining = this.maxLoginAttempts - this.loginAttempts;
            this.showNotification(`Identifiants incorrects. ${remaining} tentative(s) restante(s).`, 'error');
        }
        
        // Vider les champs
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('adminCode').value = '';
    }

    isLockedOut() {
        const lastAttempt = localStorage.getItem('adminLastAttempt');
        if (!lastAttempt) return false;
        
        const currentTime = new Date().getTime();
        const timeSinceLastAttempt = currentTime - parseInt(lastAttempt);
        
        return this.loginAttempts >= this.maxLoginAttempts && timeSinceLastAttempt < this.lockoutTime;
    }

    showDashboard() {
        // Recharger la page pour afficher le dashboard
        window.location.reload();
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.clearAuthData();
        this.showLoginForm();
        this.showNotification('Déconnexion réussie !', 'info');
    }

    clearAuthData() {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminLastLogin');
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLastAttempt');
    }

    addAuthStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
            }

            .auth-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
                text-align: center;
            }

            .auth-header {
                margin-bottom: 30px;
            }

            .auth-header i {
                font-size: 48px;
                color: #667eea;
                margin-bottom: 20px;
            }

            .auth-header h2 {
                color: #333;
                margin-bottom: 10px;
                font-size: 24px;
            }

            .auth-header p {
                color: #666;
                font-size: 14px;
            }

            .auth-tabs {
                display: flex;
                margin-bottom: 20px;
                border-radius: 10px;
                background: #f5f5f5;
                padding: 4px;
            }

            .tab-btn {
                flex: 1;
                padding: 10px;
                border: none;
                background: transparent;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .tab-btn.active {
                background: #667eea;
                color: white;
            }

            .auth-form {
                display: none;
                margin-bottom: 30px;
            }

            .auth-form.active {
                display: block;
            }

            .form-group {
                margin-bottom: 20px;
                text-align: left;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
            }

            .form-group input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 10px;
                font-size: 16px;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }

            .password-input {
                position: relative;
            }

            .toggle-password {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 0;
            }

            .auth-footer {
                border-top: 1px solid #e1e5e9;
                padding-top: 20px;
                margin-bottom: 20px;
            }

            .security-info {
                font-size: 12px;
                color: #666;
            }

            .security-info i {
                color: #4caf50;
                margin-right: 5px;
            }

            .btn-primary, .btn-secondary {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 100%;
                justify-content: center;
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }

            .btn-secondary {
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
            }

            .btn-secondary:hover {
                background: #667eea;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    showNotification(message, type = 'info') {
        // Créer une notification simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialiser l'authentification avancée quand la page se charge
document.addEventListener('DOMContentLoaded', () => {
    new AdminAuthAdvanced();
});






