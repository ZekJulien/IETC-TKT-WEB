# IETC-TKT-WEB

Frontend **Angular** du projet **TKT** — application web (SPA) d'un système de **ticketing multi-tenant** (helpdesk interne), qui consomme l'API REST [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API).

> Cours « Projet de développement web » — BAC 2, Bachelier en Informatique : orientation développement d'applications — *Kamal BELOUH*.
> Backend C# / ASP.NET : dépôt séparé [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API).

---

## Le produit

Helpdesk interne multi-tenant. Chaque utilisateur appartient à une ou plusieurs entreprises (tenants) et voit l'application selon son rôle dans le tenant actif :

| Rôle | Vue principale |
|------|----------------|
| **Owner** | gestion de l'entreprise, abonnement, membres |
| **Admin** | membres, rôles, configuration |
| **Agent** | file des tickets, prise en charge, résolution |
| **Member** | ses tickets, création de demande |

Parcours : inscription / connexion → création ou sélection d'une entreprise → tableau de bord → cycle de vie d'un ticket (liste, filtres, détail, édition, commentaires).

---

## Fonctionnalités couvertes

- **Authentification** : inscription, vérification d'email, connexion, déconnexion (JWT + refresh token).
- **Multi-tenant** : sélection du tenant actif, bascule d'entreprise (un même compte peut avoir un rôle différent par entreprise).
- **Onboarding** : création d'une entreprise.
- **Membres** : liste, invitation, changement de rôle, quota de sièges selon l'abonnement.
- **Tickets** : tableau filtrable/triable, compteurs par statut, pagination, détail, création, édition (statut/priorité/assignation/échéance), commentaires (publics / internes, avec réponses).
- **Tableau de bord** : cartes KPI cliquables.
- **Transverse** : i18n maison (FR), barre de chargement globale, gestion d'erreur centralisée, routes protégées.

---

## Stack

- **Angular 21** — standalone components, **signaux** pour l'état
- **TypeScript** strict (`strictTemplates`)
- **RxJS** au bord (HttpClient)
- **HttpClient** Angular vers l'API `IETC-TKT-API`, avec **interceptors** (requête, erreur, refresh token, loading)
- **i18n maison** — store à signaux + pipe `| translate`, clés typées (`TranslationKey`), bascule de langue runtime (FR)
- **JWT** — access token + refresh token gérés par interceptors ; routes protégées par **guards**

### Bibliothèque tierce

