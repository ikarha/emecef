import {BillingService} from './billing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    InvoiceDetailsDto,
    InvoiceRequestDataDto,
    InvoiceResponseDataDto,
    InvoiceTypeEnum,
    PaymentTypeEnum,
    SecurityElementsDto,
    TaxGroupTypeEnum
} from "../types/billing";
import {getErrorMessage} from "../errors/api-error";

describe('BillingService', () => {

    let mock: MockAdapter;
    let billingService: BillingService;

    beforeAll(() => {
        mock = new MockAdapter(axios);
        process.env.EMECEF_BASE_URL = 'https://test-emecef-api.com/emcf/api/invoice';
        process.env.EMECEF_TOKEN = 'test-token';
        billingService = new BillingService();
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    describe('getInvoiceStatus', () => {
        it('should return the status of the invoice API', async () => {
            const mockResponse = {
                status: true,
                version: '1.0',
                ifu: '0308409984',
                nim: 'TS009323411',
                tokenValid: '2025-12-31T00:00:00+01:00',
                serverDateTime: '2025-05-29T16:42:35.304904+01:00',
                pendingRequestsCount: 0,
                pendingRequestsList: []

            };
            mock.onGet('/').reply(200, mockResponse);
            const response = await billingService.getInvoiceStatus();
            expect(response).toEqual(mockResponse);
        });

        it('should throw an error if the API returns an error', async () => {
            mock.onGet('/').reply(500, {errorCode: '', errorDesc: 'Internal Server Error'});
            await expect(billingService.getInvoiceStatus()).rejects.toThrow('ITERNAL_SERVER_ERROR : Erreur interne du serveur emecef, veuillez réessayer ultérieurement.');
        });
    })

    describe('createInvoice', () => {
        const invoiceData: InvoiceRequestDataDto = {
            ifu: '9999900000001',
            type: InvoiceTypeEnum.FV,
            items: [
                {
                    name: 'Jus d\'orange',
                    price: 1800,
                    quantity: 2,
                    taxGroup: TaxGroupTypeEnum.B
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
                    amount: 3600
                }
            ]
        };

        it('should create an invoice successfully', async () => {
            const mockResponse: InvoiceResponseDataDto = {
                uid: '123456789',
                ta: 0,
                tb: 3600,
                tc: 0,
                td: 0,
                taa: 0,
                tab: 648,
                tac: 0,
                tad: 0,
                tae: 0,
                taf: 0,
                hab: 0,
                had: 0,
                vab: 0,
                vad: 0,
                aib: 0,
                ts: 3600,
                total: 4248
            };
            mock.onPost('/').reply(200, mockResponse);
            const response = await billingService.createInvoice(invoiceData);
            expect(response).toEqual(mockResponse);
            expect(mock.history.post[0].data).toEqual(JSON.stringify(invoiceData));
        });

        it('should throw ApiError on invalid invoice data', async () => {
            const invalidInvoiceData: InvoiceRequestDataDto = {
                ifu: 'invalid-ifu',
                type: InvoiceTypeEnum.FV,
                items: [],
                operator: {id: '', name: 'Jacques'}
            };
            mock.onPost('/').reply(400, invalidInvoiceData);
            await expect(billingService.createInvoice(invoiceData)).rejects.toThrow('BAD_REQUEST : Requête invalide, veuillez vérifier les données envoyées.');
        });
    });

    describe('finalizeInvoice', () => {
        it('should finalize an invoice successfully', async () => {
            const uid = '123456789';
            const action = 'confirm';
            const mockResponse: SecurityElementsDto = {
                dateTime: '2025-05-27T12:20:00+01:00',
                qrCode: 'QR_CODE_STRING',
                codeMECeFDGI: 'MECeFDGI_123',
                counters: '1',
                nim: 'XX01000001'
            };
            mock.onPut(`/${uid}/${action}`).reply(200, mockResponse);
            const response = await billingService.finalizeInvoice(uid, action);
            expect(response).toEqual(mockResponse);
        });

        it('should throw ApiError on invalid action', async () => {
            const uid = '123456789';
            const action = 'confirm';
            mock.onPut(`/${uid}/${action}`).reply(200, {errorCode: '20', errorDesc: getErrorMessage('20')});
            await expect(billingService.finalizeInvoice(uid, action)).rejects.toThrow('20 : La facture n\'existe pas ou elle est déjà finalisée / annulée');
        });
    });

    describe('getInvoiceDetails', () => {
        it('should fetch invoice details successfully', async () => {
            const uid = '123456789';
            const mockResponse: InvoiceDetailsDto = {
                ifu: '9999900000001',
                type: InvoiceTypeEnum.FV,
                items: [
                    {
                        name: 'Jus d\'orange',
                        price: 1800,
                        quantity: 2,
                        taxGroup: TaxGroupTypeEnum.B
                    }
                ],
                operator: {id: '', name: 'Jacques'}
            };

            mock.onGet(`/${uid}`).reply(200, mockResponse);
            const response = await billingService.getInvoiceDetails(uid);
            expect(response).toEqual(mockResponse);
        });

        it('should throw ApiError on invalid UID', async () => {
            const uid = 'invalid-uid';
            mock.onGet(`/${uid}`).reply(200, {errorCode: '99', errorDesc: getErrorMessage('99')});
            await expect(billingService.getInvoiceDetails(uid)).rejects.toThrow('99 : Erreur lors du traitement de la demande');
        });

        it('should throw ApiError on uid not at pending step anymore', async () => {
            const uid = 'not-pending-uid';
            mock.onGet(`/${uid}`).reply(200, {errorCode: '20', errorDesc: getErrorMessage('20')});
            await expect(billingService.getInvoiceDetails(uid)).rejects.toThrow('20 : La facture n\'existe pas ou elle est déjà finalisée / annulée');
        });
    });
});
