import axios, {AxiosInstance} from 'axios';
import {getConfig} from './config';
import {EmecfApiError} from '../errors/api-error';
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
            const response = await this.axiosInstance.get<InfoResponseDto>('/status')
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async getTaxGroups(): Promise<TaxGroupsDto> {
        try {
            const response = await this.axiosInstance.get<TaxGroupsDto>('/taxGroups');
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async getInvoiceTypes(): Promise<InvoiceTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<InvoiceTypeDto[]>('/invoiceTypes');
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }

    public async getPaymentTypes(): Promise<PaymentTypeDto[]> {
        try {
            const response = await this.axiosInstance.get<PaymentTypeDto[]>('/paymentTypes');
            return EmecfApiError.checkSuccessResponse(response)
        } catch (error) {
            throw EmecfApiError.fromResponse(error);
        }
    }
}