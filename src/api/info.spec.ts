import {InfoService} from './info';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {InfoResponseDto, InvoiceTypeDto, PaymentTypeDto, TaxGroupsDto} from '../types/info';
import {errors} from "../errors/api-error";

describe('InfoService', () => {
    let mock: MockAdapter;
    let infoService: InfoService;

    beforeAll(() => {
        mock = new MockAdapter(axios);
        process.env.EMECEF_BASE_URL = 'https://test-emecef-api.com/emcf/api';
        process.env.EMECEF_TOKEN = 'test-token';
        infoService = new InfoService();
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    describe('getEmeCefInfo', () => {
        it('should fetch e-MCF info successfully', async () => {
            const mockInfo: InfoResponseDto = {
                status: true,
                version: '1.0',
                ifu: '9999900000001',
                nim: 'XX01000070',
                tokenValid: '2025-12-31T00:00:00+01:00',
                serverDateTime: '2025-05-27T12:20:00+01:00',
                emcflist: [
                    {
                        nim: 'XX01000070',
                        status: 'Actif',
                        shopName: 'TEST #70',
                        address1: 'Boulevard 23',
                        address2: '',
                        address3: 'Cotonou',
                        contact1: '12345678',
                        contact2: '',
                        contact3: ''
                    }
                ]
            };
            mock.onGet('/status').reply(200, mockInfo);
            const info = await infoService.getEmeCefInfo();
            expect(info).toEqual(mockInfo);
        });

        it('should throw ApiError on failed request', async () => {
            mock.onGet('/status').reply(400, {errorCode: '99', errorDesc: errors['99']});
            await expect(infoService.getEmeCefInfo()).rejects.toThrow('99 : Erreur lors du traitement de la demande');
        });
    });

    describe('getTaxGroups', () => {
        it('should fetch tax groups successfully', async () => {
            const mockTaxGroups: TaxGroupsDto = {a: 0, b: 18, c: 0, d: 0, e: 0, f: 0, aibA: 1, aibB: 5};
            mock.onGet('/taxGroups').reply(200, mockTaxGroups);
            const taxGroups = await infoService.getTaxGroups();
            expect(taxGroups).toEqual(mockTaxGroups);
        });

        it('should throw ApiError on failed request', async () => {
            mock.onGet('/taxGroups').reply(400, {errorCode: '99', errorDesc: errors['99']});
            await expect(infoService.getTaxGroups()).rejects.toThrow('99 : Erreur lors du traitement de la demande');
        });
    });

    describe('getInvoiceTypes', () => {
        it('should fetch invoice types successfully', async () => {
            const mockInvoiceTypes: InvoiceTypeDto[] = [
                {type: 'FV', description: 'Facture de Vente'},
                {type: 'EV', description: 'Facture d\'Entraînement de Vente'}
            ];
            mock.onGet('/invoiceTypes').reply(200, mockInvoiceTypes);
            const invoiceTypes = await infoService.getInvoiceTypes();
            expect(invoiceTypes).toEqual(mockInvoiceTypes);
        });

        it('should throw ApiError on failed request', async () => {
            mock.onGet('/invoiceTypes').reply(400, {errorCode: '99', errorDesc: errors['99']});
            await expect(infoService.getInvoiceTypes()).rejects.toThrow('99 : Erreur lors du traitement de la demande');
        });
    });

    describe('getPaymentTypes', () => {
        it('should fetch payment types successfully', async () => {
            const mockPaymentTypes: PaymentTypeDto[] = [
                {type: 'ESPECES', description: 'Espèces'},
                {type: 'VIREMENT', description: 'Virement bancaire'}
            ];
            mock.onGet('/paymentTypes').reply(200, mockPaymentTypes);
            const paymentTypes = await infoService.getPaymentTypes();
            expect(paymentTypes).toEqual(mockPaymentTypes);
        });

        it('should throw ApiError on failed request', async () => {
            mock.onGet('/paymentTypes').reply(400, {errorCode: '99', errorDesc: errors['99']});
            await expect(infoService.getPaymentTypes()).rejects.toThrow('99 : Erreur lors du traitement de la demande');
        });
    });
});
