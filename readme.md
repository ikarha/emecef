## eMCF API Client
A TypeScript client library for interacting with the e-MCF (MACHINES ELECTRONIQUES CERTIFIEES DE FACTURATION) API for normalized invoicing.
This library provides a simple and typed interface to manage invoices and retrieve information from the e-MCF API.

### Features

- Billing API: 
  - Create, 
  - finalize, 
  - and retrieve invoice details.
- Info API: 
  - Fetch e-MCF status, 
  - tax groups, 
  - invoice types, 
  - and payment types.
- TypeScript Support: Fully typed with TypeScript interfaces for robust development.
      Environment Configuration: Configurable via environment variables for security and flexibility.
      Error Handling: Comprehensive error handling with meaningful messages.

### Installation
Install the package using npm:

```bash
 npm install emecef
```


### Prerequisites

- Node.js (>= 14.x)
- A valid JWT token provided by the DGI for e-MCF API access
- An active internet connection :)

### Configuration
The library uses environment variables for configuration. Create a .env file in your project root based on the provided .env.example:

```bash

# .example.env file

EMCF_BASE_URL=https://developer.impots.bj/sygmef-emcf/api
EMCF_TOKEN=your-jwt-token
```

Ensure you have dotenv installed and load it at the start of your application:

```bash
npm install dotenv
````

Then, load the environment variables in your application:

```typescript

import * as dotenv from 'dotenv';
dotenv.config();

```

### Usage
Initialize the Services

```typescript
import { BillingService, InfoService } from 'emecef';

// Initialize services (environment variables must be set)
const billingService = new BillingService();
const infoService = new InfoService();
```

#### Example: Create and Finalize an Invoice

```typescript
import { BillingService } from 'emcf-api-client';
import { InvoiceRequestDataDto, InvoiceTypeEnum, PaymentTypeEnum, TaxGroupTypeEnum } from 'emcf-api-client/dist/types/billing';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
const billingService = new BillingService();

try {
// Check API status
const status = await billingService.getStatus();
console.log('API Status:', status);

    // Create an invoice
    const invoiceData: InvoiceRequestDataDto = {
      ifu: '9999900000001',
      type: InvoiceTypeEnum.FV,
      items: [
        {
          name: 'Jus d\'orange',
          price: 1800,
          quantity: 2,
          taxGroup: TaxGroupTypeEnum.B
        },
        {
          name: 'Lait 1/1 EX',
          price: 450,
          quantity: 3,
          taxGroup: TaxGroupTypeEnum.A
        }
      ],
      client: {
        contact: '45661122',
        ifu: '9999900000002',
        name: 'Nom du client',
        address: 'Rue d\'ananas 23'
      },
      operator: {
        id: '',
        name: 'Jacques'
      },
      payment: [
        {
          name: PaymentTypeEnum.ESPECES,
          amount: 4950
        }
      ]
    };
    const invoiceResponse = await billingService.createInvoice(invoiceData);
    console.log('Invoice Response:', invoiceResponse);

    // Finalize the invoice
    const finalizeResponse = await billingService.finalizeInvoice(invoiceResponse.uid, 'confirm');
    console.log('Finalization:', finalizeResponse);
} catch (error) {
console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
}
}

main().catch(console.error);
```


#### Available Methods
- BillingService
  - getStatus(): Retrieves the API status and pending invoice requests.
  - createInvoice(data: InvoiceRequestDataDto): Submits a new invoice and retrieves calculated totals.
  - finalizeInvoice(uid: string, action: 'confirm' | 'annuler'): Confirms or cancels an invoice.
  - getInvoiceDetails(uid: string): Retrieves details of a pending invoice.

- InfoService 
  - getEmcfInfo(): Retrieves information about e-MCF instances.
  - getTaxGroups(): Retrieves available tax groups and their rates.
  - getInvoiceTypes(): Retrieves available invoice types.
  - getPaymentTypes(): Retrieves available payment types.

### Environment Variables

| Variable      | Description                          | Required | Example                                     |
|---------------|--------------------------------------|----------|---------------------------------------------|
| EMCF_BASE_URL | Base URL of the e-MCF API            | Yes      | https://developer.impots.bj/sygmef-emcf/api |
| EMCF_TOKEN    | JWT token for API authentication     | Yes      | your-jwt-token                              |


### Error Handling
The library throws ApiError instances with meaningful error messages based on the API's error codes (e.g., maximum pending invoices exceeded, invalid invoice type). Check the error documentation in the e-MCF API specification for details.


### Development
#### Build the Project

```bash
 npm run build
```

#### Run Tests

Tests are implemented with Jest. Run them with:
```bash
npm test
```

#### Project Structure

- ```src/api/```: Contains service classes for billing and info APIs.
- ```src/types/```: TypeScript interfaces for API data transfer objects (DTOs).
- ```src/errors/```: Custom error handling logic.
- ```dist/```: Compiled JavaScript and TypeScript declaration files.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository.

### License
This project is licensed under the MIT License. See the LICENSE file for details.


