# BusDirect — Gestion des Réservations de Places

Application web de gestion de réservations pour un réseau de transport interurbain, développée en JavaScript vanilla (modules ES6) avec persistance via `localStorage`.

## Démo & Liens
- **Site en ligne :** [Lien Vercel](https://busdirect-extension.vercel.app/)
- **Planification :** [Tableau Trello](https://trello.com/b/WsYwcFhl/busdirect)

---

## Fonctionnalités Clés
- **Liste des trajets (`index.html`) :** Affichage par cartes, recherche dynamique, filtres par statut et pagination.
- **Gestion de cabine (`cabine.html`) :** Plan interactif de 20 sièges, gestion des places VIP (+10% sur le tarif), et calcul automatique de la recette.
- **Réservations & Validations :** Contrôle de la unicité des noms et des numéros de téléphone (formats marocains `06`/`07`), avec gestion des formulaires dynamiques selon la capacité.
- **Liste d'attente automatisée :** File d'attente intelligente qui réattribue automatiquement les sièges libérés en cas d'annulation.

---

## Technologies Utilisées
- HTML5 / Tailwind CSS
- JavaScript ES6+ (Modules, Async/Await, Fetch, LocalStorage)
- Git & GitHub (Workflow par branches et Pull Requests)

---

## Structure du Projet

```text
busdirect-partie2/
├── index.html          # Page principale (Liste des trajets et filtres)
├── cabine.html         # Page de gestion de la cabine d'un trajet
├── tickets.html        # Page de consultation des tickets réservés
├── css/
│   └── style.css       # Styles personnalisés
├── data/
│   └── trips.json      # Données initiales des trajets (lecture seule)
├── img/                # Ressources graphiques (logos, etc.)
└── js/
    ├── store.js        # Gestion du stockage local et chargement fetch
    ├── reservations.js # Logique métier (prix, VIP, file d'attente)
    ├── validators.js   # Contrôles de saisie (regex, doublons)
    ├── ui.js           # Gestion de l'affichage de la page d'accueil
    ├── ui-cabine.js    # Rendu et interactions du plan de cabine
    ├── tickets.js      # Gestion de l'affichage des tickets
    ├── main-trajets.js # Point d'entrée de index.html
    └── main-cabine.js  # Point d'entrée de cabine.html