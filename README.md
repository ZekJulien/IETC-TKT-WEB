# IETC-TKT-WEB

Frontend **Angular** du projet **TKT** — application web (SPA) du système de **ticketing multi-tenant** (helpdesk interne), qui consomme l'API REST [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API).

> Cours « Projet de développement web » — BAC 2, Bachelier en Informatique : orientation développement d'applications — *Kamal BELOUH*.
> Backend C# / ASP.NET : dépôt séparé `IETC-TKT-API`.

> **État** : dépôt initialisé. Le projet Angular sera scaffoldé avec `ng new` ; les écrans sont développés au fil des epics / user stories.

---

## Le produit

Interface du helpdesk interne multi-tenant. Chaque utilisateur appartient à une ou plusieurs entreprises (tenants) et voit l'app selon son rôle :

| Rôle | Vue principale |
|------|----------------|
| **Owner** | gestion de l'entreprise, abonnement, membres |
| **Admin** | catégories, équipes, SLA, audit |
| **Agent** | file des tickets, prise en charge, résolution |
| **Member** | mes tickets, création de demande |

Parcours : inscription → création/rejoindre une entreprise → sélection du tenant actif → cycle de vie d'un ticket.

---

## Stack

- **Angular** (standalone components)
- **TypeScript**
- **RxJS** — flux asynchrones
- Client HTTP Angular (`HttpClient`) vers l'API `IETC-TKT-API`
- **JWT** — token stocké côté client, envoyé en `Authorization: Bearer <token>`

---

## Prérequis

- **Node.js** LTS (≥ 20)
- **Angular CLI** : `npm install -g @angular/cli`
- L'API backend qui tourne en local (voir `IETC-TKT-API` : `docker compose up -d` puis `dotnet run --project TKT.Api`)

---

## Démarrage

```bash
npm install
ng serve
```

- App : `http://localhost:4200`

### Configuration de l'API

L'URL du backend est dans `src/environments/environment.ts` :
```ts
export const environment = {
  production: false,
  baseUrl: 'https://localhost:7055'   // URL de l'API IETC-TKT-API
};
```
Les services de `src/app/services/api/` appellent `${environment.baseUrl}/...`. Le CORS est géré côté API.

---

## Authentification (côté client)

1. `POST /auth/login` → l'API renvoie un **JWT**.
2. Le token est stocké côté client et ajouté à chaque requête via un **HTTP interceptor** (`Authorization: Bearer <token>`).
3. Le **tenant actif** est transmis selon la stratégie retenue côté API (claim JWT ou header `X-Company-Id`).
4. Un **guard** protège les routes nécessitant une authentification.

---

## Périmètre fonctionnel (MoSCoW)

L'UI couvre, par epic, les fonctionnalités de l'API :

| Epic | Écrans |
|------|--------|
| 1 | Authentification, inscription, onboarding, profil |
| 2 | Entreprise, membres, rôles, abonnement, switch de tenant |
| 3 | **Tickets** — liste/filtres, détail, création, édition, commentaires, **Kanban**, recherche |
| 4 | Catégories, tags, pièces jointes |
| 5 | SLA & escalade |
| 6 | Équipes |
| 7 | Notifications (in-app) |
| 8 | Configuration & audit |
| 9 | Enrichissements UX (mentions, dashboard, temps réel) — post-MVP |

---

## Structure (convention du projet)

```
src/app/
├── app.ts/html/css             composant racine (Angular 21)
├── app.config.ts               providers (HttpClient, interceptors, …)
├── app.routes.ts               routing
├── components/                 composants UI réutilisables
│   └── header/
├── pages/                      vues liées à une route (1 dossier par écran)
│   ├── login-page/
│   ├── register-page/
│   ├── tickets-page/
│   └── …
└── services/
    ├── api/                    services qui appellent l'API
    │   ├── auth.service.ts
    │   ├── tickets.service.ts
    │   └── models/             interfaces TS miroir des DTO de l'API
    │       └── *.model.ts
    └── auth-state.service.ts   état client (auth, tenant actif)
src/environments/
└── environment.ts              baseUrl de l'API
```

---

## Conventions

- **Standalone components** (Angular moderne, pas de NgModules).
- **`pages/`** = vues routées (1 dossier par écran) ; **`components/`** = UI réutilisable.
- Appels API **uniquement** dans `services/api/*.service.ts` — jamais de HTTP dans les composants/pages.
- **`models/`** = interfaces TypeScript qui reflètent les DTO de l'API.
- État client (auth, tenant actif) dans des services dédiés (`services/auth-state.service.ts`).
- Token JWT via un **interceptor** ; routes protégées par **guards**.
- Secrets/locaux : jamais committés (voir `.gitignore`).
