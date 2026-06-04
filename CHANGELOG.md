# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
versionnage selon [Semantic Versioning](https://semver.org/lang/fr/).

---

## [2.0.0] — 2026-06-04

### ⚠️ Changements incompatibles (breaking changes)

Avant de mettre à jour depuis la v1.0.0, vérifiez les points suivants dans votre code :

- **`emcflist` → `emcfList`** dans `InfoResponseDto` : tout accès à `info.emcflist` doit être renommé en `info.emcfList`.
- **`finalizeInvoice(uid, 'annuler')`** n'est plus valide : remplacer par `cancelInvoice(uid)` ou `finalizeInvoice(uid, 'cancel')`.
- **Code d'erreur `ITERNAL_SERVER_ERROR` → `INTERNAL_SERVER_ERROR`** : tout `catch` qui compare `error.details.code` à la chaîne `'ITERNAL_SERVER_ERROR'` doit être mis à jour.
- **`getConfig()`** retourne maintenant `EmecefConfig` (`{ baseUrl, token, timeout }`) au lieu de `ApiConfig` (`{ baseUrl, headers }`). Si vous utilisiez `getConfig()` directement, passez à `resolveConfig()`.

### Ajouté

- **`EmecefClient`** — point d'entrée unifié exposant `client.billing` et `client.info` ;
  plus besoin d'instancier `BillingService` et `InfoService` séparément.
- **Config programmatique** — `BillingService`, `InfoService` et `EmecefClient` acceptent un objet
  `EmecefConfig` en constructeur ; les variables d'environnement restent disponibles comme fallback.
- **`timeout`** — option de configuration (défaut : 30 000 ms) appliquée à toutes les requêtes HTTP ;
  une requête ne peut plus bloquer indéfiniment.
- **`confirmInvoice(uid)`** et **`cancelInvoice(uid)`** — méthodes explicites et lisibles.
- **`normalizeInvoice(data)`** — enchaîne `createInvoice` + `confirmInvoice` en une seule étape,
  retourne `NormalizedInvoiceResult` (`{ invoice, security }`).
- **`NormalizedInvoiceResult`** — interface TypeScript pour le retour de `normalizeInvoice`.
- **`InvoiceNatureEnum`** — enum présent dans la spec OpenAPI DGI mais absent de la v1.
- **Exports complets depuis `index.ts`** — tous les enums, interfaces, `EmecfApiError` et `EmecefConfig`
  importables directement depuis `@ikarha/emecef` sans chemin interne.
- **`declaration`, `declarationMap`, `sourceMap`** dans `tsconfig.json` — fichiers `.d.ts` générés
  correctement au build (ils n'existaient pas en v1 malgré `"types": "dist/index.d.ts"` dans `package.json`).
- **Gestion `NETWORK_ERROR`** — les erreurs réseau Axios (pas de réponse serveur) émettent
  le code `NETWORK_ERROR` au lieu de tomber silencieusement dans `UNKNOWN_ERROR`.
- **Retry automatique** — via `axios-retry` : 3 tentatives par défaut avec backoff exponentiel
  sur les erreurs réseau et les réponses 5xx. Configurable via l'option `retries` dans `EmecefConfig`.
- **Validation des entrées côté client** — `createInvoice` et `normalizeInvoice` valident les données
  avant l'appel réseau (IFU requis, articles non vides, prix et quantités positifs, nom opérateur requis)
  et lèvent un `EmecfApiError` immédiatement avec les codes DGI appropriés (ex. code `'8'` pour articles vides).
- **JSDoc sur `InvoiceResponseDataDto`** — tous les champs cryptiques (`ta`, `tb`, `taa`…`taf`,
  `hab`, `had`, `vab`, `vad`, `aib`, `ts`, `total`) sont maintenant documentés.
- `CHANGELOG.md` — ce fichier.

### Corrigé

- **`checkSuccessResponse`** lançait `throw response` (objet Axios brut) au lieu d'une vraie `Error` ;
  `instanceof EmecfApiError` échouait côté consommateur. Lance maintenant `throw new EmecfApiError(...)`.
- **`fromResponse`** contenait un bloc mort `if (error.status === 200)` inaccessible depuis une erreur Axios — supprimé.
- **`finalizeInvoice`** acceptait `'annuler'` alors que l'API expose `/cancel`.
- **Typo `ITERNAL_SERVER_ERROR`** → `INTERNAL_SERVER_ERROR`.
- **`emcflist`** → **`emcfList`** dans `InfoResponseDto` (casing incorrect, champ toujours `undefined` à la réception).
- **`InvoiceDetailsDto`** — ajout du champ `paymentUrl` retourné par l'API.
- **`StatusResponseDto`** — ajout des champs `pendingAibPaymentUid`, `pendingAibPaymentUrl`, `pendingAibPaymentList`.
- **`billing.spec.ts`** — `EMECEF_BASE_URL` incluait `/invoice`, donnant `.../invoice/invoice` comme URL effective.
- **`uid` URL-encodé** via `encodeURIComponent` pour prévenir les injections de chemin (path traversal).
- **Fichier `licence`** renommé en **`license`** pour correspondre à l'entrée `"files"` de `package.json`
  (le fichier de licence n'était pas inclus dans le package npm publié).
- **README** entièrement réécrit : imports corrigés, documentation de la nouvelle API.

### Déprécié

Ces éléments fonctionnent encore, mais seront supprimés en v3 :

- **`finalizeInvoice(uid, action)`** — préférer `confirmInvoice(uid)` ou `cancelInvoice(uid)`.
- **`ApiConfig`** dans `src/types/common.ts` — utiliser `EmecefConfig`.
- **`getConfig()`** dans `src/api/config.ts` — utiliser `resolveConfig()`.

### Packaging

- `dotenv` déplacé de `dependencies` vers `devDependencies`.
- `"private": true` retiré de `package.json`.
- URLs du dépôt corrigées (suffixe `.git` parasite supprimé de `bugs.url` et `homepage`).

---

## [1.0.0] — 29-05-2025

### Ajouté

- **`BillingService`** — service de facturation avec quatre méthodes :
  `getInvoiceStatus()`, `createInvoice(data)`, `finalizeInvoice(uid, action)`, `getInvoiceDetails(uid)`.
- **`InfoService`** — service d'information avec quatre méthodes :
  `getEmeCefInfo()`, `getTaxGroups()`, `getInvoiceTypes()`, `getPaymentTypes()`.
- **Types TypeScript** — interfaces et enums couvrant l'API DGI :
  `InvoiceRequestDataDto`, `InvoiceResponseDataDto`, `InvoiceDetailsDto`, `StatusResponseDto`,
  `SecurityElementsDto`, `ItemDto`, `ClientDto`, `OperatorDto`, `PaymentDto`,
  `InvoiceTypeEnum`, `AibGroupTypeEnum`, `TaxGroupTypeEnum`, `PaymentTypeEnum`.
- **`EmecfApiError`** — classe d'erreur personnalisée avec un code et une description en français,
  et une map de tous les codes d'erreur applicatifs de l'API DGI (codes `1` à `99`).
- **Configuration via variables d'environnement** — `EMECEF_BASE_URL` et `EMECEF_TOKEN`.
- **Suite de tests Jest** — couverture des cas nominaux et des cas d'erreur pour les deux services.

---

## [À venir]

- Module NestJS optionnel (`EmecefModule.forRoot({ baseUrl, token })`).
