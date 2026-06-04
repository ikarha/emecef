import {EmecefClient, InvoiceRequestDataDto, InvoiceTypeEnum, PaymentTypeEnum, TaxGroupTypeEnum} from '../index';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    // Initialisation via variables d'environnement (EMECEF_BASE_URL, EMECEF_TOKEN)
    // ou explicitement : new EmecefClient({ baseUrl: '...', token: '...' })
    const client = new EmecefClient();

    try {
        // Récupérer les informations sur les e-MCF
        const emcfInfo = await client.info.getEmeCefInfo();
        console.log('Info e-MCF:', emcfInfo);

        // Récupérer les groupes de taxation
        const taxGroups = await client.info.getTaxGroups();
        console.log('Groupes de taxation:', taxGroups);

        // Récupérer les types de factures
        const invoiceTypes = await client.info.getInvoiceTypes();
        console.log('Types de factures:', invoiceTypes);

        // Récupérer les types de paiement
        const paymentTypes = await client.info.getPaymentTypes();
        console.log('Types de paiement:', paymentTypes);

        // Vérifier le statut de l'API
        const status = await client.billing.getInvoiceStatus();
        console.log('Statut de l\'API:', status);

        // Créer une facture
        const invoiceData: InvoiceRequestDataDto = {
            ifu: '3200700067314',
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
                    amount: 4950
                }
            ]
        };

        const invoiceResponse = await client.billing.createInvoice(invoiceData);
        console.log('Réponse facture:', invoiceResponse);

        // Finaliser la facture
        const finalizeResponse = await client.billing.finalizeInvoice(invoiceResponse.uid, 'confirm');
        console.log('Finalisation:', finalizeResponse);

        // Récupérer les détails de la facture
        const details = await client.billing.getInvoiceDetails(invoiceResponse.uid);
        console.log('Détails facture:', details);

    } catch (error) {
        console.error('Erreur: ', error instanceof Error ? error.message : 'Erreur inconnue');
    }
}

main().catch(console.error);
