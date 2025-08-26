// Système d'authentification pour l'interface admin
class AdminAuth {
    constructor() {
        this.adminCode = 'ANA2024'; // Code d'accès admin - CHANGEZ CE CODE !
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est déjà authentifié
        const authStatus = localStorage.getItem('adminAuthenticated');
        if (authStatus === 'true') {
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
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
                            <p>Entrez le code d'accès pour continuer</p>
                        </div>
                        <form id="adminAuthForm" class="auth-form">
                            <div class="form-group">
                                <label for="adminCode">Code d'accès</label>
                                <input type="password" id="adminCode" required>
                            </div>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Se connecter
                            </button>
                        </form>
                        <div class="auth-footer">
                            <a href="index.html" class="btn-secondary">
                                <i class="fas fa-arrow-left"></i> Retour au site
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // Ajouter les styles d'authentification
            this.addAuthStyles();

            // Gérer la soumission du formulaire
            document.getElementById('adminAuthForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.authenticate();
            });
        }
    }

    authenticate() {
        const codeInput = document.getElementById('adminCode');
        const enteredCode = codeInput.value.trim();

        if (enteredCode === this.adminCode) {
            this.isAuthenticated = true;
            localStorage.setItem('adminAuthenticated', 'true');
            this.showDashboard();
            this.showNotification('Connexion réussie !', 'success');
        } else {
            this.showNotification('Code d\'accès incorrect !', 'error');
            codeInput.value = '';
            codeInput.focus();
        }
    }

    showDashboard() {
        // Recharger la page pour afficher le dashboard
        window.location.reload();
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('adminAuthenticated');
        this.showLoginForm();
        this.showNotification('Déconnexion réussie !', 'info');
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

            .auth-form {
                margin-bottom: 30px;
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
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }

            .auth-footer {
                border-top: 1px solid #e1e5e9;
                padding-top: 20px;
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialiser l'authentification quand la page se charge
document.addEventListener('DOMContentLoaded', () => {
    new AdminAuth();
});
