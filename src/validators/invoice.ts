import {EmecfApiError, getErrorMessage} from '../errors/api-error';
import {InvoiceRequestDataDto} from '../types/billing';

/**
 * Valide les données d'une facture avant l'envoi à l'API.
 * Lève un EmecfApiError avec les mêmes codes que l'API DGI lorsque c'est possible,
 * afin d'éviter un aller-retour réseau inutile.
 */
export function validateInvoiceRequest(data: InvoiceRequestDataDto): void {
    if (!data.ifu?.trim()) {
        throw new EmecfApiError({
            code: 'VALIDATION_ERROR',
            description: 'Le numéro IFU de l\'entreprise est requis.',
        });
    }

    if (!data.operator?.name?.trim()) {
        throw new EmecfApiError({
            code: 'VALIDATION_ERROR',
            description: 'Le nom de l\'opérateur est requis.',
        });
    }

    // Code DGI 8 : la facture doit contenir des articles
    if (!data.items || data.items.length === 0) {
        throw new EmecfApiError({
            code: '8',
            description: getErrorMessage('8'),
        });
    }

    for (const item of data.items) {
        if (!item.name?.trim()) {
            throw new EmecfApiError({
                code: 'VALIDATION_ERROR',
                description: 'Chaque article doit avoir un nom.',
            });
        }
        if (item.price < 0) {
            throw new EmecfApiError({
                code: 'VALIDATION_ERROR',
                description: `Le prix de l'article "${item.name}" ne peut pas être négatif.`,
            });
        }
        if (item.quantity <= 0) {
            throw new EmecfApiError({
                code: 'VALIDATION_ERROR',
                description: `La quantité de l'article "${item.name}" doit être supérieure à zéro.`,
            });
        }
    }

    if (data.payment && data.payment.length > 0) {
        for (const p of data.payment) {
            if (p.amount < 0) {
                throw new EmecfApiError({
                    code: 'VALIDATION_ERROR',
                    description: `Le montant du paiement "${p.name}" ne peut pas être négatif.`,
                });
            }
        }
    }
}
