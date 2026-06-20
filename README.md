# IETC-TKT-WEB

Frontend **Angular** du projet **TKT** — application web (SPA) du système de **ticketing multi-tenant** (helpdesk interne), qui consomme l'API REST [`IETC-TKT-API`](https://github.com/ZekJulien/IETC-TKT-API).

> Cours « Projet de développement web » — BAC 2, Bachelier en Informatique : orientation développement d'applications — *Kamal BELOUH*.
> Backend C# / ASP.NET : dépôt séparé `IETC-TKT-API`.

> **État** : stack Angular 21 en place. **US 1.1 (inscription)** implémentée — formulaire d'inscription + page « Vérifiez votre email ». Les écrans suivants sont développés au fil des epics / user stories.

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

- **Angular 21** (standalone components, **signaux**)
- **TypeScript** strict (`strictTemplates`)
- **RxJS** — au bord (HttpClient), converti en signaux via `toSignal`
- Client HTTP Angular (`HttpClient`) vers l'API `IETC-TKT-API`
- **i18n maison** — store à signaux + pipe `| translate`, clés typées (`TranslationKey`), switch de langue runtime (FR pour l'instant)
- **JWT** — token stocké côté client, envoyé en `Authorization: Bearer <token>` *(à venir)*

### Bibliothèque tierce front

- **[`@lucide/angular`](https://lucide.dev/guide/packages/angular)** — jeu d'icônes SVG utilisé pour les cartes KPI du tableau de bord. Version standalone / signal-based, importée par icône (`<svg lucideInbox></svg>`). Installation : `npm i @lucide/angular`.

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

L'URL du backend est dans `src/environments/environment.ts` (et `environment.development.ts` en dev) :
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5083/api'   // base + préfixe /api de l'API IETC-TKT-API
};
```
Les services de `src/app/api/` appellent `${environment.apiUrl}/...` (ex. `${apiUrl}/auth/register`).

> ⚠️ Le **CORS n'est pas encore configuré côté API**. Pour appeler le backend depuis `localhost:4200`, il faudra ajouter `AddCors`/`UseCors` dans `IETC-TKT-API`.

---

## Authentification (côté client) *(à venir)*

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

Organisation **par concern** (dossiers à plat sous `app/`), chaque concern **groupé par feature** avec un **barrel `index.ts`**. Pas de dossier `services/` fourre-tout.

```
src/app/
├── app.ts/html/css             composant racine
├── app.config.ts               providers (HttpClient + interceptors, router…)
├── app.routes.ts               routing (écrans auth hors Layout)
├── api/                        services HTTP + interceptors
│   ├── auth/                   auth.service.ts (+ index.ts)
│   └── api-error-interceptor.ts   mapping d'erreur centralisé (générique)
├── models/                     DTO (interfaces) — 1 interface = 1 fichier
│   ├── auth/                   register-request.ts (+ index.ts)
│   └── api-error.ts            forme générique { error }
├── state/                      stores à signaux (état client)
│   └── auth/                   auth-store.ts (+ index.ts)
├── validators/                 ValidatorFn réutilisables
│   └── auth/                   auth-validators.ts (+ index.ts)
├── i18n/                       i18n maison
│   ├── fr/                     common.ts, register-page.ts… (+ index.ts barrel)
│   ├── i18n-store.ts           signal `lang` + `t(key, params)`
│   └── translate-pipe.ts       pipe `| translate`
├── components/                 UI réutilisable
│   ├── auth-shell/             coquille des écrans auth
│   └── ui/                     button, input (CVA), form-field, password-rules
└── pages/                      vues routées (1 dossier par écran)
    ├── register-page/
    └── verify-email-page/
src/environments/
└── environment.ts              apiUrl de l'API
```

Règles : **collection au pluriel** (`models`, `validators`, `components`, `pages`), **domaine au singulier** (`auth`). Le **générique cross-cutting** (interceptor, `api-error`) reste à la racine de son concern.

---

## Conventions

- **Standalone components** (pas de NgModules) ; **signaux** pour l'état.
- **Zéro commentaire** dans le code.
- **Scaffolding au CLI** : `ng g c/s/guard/interceptor/pipe…` — jamais créé à la main (sauf interfaces/classes simples, écrites directement).
- Organisation **par concern à plat** sous `app/`, **groupée par feature** + barrel `index.ts`.
- **`pages/`** = vues routées ; **`components/`** = UI réutilisable ; écrans auth **hors `Layout`** (sans navbar).
- Appels HTTP **uniquement** dans `api/<feature>/*.service.ts` (HttpClient → Observable). Jamais de HTTP dans les composants/pages.
- **État client** = **stores à signaux** (`state/<feature>/*-store.ts`) : signaux + méthodes ; la page ne fait que l'**affichage**.
- **Mapping d'erreur** centralisé dans `apiErrorInterceptor` (jamais dupliqué dans les stores).
- **`models/`** = interfaces miroir des DTO de l'API (1 interface = 1 fichier).
- **i18n** : chaînes via clés (`{{ 'x' | translate }}`), dictionnaires typés (`TranslationKey`), bascule de langue runtime.
- **Validation** : `ValidatorFn` dans `validators/` ; correspondance de champs via **validateur de groupe**.
- Token JWT via **interceptor** ; routes protégées par **guards** *(à venir)*.
- Secrets/locaux : jamais committés (voir `.gitignore`).
