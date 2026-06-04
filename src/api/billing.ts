import {AxiosInstance} from 'axios';
import {EmecefConfig, resolveConfig} from './config';
import {createHttpClient} from './http';
import {EmecfApiError} from '../errors/api-error';
import {
    InvoiceDetailsDto,
    InvoiceRequestDataDto,
    InvoiceResponseDataDto,
    SecurityElementsDto,
    StatusResponseDto
} from '../types/billing';
import {validateInvoiceRequest} from '../validators/invoice';

export interface NormalizedInvoiceResult {
    invoice: InvoiceResponseDataDto;
    security: SecurityElementsDto;
}

/** Retourne l'erreur telle quelle si c'est déjà un EmecfApiError, sinon la convertit. */
function toEmecfError(error: unknown): EmecfApiError {
    if (error instanceof EmecfApiError) return error;
    return EmecfApiError.fromResponse(error);
}

export class BillingService {
    private readonly axiosInstance: AxiosInstance;

    /**
     * @param config Configuration explicite (baseUrl, token, timeout).
     *               Si omis, utilise EMECEF_BASE_URL et EMECEF_TOKEN depuis l'environnement.
     */
    constructor(config?: Partial<EmecefConfig>) {
        const resolved = resolveConfig(config);
        this.axiosInstance = createHttpClient(resolved, '/invoice');
    }

    /** Récupère le statut de l'API et les factures en attente. */
    public async getInvoiceStatus(): Promise<StatusResponseDto> {
        try {
            const response = await this.axiosInstance.get<StatusResponseDto>('/');
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    /** Soumet une nouvelle facture et retourne les totaux calculés. */
    public async createInvoice(data: InvoiceRequestDataDto): Promise<InvoiceResponseDataDto> {
        validateInvoiceRequest(data);
        try {
            const response = await this.axiosInstance.post<InvoiceResponseDataDto>('/', data);
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    /** Confirme une facture en attente et retourne les éléments de sécurité (QR code, codeMECeF…). */
    public async confirmInvoice(uid: string): Promise<SecurityElementsDto> {
        return this.finalizeInvoice(uid, 'confirm');
    }

    /** Annule une facture en attente et retourne les éléments de sécurité. */
    public async cancelInvoice(uid: string): Promise<SecurityElementsDto> {
        return this.finalizeInvoice(uid, 'cancel');
    }

    /**
     * Crée et confirme une facture en une seule étape.
     * Méthode de commodité couvrant le cas d'usage à 99% : soumettre → confirmer → récupérer QR code.
     *
     * @example
     * const { invoice, security } = await billing.normalizeInvoice(data);
     * console.log(security.qrCode, security.codeMECeFDGI);
     */
    public async normalizeInvoice(data: InvoiceRequestDataDto): Promise<NormalizedInvoiceResult> {
        const invoice = await this.createInvoice(data);
        const security = await this.confirmInvoice(invoice.uid);
        return {invoice, security};
    }

    /** Récupère les détails d'une facture en attente. */
    public async getInvoiceDetails(uid: string): Promise<InvoiceDetailsDto> {
        try {
            const response = await this.axiosInstance.get<InvoiceDetailsDto>(`/${encodeURIComponent(uid)}`);
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    /**
     * Confirme ou annule une facture en attente.
     * @deprecated Préférez {@link confirmInvoice} ou {@link cancelInvoice} pour plus de clarté.
     */
    public async finalizeInvoice(uid: string, action: 'confirm' | 'cancel'): Promise<SecurityElementsDto> {
        try {
            const response = await this.axiosInstance.put<SecurityElementsDto>(`/${encodeURIComponent(uid)}/${action}`);
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }
}
