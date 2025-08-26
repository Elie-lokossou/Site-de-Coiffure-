# Interface d'Administration - Ana Coiffure

## Vue d'ensemble

L'interface d'administration d'Ana Coiffure est un dashboard professionnel complet permettant de surveiller le trafic du site, gérer les offres promotionnelles et administrer tous les aspects du site web.

## Accès

Pour accéder à l'interface d'administration :
1. Allez sur la page de connexion (`connexion.html`)
2. Cliquez sur le lien "Accès Administration" en bas du formulaire
3. Ou accédez directement via `admin-dashboard.html`

## Fonctionnalités principales

### 📊 Dashboard
- **KPIs en temps réel** : Visites totales, visiteurs uniques, rendez-vous, note moyenne
- **Graphiques interactifs** : Évolution du trafic sur 7 ou 30 jours
- **Pages les plus visitées** : Répartition des visites par page
- **Activité récente** : Notifications des dernières actions

### 📈 Analytics
- **Filtres avancés** : Période (7j, 30j, 3 mois, 1 an) et métriques (visites, pages vues, taux de rebond, temps de session)
- **Graphiques détaillés** : Évolution du trafic avec données personnalisables
- **Sources de trafic** : Répartition par canal (Direct, Google, Facebook, Instagram, Autres)
- **Appareils utilisés** : Répartition mobile/desktop/tablet

### 🏷️ Gestion des Offres
- **Création d'offres** : Interface simple pour créer des promotions
- **Paramètres complets** :
  - Titre et description
  - Pourcentage de réduction
  - Service concerné (ou tous les services)
  - Dates de début et fin
  - Image de l'offre
  - Activation immédiate
- **Statistiques** : Vues, conversions, taux de conversion
- **Actions** : Modifier, activer/désactiver, supprimer

### 📅 Gestion des Rendez-vous
- **Filtres avancés** : Par statut, date, service
- **Tableau complet** : Client, service, date/heure, statut
- **Actions** : Voir les détails, modifier
- **Statuts** : En attente, Confirmé, Terminé, Annulé

### 👥 Gestion des Utilisateurs
- **Statistiques** : Total, nouveaux, actifs, taux de rétention
- **Tableau des utilisateurs** : Nom, email, inscription, dernière visite, nombre de RDV
- **Actions** : Voir profil, modifier

### 💬 Gestion des Témoignages
- **Modération** : Approuver/rejeter les témoignages
- **Filtres** : Par statut et note
- **Affichage complet** : Auteur, note, contenu, service, date
- **Actions** : Approuver, rejeter

### ⚙️ Paramètres
- **Général** : Nom du salon, email, téléphone, adresse
- **Notifications** : Email, SMS, nouveaux RDV, annulations
- **Sécurité** : Changement de mot de passe, authentification à deux facteurs
- **Sauvegarde** : Créer/restaurer des sauvegardes

## Interface utilisateur

### Design professionnel
- **Thème moderne** : Couleurs professionnelles, design épuré
- **Responsive** : Compatible mobile, tablette et desktop
- **Navigation intuitive** : Sidebar avec icônes et sections claires
- **Animations fluides** : Transitions et effets visuels

### Notifications
- **Système de notifications** : Panel latéral avec notifications en temps réel
- **Toast notifications** : Messages de confirmation/erreur
- **Badge de compteur** : Nombre de notifications non lues

### Graphiques interactifs
- **Chart.js** : Graphiques professionnels et interactifs
- **Données en temps réel** : Mise à jour automatique des KPIs
- **Filtres dynamiques** : Changement de période et métriques

## Structure technique

### Fichiers
- `admin-dashboard.html` : Page principale de l'interface
- `css/admin-dashboard.css` : Styles spécifiques à l'administration
- `js/admin-dashboard.js` : Logique JavaScript et interactions

### Dépendances
- **Chart.js** : Pour les graphiques
- **Font Awesome** : Pour les icônes
- **Google Fonts** : Pour la typographie

### Données
- **Données simulées** : Pour la démonstration
- **Structure extensible** : Prête pour l'intégration backend
- **LocalStorage** : Pour la persistance des données

## Utilisation

### Créer une offre
1. Allez dans la section "Gestion des Offres"
2. Cliquez sur "Nouvelle Offre"
3. Remplissez le formulaire :
   - Titre attractif
   - Description détaillée
   - Pourcentage de réduction
   - Service concerné
   - Dates de validité
   - Image (optionnel)
4. Activez l'offre immédiatement ou plus tard
5. Cliquez sur "Créer l'offre"

### Surveiller le trafic
1. Consultez le Dashboard pour une vue d'ensemble
2. Allez dans Analytics pour des détails
3. Utilisez les filtres pour personnaliser les données
4. Exportez les données si nécessaire

### Modérer les témoignages
1. Allez dans la section "Témoignages"
2. Utilisez les filtres pour trier
3. Lisez le contenu et la note
4. Cliquez sur "Approuver" ou "Rejeter"

## Sécurité

### Authentification
- Interface protégée (à implémenter avec backend)
- Gestion des sessions
- Déconnexion sécurisée

### Permissions
- Accès administrateur uniquement
- Logs des actions
- Sauvegarde des données

## Maintenance

### Sauvegarde
- Création automatique de sauvegardes
- Restauration en cas de problème
- Export des données

### Mise à jour
- Interface évolutive
- Ajout de nouvelles fonctionnalités
- Optimisation des performances

## Support

Pour toute question ou problème avec l'interface d'administration :
- Consultez ce README
- Vérifiez la console du navigateur pour les erreurs
- Contactez l'équipe technique

---

**Ana Coiffure - Interface d'Administration**  
*Dashboard professionnel pour la gestion complète du site web*






