import axios, {AxiosInstance} from 'axios';
import {getConfig} from './config';
import {EmecfApiError} from '../errors/api-error';
import {
    InvoiceDetailsDto,
    InvoiceRequestDataDto,
    InvoiceResponseDataDto,
    SecurityElementsDto,
    StatusResponseDto
} from '../types/billing';

export class BillingService {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        const apiConfig = getConfig();
        this.axiosInstance = axios.create({
            baseURL: `${apiConfig.baseUrl}/invoice`,
            headers: apiConfig.headers
        });
    }

    public async getInvoiceStatus(): Promise<StatusResponseDto> {
        try {
            const response = await this.axiosInstance.get<StatusResponseDto>('/');
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async createInvoice(data: InvoiceRequestDataDto): Promise<InvoiceResponseDataDto> {
        try {
            const response = await this.axiosInstance.post<InvoiceResponseDataDto>('/', data);
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async finalizeInvoice(uid: string, action: 'confirm' | 'annuler'): Promise<SecurityElementsDto> {
        try {
            const response = await this.axiosInstance.put<SecurityElementsDto>(`/${uid}/${action}`);
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async getInvoiceDetails(uid: string): Promise<InvoiceDetailsDto> {
        try {
            const response = await this.axiosInstance.get<InvoiceDetailsDto>(`/${uid}`);
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }
}