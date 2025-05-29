import {BillingService, InfoService} from '../index';
import {InvoiceRequestDataDto, InvoiceTypeEnum, PaymentTypeEnum, TaxGroupTypeEnum} from '../types/billing';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    // Les variables d'environnement EMECEF_BASE_URL et EMECEF_TOKEN doivent être définies
    const billingService = new BillingService();
    const infoService = new InfoService();

    try {


        // Récupérer les informations sur les e-MCF
        const emcfInfo = await infoService.getEmeCefInfo();
        console.log('Info e-MCF:', emcfInfo);

        // Récupérer les groupes de taxation
        const taxGroups = await infoService.getTaxGroups();
        console.log('Groupes de taxation:', taxGroups);

        // Récupérer les types de factures
        const invoiceTypes = await infoService.getInvoiceTypes();
        console.log('Types de factures:', invoiceTypes);

        // Récupérer les types de paiement
        const paymentTypes = await infoService.getPaymentTypes();
        console.log('Types de paiement:', paymentTypes);


        // Vérifier le statut de l'API
        const status = await billingService.getInvoiceStatus()
        console.log('Statut de l\'API:', status);

        // Créer une facture
        const invoiceData: InvoiceRequestDataDto = {
            ifu: '3200700067314', // Numéro d'identification fiscale de l'entreprise
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
                contact: '0145661122',
                ifu: '9999900000002', // Numéro d'identification fiscale du client
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
        console.log('Réponse facture:', invoiceResponse);

        // Finaliser la facture
        const finalizeResponse = await billingService.finalizeInvoice(invoiceResponse.uid, 'confirm');
        console.log('Finalisation:', finalizeResponse);

        // Récupérer les détails de la facture
        const details = await billingService.getInvoiceDetails(invoiceResponse.uid);
        console.log('Détails facture:', details);
    } catch (error) {
        console.error('Erreur: ', error instanceof Error ? error.message : 'Erreur inconnue');
    }
}

main().catch(console.error);