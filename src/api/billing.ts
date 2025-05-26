import axios, {AxiosInstance} from 'axios';
import {getConfig} from './config';
import {ApiError} from '../errors/api-error';
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

    public async getStatus(): Promise<StatusResponseDto> {
        try {
            const response = await this.axiosInstance.get<StatusResponseDto>('/');
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async createInvoice(data: InvoiceRequestDataDto): Promise<InvoiceResponseDataDto> {
        try {
            const response = await this.axiosInstance.post<InvoiceResponseDataDto>('/', data);
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async finalizeInvoice(uid: string, action: 'confirm' | 'annuler'): Promise<SecurityElementsDto> {
        try {
            const response = await this.axiosInstance.put<SecurityElementsDto>(`/${uid}/${action}`);
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async getInvoiceDetails(uid: string): Promise<InvoiceDetailsDto> {
        try {
            const response = await this.axiosInstance.get<InvoiceDetailsDto>(`/${uid}`);
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }
}