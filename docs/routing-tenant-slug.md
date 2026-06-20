# Routing multi-tenant — slug dans l'URL

Référence technique du préfixe `/:slug/` dans les URLs (ex. `/acme/dashboard`).

## TL;DR

Le slug de l'entreprise active est injecté dans l'URL via un `UrlSerializer` custom.
L'application reste **slug-agnostique** : routes, `routerLink`, guards et params
travaillent tous sur des chemins plats (`/dashboard`, `/tickets/5`). Le slug
n'apparaît qu'à la frontière entre l'app et la barre d'adresse.

## Pourquoi cette approche

Alternatives écartées :

- **Param de route `:companySlug`** : oblige à imbriquer toutes les routes sous le
  param et à réécrire chaque `routerLink` (ou passer en navigation relative). Beaucoup
  de points de modification, fragile si on retire le slug plus tard.
- **Helper `link(...segments)` partout** : explicite mais doit être appelé dans chaque
  template.

Le `UrlSerializer` centralise toute la logique en un seul fichier. Pour retirer ou
modifier le comportement, on touche au serializer, pas aux composants.

## Fonctionnement

Angular traduit en permanence entre un `UrlTree` (état de navigation interne) et une
string (URL affichée / historique). Le traducteur est l'`UrlSerializer`. En le
remplaçant, on intercepte ce point de passage unique.

- `parse(url)` (string → `UrlTree`) : retire le slug du chemin et le mémorise, pour que
  le router matche les routes plates.
- `serialize(tree)` (`UrlTree` → string) : réinjecte le slug actif en tête.

Round-trip stable : `serialize(parse("/acme/dashboard")) === "/acme/dashboard"`.

```
Navigateur            UrlSerializer            Router (interne)
/acme/dashboard  ──parse──▶  retire "acme"  ──▶  /dashboard
/acme/dashboard  ◀─serialize──  ajoute "acme"  ◀──  /dashboard
```

Les pages publiques (avant connexion) ne sont jamais préfixées. Elles sont listées
dans `PUBLIC_SEGMENTS`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/app/routing/tenant-url-serializer.ts` | `UrlSerializer` custom + `PUBLIC_SEGMENTS` |
| `src/app/state/tenant/tenant-store.ts` | état du slug (`activeSlug`, `capturedSlug`, `captureSlugFromUrl`) |
| `src/app/app.config.ts` | provider `{ provide: UrlSerializer, useClass: TenantUrlSerializer }` |

## API

### `TenantStore.activeSlug: Signal<string | null>`

Slug à utiliser pour sérialiser les URLs. Ordre de résolution :

1. `activeCompany()?.companySlug` — slug de l'entreprise active une fois les companies
   chargées (source de vérité).
2. `capturedSlug()` — filet de sécurité au premier chargement (deep-link / refresh),
   quand les companies ne sont pas encore chargées. Évite que l'URL perde son slug.

### `TenantStore.captureSlugFromUrl(slug: string): void`

Appelée par `parse`. Mémorise le slug lu dans l'URL (no-op si inchangé).

### `PUBLIC_SEGMENTS: readonly string[]`

Segments racines sans tenant (login, register, verify-email, select-company,
onboarding, maintenance). Dérivés d'`AppRoute` pour rester synchronisés.

## Conséquences

- `app.routes.ts` reste plat : aucune route imbriquée sous un param slug.
- Aucun `routerLink` ne mentionne le slug.
- `routerLinkActive`, les `paramMap` et les guards raisonnent sur les chemins plats.

## Dépendance circulaire (NG0200)

`Router` → `UrlSerializer` → `TenantStore`. Si `TenantStore` injecte `Router`
directement, le cycle se ferme (`TenantStore` → `Router`) et le bootstrap échoue.

`TenantStore` résout donc `Router` paresseusement :

```ts
private readonly injector = inject(Injector);
private get router(): Router {
  return this.injector.get(Router);
}
```

Le `Router` n'est plus requis pour construire le `TenantStore`, seulement au moment de
naviguer (où il existe déjà). Toute dépendance transitive du serializer doit éviter
d'injecter `Router` eagerly pour la même raison.

## Limite connue

Le serializer ne gère que l'URL, pas le token. Le backend scope par le JWT, pas par le
slug. Si l'utilisateur est connecté sur un tenant A et navigue manuellement vers le
slug d'un tenant B, l'URL revient à A (elle reflète le tenant réellement actif) au lieu
de basculer sur B.

Le switch de token sur deep-link relève d'un **guard de réconciliation** : lire le slug
capturé → vérifier l'appartenance de l'utilisateur → appeler `switchTenant` si le slug
diffère du tenant du token. Non implémenté à ce jour.

## Retirer le slug des URLs

1. Supprimer le provider dans `app.config.ts`.
2. Supprimer `src/app/routing/tenant-url-serializer.ts`.

Les champs `activeSlug` / `capturedSlug` du `TenantStore` peuvent rester ou être
nettoyés ; aucun composant n'en dépend.
