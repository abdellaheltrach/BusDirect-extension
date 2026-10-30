# BusDirect — Gestion des Réservations de Places (Partie 2)

Bienvenue sur le dépôt du projet **BusDirect** (Partie 2). Cette application web permet de digitaliser et d'optimiser la gestion des réservations de places pour un réseau complet de **20 trajets interurbains** (ex. Safi → Marrakech). L'agent de réservation peut consulter la liste des trajets, gérer les attributions de sièges standard et VIP, inscrire les passagers en liste d'attente et suivre les statistiques en temps réel.

## Démo en ligne & Gestion de projet

- **Voir le site en ligne :** [Lien Vercel](https://busdirect-extension.vercel.app/)
- **Voir la planification :** [Lien vers le tableau Trello](https://trello.com/b/WsYwcFhl/busdirect)

---

## Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Fonctionnalités & Points forts](#fonctionnalités--points-forts)
- [Technologies utilisées](#technologies-utilisées)
- [Structure des fichiers](#structure-des-fichiers)
- [Auteur](#auteur)

---

## À propos du projet

BusDirect étend sa solution de réservation à l'ensemble de son réseau de transport. L'application offre une interface multi-pages, responsive et dynamique pilotée par des données (`trips.json`). Elle gère l'attribution automatique ou manuelle des sièges, la tarification préférentielle VIP, une liste d'attente automatisée lors des annulations et la persistance locale des données (`localStorage`).

---

## Fonctionnalités & Points forts

- **Gestion Multi-Trajets (`index.html`) :**
  - Affichage des trajets sous forme de cartes (villes, horaires, prix, places libres, statut Disponible/Complet).
  - Recherche dynamique par ville et filtrage par statut.
  - Pagination par tranche de 6 trajets.
  - Statistiques globales du réseau (recette totale et nombre total de passagers).

- **Gestion de la Cabine (`cabine.html`) :**
  - Plan interactif des 20 sièges par trajet.
  - **Sièges VIP (01 à 04) :** Distinction visuelle et majoration de +10 % sur le prix de base (ex. 90 → 99 DH), prise en compte dans la recette globale du trajet.
  - **Réservation :** Sélection manuelle ou attribution automatique du premier siège libre non-VIP.
  - **Validations strictes :** Nom obligatoire et unique sur le trajet ; numéro de téléphone au format valide (`06` ou `07` suivi de 8 chiffres) et unique sur le trajet.
  - **Modification & Annulation :** Édition des réservations et libération instantanée des sièges.

- **Gestion de la Liste d'Attente :**
  - Inscription automatique/manuelle des passagers sur liste d'attente lorsque le trajet est complet.
  - **Attribution automatique :** Lors de l'annulation d'une réservation, le premier passager en liste d'attente récupère automatiquement le siège libéré.
  - Possibilité de retirer un passager de la liste d'attente.

- **Expérience Utilisateur & Persistance :**
  - Messages de notification éphémères (masqués au bout de 3 secondes) après chaque action.
  - Chargement initial des données via `fetch` depuis `data/trips.json` puis sauvegarde continue dans `localStorage`.
  - Design fluide et responsive (Tailwind CSS / CSS personnalisé).

---

## Technologies utilisées

- **HTML5 & CSS3 / Tailwind CSS**
- **JavaScript ES6+** (Modules `import` / `export`, `async/await`, `fetch`, `localStorage`)
- **Git & GitHub** (Workflow par branches fonctionnalités et Pull Requests)

---

## Structure des fichiers

```text
busdirect-partie2/
├── index.html                     Page principale (Liste des trajets & statistiques)
├── cabine.html                    Page de gestion de la cabine d'un trajet (?id=...)
├── tikets.html                    Page de consultation des billets
├── css/
│   └── style.css                  Styles CSS complémentaires
├── img/
│   └── logo.png                   Logo de l'application
├── data/
│   └── trips.json                 Données initiales des 20 trajets (lecture seule)
├── js/
│   ├── store.js                   Gestion des données (fetch initial & localStorage)
│   ├── validators.js              Validations par expressions régulières (Regex & contraintes)
│   ├── reservations.js            Logique métier (réservations, VIP, recette, liste d'attente)
│   ├── render.js                  Fonctions d'affichage DOM (cartes, cabine, notifications)
│   ├── ui.js                      Interactions et composants UI
│   ├── script.js                  Scripts utilitaires
│   ├── tikets.js                  Gestion spécifique à la page des billets
│   ├── main-trajets.js            Point d'entrée pour index.html (recherche, filtres, pagination)
│   └── main-cabine.js             Point d'entrée pour cabine.html (actions sur la cabine)
└── README.md                      Documentation du projet