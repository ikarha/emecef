## @ikarha/emecef

Client TypeScript pour l'API e-MCF (Machines Électroniques Certifiées de Facturation) de la DGI Bénin.

### Installation

```bash
npm install @ikarha/emecef
```

### Prérequis

- Node.js >= 14.x
- Un token JWT valide fourni par la DGI pour l'accès à l'API e-MCF

### Configuration

Deux modes sont disponibles — les paramètres explicites ont priorité sur les variables d'environnement.

**Via paramètres (recommandé)** — idéal avec NestJS, Express ou tout framework qui injecte la config :

```typescript
import { EmecefClient } from '@ikarha/emecef';

const client = new EmecefClient({
  baseUrl: 'https://developper.impots.bj/sygmef-emcf/api',
  token: 'votre-token-jwt',
  timeout: 30000, // optionnel, défaut : 30 000 ms
});
```

**Via variables d'environnement** :

```bash
# .env
EMECEF_BASE_URL=https://developper.impots.bj/sygmef-emcf/api
EMECEF_TOKEN=votre-token-jwt
```

```typescript
import { EmecefClient } from '@ikarha/emecef';

const client = new EmecefClient(); // lit EMECEF_BASE_URL et EMECEF_TOKEN
```

### Utilisation

#### Cas d'usage principal : créer et confirmer une facture en une étape

```typescript
import {
  EmecefClient,
  InvoiceRequestDataDto,
  InvoiceTypeEnum,
  PaymentTypeEnum,
  TaxGroupTypeEnum,
  NormalizedInvoiceResult,
} from '@ikarha/emecef';

const client = new EmecefClient({ baseUrl: '...', token: '...' });

const data: InvoiceRequestDataDto = {
  ifu: '9999900000001',
  type: InvoiceTypeEnum.FV,
  items: [
    { name: 'Jus d\'orange', price: 1800, quantity: 2, taxGroup: TaxGroupTypeEnum.B },
  ],
  operator: { name: 'Jacques' },
  payment: [{ name: PaymentTypeEnum.ESPECES, amount: 1800 }],
};

const result: NormalizedInvoiceResult = await client.billing.normalizeInvoice(data);
console.log('UID :', result.invoice.uid);
console.log('Total :', result.invoice.total);
console.log('QR Code :', result.security.qrCode);
console.log('Code MECeF :', result.security.codeMECeFDGI);
```

#### Étapes séparées (create / confirm / cancel)

```typescript
// Créer
const invoice = await client.billing.createInvoice(data);

// Confirmer
const confirmed = await client.billing.confirmInvoice(invoice.uid);

// Ou annuler
const cancelled = await client.billing.cancelInvoice(invoice.uid);

// Détails d'une facture en attente
const details = await client.billing.getInvoiceDetails(invoice.uid);
```

#### Informations e-MCF

```typescript
const info         = await client.info.getEmeCefInfo();
const taxGroups    = await client.info.getTaxGroups();
const invoiceTypes = await client.info.getInvoiceTypes();
const paymentTypes = await client.info.getPaymentTypes();
const status       = await client.billing.getInvoiceStatus();
```

### Gestion des erreurs

La librairie lève uniquement des instances de `EmecfApiError`, utilisables avec `instanceof` :

```typescript
import { EmecfApiError } from '@ikarha/emecef';

try {
  await client.billing.normalizeInvoice(data);
} catch (error) {
  if (error instanceof EmecfApiError) {
    console.error(error.details.code);        // ex. '8', 'NETWORK_ERROR'
    console.error(error.details.description); // ex. 'La facture doit contenir des articles'
  }
}
```

Codes d'erreur notables :

| Code | Description |
|---|---|
| `NETWORK_ERROR` | Pas de réponse du serveur (connexion, timeout) |
| `BAD_REQUEST` | Requête invalide (400 sans code applicatif) |
| `INTERNAL_SERVER_ERROR` | Erreur serveur e-MCF (500) |
| `1` | Nombre maximum de factures en attente dépassé |
| `3` | Type de facture invalide |
| `8` | La facture doit contenir des articles |
| `20` | Facture inexistante ou déjà finalisée/annulée |
| `99` | Erreur de traitement générique |

### Méthodes disponibles

**`client.billing`** (`BillingService`)

| Méthode | Description |
|---|---|
| `normalizeInvoice(data)` | Crée et confirme une facture en une étape *(recommandé)* |
| `createInvoice(data)` | Soumet une facture, retourne les totaux calculés |
| `confirmInvoice(uid)` | Confirme une facture en attente, retourne QR code et codeMECeF |
| `cancelInvoice(uid)` | Annule une facture en attente |
| `getInvoiceDetails(uid)` | Récupère les détails d'une facture en attente |
| `getInvoiceStatus()` | Retourne le statut de l'API et les requêtes en attente |

**`client.info`** (`InfoService`)

| Méthode | Description |
|---|---|
| `getEmeCefInfo()` | Informations sur les instances e-MCF actives |
| `getTaxGroups()` | Groupes de taxation et leurs taux |
| `getInvoiceTypes()` | Types de factures disponibles |
| `getPaymentTypes()` | Types de paiement disponibles |

### Types exportés

Tous les types sont importables directement depuis `@ikarha/emecef` :

```typescript
import {
  // Enums
  InvoiceTypeEnum, AibGroupTypeEnum, TaxGroupTypeEnum,
  PaymentTypeEnum, InvoiceNatureEnum,
  // Interfaces request/response
  InvoiceRequestDataDto, InvoiceResponseDataDto,
  InvoiceDetailsDto, NormalizedInvoiceResult,
  ItemDto, ClientDto, OperatorDto, PaymentDto,
  StatusResponseDto, SecurityElementsDto, PendingRequestDto,
  // Info
  InfoResponseDto, EmcfInfoDto, TaxGroupsDto,
  InvoiceTypeDto, PaymentTypeDto,
  // Config
  EmecefConfig,
  // Erreurs
  EmecfApiError, EmecfErrorDetails,
} from '@ikarha/emecef';
```

### Variables d'environnement

| Variable | Description | Requis |
|---|---|---|
| `EMECEF_BASE_URL` | URL de base de l'API e-MCF | Oui (si pas de config explicite) |
| `EMECEF_TOKEN` | Token JWT d'authentification | Oui (si pas de config explicite) |

### Développement

```bash
npm run build        # compile TypeScript → dist/
npm test             # lance Jest
npm run test-coverage
npm run run-example  # exécute src/examples/example.ts
```

### Structure du projet

```
src/
  api/        BillingService, InfoService, config
  client.ts   EmecefClient (point d'entrée unifié)
  types/      Interfaces et enums TypeScript
  errors/     EmecfApiError et codes d'erreur
  examples/   Exemple d'utilisation complet
dist/         Fichiers compilés (.js + .d.ts)
```

### Ressources

- [CHANGELOG](./CHANGELOG.md) — historique des versions et guide de migration
- [API e-MCF — Documentation Swagger](https://developper.impots.bj/sygmef-emcf/swagger/index.html)
- [DGI Bénin](https://e-mecef.impots.bj/)

### Licence

MIT — voir le fichier [license](./license).
