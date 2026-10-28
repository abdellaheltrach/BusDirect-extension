# BusDirect - Gestion de Réservation de Sièges

Bienvenue sur le dépôt du projet **BusDirect**. Cette application web permet de digitaliser et d'optimiser la gestion des réservations de sièges pour la ligne interurbaine Safi → Marrakech. L'agent de réservation peut visualiser le plan de la cabine en temps réel, gérer les attributions et suivre les recettes.

## Démo en ligne & Gestion de projet

- **Voir le site en ligne :** [[Lien Vercel](https://busdirect-nine.vercel.app/)]
- **Voir la planification :** [[Lien vers le tableau de suivi](https://trello.com/b/WsYwcFhl/busdirect)]

## Sommaire

- À propos du projet
- Fonctionnalités & Points forts
- Technologies utilisées
- Structure des fichiers
- Respect des normes, Accessibilité & SEO
- Auteur

---

## À propos du projet

L'application offre une interface interactive et responsive pour gérer les 20 places du bus. Elle permet d'ajouter, modifier et supprimer des réservations en toute simplicité, avec une persistance des données via le `localStorage`.

---

## Fonctionnalités & Points forts

- **Gestion interactive des places :** 
  - Réservation de sièges (sélection manuelle ou attribution automatique du premier siège libre).
  - Modification d'une réservation (changement du nom du passager ou du siège).
  - Suppression d'une réservation pour libérer instantanément le siège.
- **Suivi en temps réel :** Compteur de places disponibles et calcul automatique de la recette totale (80 DH par place).
- **Persistance :** Sauvegarde des données avec le `localStorage` pour conserver l'état après actualisation.
- **Pages multiples :** Page principale de gestion et page dédiée (`tikets.html`) pour consulter l'ensemble des billets réservés.
- **Responsive Design :** S'adapte parfaitement aux mobiles, tablettes et ordinateurs.

---

## Structure des fichiers

```text
busdirect/
├── index.html                     page Trajets
├── cabine.html                    page Cabine d'un trajet
├── data/
│   └── trips.json                 20 trajets (lecture seule)
├── js/
│   ├── store.js                   données
│   │   ├── initialiser()              localStorage, sinon fetch de trips.json
│   │   └── sauvegarder(trips)         enregistre dans le localStorage
│   │
│   ├── validators.js              validations
│   │   ├── REGEX_TELEPHONE
│   │   └── validerPassager(trip, p)   nom vide ou en double, téléphone invalide ou en double
│   │
│   ├── reservations.js            logique (aucun DOM)
│   │   ├── placesLibres(trip)         capacity - reservations.length
│   │   ├── estVIP(siege)              sièges 01 à 04
│   │   ├── prixSiege(prix, siege)     +10 % si VIP
│   │   ├── recetteTrajet(trip)        reduce
│   │   ├── reserver(trip, p, siege)
│   │   ├── modifier(trip, siege, p)
│   │   ├── annuler(trip, siege)       + 1er en attente obtient le siège
│   │   ├── inscrireEnAttente(trip, p)
│   │   └── retirerDeAttente(trip, i)
│   │
│   ├── render.js                  affichage
│   │   ├── renderTrajets(trips)       cartes
│   │   ├── renderPagination(page, total)
│   │   ├── renderCabine(trip)         en-tête + 20 sièges
│   │   ├── renderListeAttente(trip)
│   │   └── afficherMessage(el, texte) masqué après 3 secondes
│   │
│   ├── main-trajets.js            point d'entrée de index.html
│   │   └── afficher()                 recherche + filtre + page courante
│   │
│   └── main-cabine.js             point d'entrée de cabine.html
│       └── afficherTout()             réaffiche la cabine après chaque action
│
└── README.md
