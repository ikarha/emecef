// Services
export {BillingService} from './api/billing';
export type {NormalizedInvoiceResult} from './api/billing';
export {InfoService} from './api/info';

// Client unifié
export {EmecefClient} from './client';

// Config
export type {EmecefConfig} from './api/config';

// Types billing
export {
    InvoiceTypeEnum,
    AibGroupTypeEnum,
    TaxGroupTypeEnum,
    PaymentTypeEnum,
    InvoiceNatureEnum,
} from './types/billing';

export type {
    ClientDto,
    OperatorDto,
    PaymentDto,
    ItemDto,
    InvoiceRequestDataDto,
    InvoiceResponseDataDto,
    PendingRequestDto,
    StatusResponseDto,
    SecurityElementsDto,
    InvoiceDetailsDto,
} from './types/billing';

// Types info
export type {
    EmcfInfoDto,
    InfoResponseDto,
    TaxGroupsDto,
    InvoiceTypeDto,
    PaymentTypeDto,
} from './types/info';

// Erreurs
export {EmecfApiError, getErrorMessage} from './errors/api-error';
export type {EmecfErrorDetails} from './errors/api-error';
