import axios, {AxiosInstance} from 'axios';
import {getConfig} from './config';
import {ApiError} from '../errors/api-error';
import {InfoResponseDto, InvoiceTypeDto, PaymentTypeDto, TaxGroupsDto} from '../types/info';

export class InfoService {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        const apiConfig = getConfig();
        this.axiosInstance = axios.create({
            baseURL: `${apiConfig.baseUrl}/info`,
            headers: apiConfig.headers
        });
    }

    public async getEmeCefInfo(): Promise<InfoResponseDto> {
        try {
            const response = await this.axiosInstance.get<InfoResponseDto>('/status');
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async getTaxGroups(): Promise<TaxGroupsDto> {
        try {
            const response = await this.axiosInstance.get<TaxGroupsDto>('/taxGroups');
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async getInvoiceTypes(): Promise<InvoiceTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<InvoiceTypeDto[]>('/invoiceTypes');
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    public async getPaymentTypes(): Promise<PaymentTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<PaymentTypeDto[]>('/paymentTypes');
            return response.data;
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }
}