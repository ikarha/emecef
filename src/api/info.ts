import {AxiosInstance} from 'axios';
import {EmecefConfig, resolveConfig} from './config';
import {createHttpClient} from './http';
import {EmecfApiError} from '../errors/api-error';
import {InfoResponseDto, InvoiceTypeDto, PaymentTypeDto, TaxGroupsDto} from '../types/info';

/** Retourne l'erreur telle quelle si c'est déjà un EmecfApiError, sinon la convertit. */
function toEmecfError(error: unknown): EmecfApiError {
    if (error instanceof EmecfApiError) return error;
    return EmecfApiError.fromResponse(error);
}

export class InfoService {
    private readonly axiosInstance: AxiosInstance;

    /**
     * @param config Configuration explicite (baseUrl, token, timeout).
     *               Si omis, utilise EMECEF_BASE_URL et EMECEF_TOKEN depuis l'environnement.
     */
    constructor(config?: Partial<EmecefConfig>) {
        const resolved = resolveConfig(config);
        this.axiosInstance = createHttpClient(resolved, '/info');
    }

    public async getEmeCefInfo(): Promise<InfoResponseDto> {
        try {
            const response = await this.axiosInstance.get<InfoResponseDto>('/status');
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    public async getTaxGroups(): Promise<TaxGroupsDto> {
        try {
            const response = await this.axiosInstance.get<TaxGroupsDto>('/taxGroups');
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    public async getInvoiceTypes(): Promise<InvoiceTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<InvoiceTypeDto[]>('/invoiceTypes');
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }

    public async getPaymentTypes(): Promise<PaymentTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<PaymentTypeDto[]>('/paymentTypes');
            return EmecfApiError.checkSuccessResponse(response);
        } catch (error) {
            throw toEmecfError(error);
        }
    }
}