- **[`@lucide/angular`](https://lucide.dev/guide/packages/angular)** — jeu d'icônes SVG (cartes KPI, navigation). Version standalone / signal-based, importée par icône (`<svg lucideInbox></svg>`). Installation : `npm i @lucide/angular`.

---

## Prérequis

| Outil | Version |
|-------|---------|
| **Node.js** | 20 LTS ou supérieur (testé sur Node 24) |
| **Angular CLI** | 21 (`npm install -g @angular/cli`) |
| **API backend** | [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API) en .NET 10, lancée en local |
| **Base de données** | PostgreSQL 18 (fournie via Docker par le backend) |

---

## Démarrage

Prérequis : **Docker**. (L'option B ajoute **Node 20+** et l'**Angular CLI**.) Application sur **http://localhost:8080**.

Schéma, rôles et **comptes de démo** sont embarqués dans l'image DB. Mot de passe commun : **`Demo1234`**.

### Sans rien cloner — toute la stack en une commande

Le compose est tiré directement de GitHub, les images de `ghcr.io` : rien à cloner, juste Docker.

```bash
curl -fsSL https://raw.githubusercontent.com/ZekJulien/IETC-TKT-WEB/main/docker-compose.ghcr.yml | docker compose -p tkt -f - up
```

> Le même fichier existe dans [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API) : peu importe le dépôt, la stack est identique. Arrêter / repartir propre : remplacer `up` par `down -v`.

### Depuis le dépôt cloné

```bash
git clone https://github.com/ZekJulien/IETC-TKT-WEB.git
cd IETC-TKT-WEB
```

**Option A — toute l'application dans Docker**

```bash
docker compose -f docker-compose.ghcr.yml up
```

**Option B — backend dans Docker + front en local (`ng serve`)**

Pour développer le front (rechargement à chaud) : DB + API en conteneur, puis le serveur Angular.

```bash
docker compose -f docker-compose.ghcr.yml up -d db api   # PostgreSQL + API sur http://localhost:5083
npm install
ng serve                                                  # http://localhost:4200
```

L'URL du backend est dans `src/environments/environment.development.ts` (utilisé par `ng serve`) :

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5083/api',
};
```

> **Base propre** : `docker compose -f docker-compose.ghcr.yml down -v`. Le CORS est ouvert côté API en dev.

---

## Comptes de démonstration

Tous les comptes de démo (script `Database/seed.sql` du backend) partagent le mot de passe : **`Demo1234`**

| Email | Nom | Rôle |
|-------|-----|------|
| `owner@acme.test` | Alice Martin | **Owner** — Acme (+ Admin Globex) |
| `admin@acme.test` | Bruno Lefebvre | Admin — Acme |
| `agent1@acme.test` | Chloé Dubois | Agent — Acme |
| `agent2@acme.test` | David Bernard | Agent — Acme |
| `member1@acme.test` | Emma Rousseau | Member — Acme |
| `member2@acme.test` | Lucas Moreau | Member — Acme |
| `owner@globex.test` | Sophie Laurent | Owner — Globex |
| `nadia@acme.test` | Nadia Haddad | **Multi-tenant** : Member chez Acme, Agent chez Globex |

> `owner@acme.test` et `nadia@acme.test` appartiennent à **deux entreprises** : idéal pour démontrer la bascule de tenant et le rôle différencié par entreprise.

---

## Authentification (côté client)

1. `POST /auth/login` → l'API renvoie un **access token (JWT)** et un **refresh token**.
2. `apiRequestInterceptor` ajoute l'en-tête `Authorization: Bearer <token>` (et le contexte tenant) à chaque requête.
3. `apiRefreshInterceptor` rejoue la requête après rafraîchissement quand l'access token expire.
4. `apiErrorInterceptor` centralise le mapping des erreurs HTTP.
5. Les **guards** protègent les routes : `auth-guard` (authentifié), `guest-guard` (pages auth réservées aux non-connectés), `tenant-guard` (tenant actif requis).

---

## Structure

Organisation **par concern** (dossiers à plat sous `app/`), chaque concern **groupé par feature** avec un **barrel `index.ts`**.

```
src/app/
├── app.ts/html/css             composant racine
├── app.config.ts               providers (HttpClient + interceptors, router…)
├── app.routes.ts               routing
├── routing/                    UrlSerializer custom (slug d'entreprise dans l'URL)
├── api/                        services HTTP + interceptors
│   ├── auth/ · tickets/ · companies/…   un service par feature
│   ├── api-request-interceptor.ts       JWT + contexte tenant
│   ├── api-refresh-interceptor.ts       refresh token
│   ├── api-error-interceptor.ts         mapping d'erreur centralisé
│   └── loading-interceptor.ts           barre de chargement globale
├── guards/                     auth-guard · guest-guard · tenant-guard
├── state/                      stores à signaux (état client) — un par feature
├── models/                     DTO (interfaces) — 1 interface = 1 fichier
├── validators/                 ValidatorFn réutilisables
├── i18n/                       i18n maison (store à signaux + pipe + dictionnaires FR typés)
├── components/                 UI réutilisable
│   ├── ui/                     alert, avatar, badge, button, datatable, form-field,
│   │                           input, kpi-card, modal, muted, page-header,
│   │                           password-rules, select, stepper,
│   │                           ticket-status-badge, ticket-priority-badge
│   ├── layout/ · navbar/ · auth-shell/ · global-loading-bar/
│   ├── tenant-switcher/
│   ├── tickets-table/ · tickets-toolbar/ · ticket-form/ · ticket-comments/
│   └── member-list/ · invite-member/
└── pages/                      vues routées (1 dossier par écran)
    ├── login-page/ · register-page/ · verify-email-page/
    ├── onboarding-page/ · tenant-selection/
    ├── dashboard/ · members-page/
    ├── tickets-page/ · create-ticket-page/ · ticket-detail-page/
    └── maintenance/
src/environments/
└── environment.development.ts  apiUrl de l'API
```

---

## Conventions

- **Standalone components** (pas de NgModules) ; **signaux** pour l'état.
- Appels HTTP **uniquement** dans `api/<feature>/*.service.ts` (HttpClient → Observable). Jamais de HTTP dans les composants/pages.
- **État client** = **stores à signaux** (`state/<feature>/*-store.ts`) : signaux + méthodes ; la page se contente de l'**affichage**. Aucune librairie de gestion d'état externe (pas de NgRx/Redux).
- **Mapping d'erreur** centralisé dans `apiErrorInterceptor`.
- **`models/`** = interfaces miroir des DTO de l'API (1 interface = 1 fichier).
- **`components/ui/`** = composants réutilisables sans logique métier (dont des CVA : `input`, `select`).
- **i18n** : chaînes via clés (`{{ 'x' | translate }}`), dictionnaires typés (`TranslationKey`), bascule de langue runtime.
- **Validation** : `ValidatorFn` dans `validators/` ; correspondance de champs via validateur de groupe.
- Nouvelle syntaxe Angular partout : `@if` / `@for` / `@switch`.
- Secrets / fichiers locaux : jamais committés (voir `.gitignore`).

---

## Docker / build de production

Le front se construit en image Docker (`ng build` → **nginx**). nginx sert l'application et **proxifie `/api`** vers le backend ; `src/environments/environment.ts` utilise donc `apiUrl: '/api'` (même origine, pas de CORS).

Pour lancer **toute la stack** (DB + API + front) en une seule commande, voir le README de [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API) → « Démarrage tout-en-un (Docker) ».

Build manuel :

```bash
ng build
```

Sortie dans `dist/tkt-web/browser`.
