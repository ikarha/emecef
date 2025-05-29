export interface EmecfErrorDetails {
    code: string;
    description: string;
    stack?: any;
}

export class EmecfApiError extends Error {
    public readonly details: EmecfErrorDetails;

    constructor(details: EmecfErrorDetails) {
        super(`${details.code} : ${details.description}`);
        this.name = 'E-MECEF-ERROR';
        this.details = details;
    }

    static fromResponse(error: any): EmecfApiError {
        if (error.status === 200) {
            if (error?.data?.errorCode) {
                throw new EmecfApiError({
                    code: error.data.errorCode,
                    description: getErrorMessage(error.data.errorCode),
                    stack: ''
                });
            }
        }

        if (error.response?.status === 400) {
            if (error.response.data?.errorCode) {
                return new EmecfApiError({
                    code: error.response.data.errorCode,
                    description: getErrorMessage(error.response.data.errorCode),
                    stack: error
                });
            }
            return new EmecfApiError({
                code: 'BAD_REQUEST',
                description: getErrorMessage('BAD_REQUEST'),
                stack: error
            })
        }

        if (error.response?.status === 500) {
            return new EmecfApiError({
                code: 'ITERNAL_SERVER_ERROR',
                description: getErrorMessage('ITERNAL_SERVER_ERROR'),
                stack: error
            });
        }

        if (error.response?.data?.errorCode) {
            const {errorCode, errorDesc} = error.response.data;
            return new EmecfApiError({
                code: errorCode,
                description: errorDesc || getErrorMessage(errorCode) || 'Erreur inconnue API error',
                stack: error
            });
        }

        return new EmecfApiError({
            code: 'UNKNOWN_ERROR',
            description: error.message || getErrorMessage('UNKNOWN_ERROR'),
            stack: error
        });
    }

    static checkSuccessResponse(response: any): any {
        if (response?.data?.errorCode) {
            throw response
        }
        return response.data
    }
}

export function getErrorMessage(errorCode: string): string {
    return errors[errorCode] || 'Contactez le support technique e-mecef pour plus d\'assistance.';
}

export const errors: Record<string, string> = {

    'ITERNAL_SERVER_ERROR': 'Erreur interne du serveur emecef, veuillez réessayer ultérieurement.',
    'BAD_REQUEST': 'Requête invalide, veuillez vérifier les données envoyées.',
    'UNKNOWN_ERROR': 'Une erreur inconnue s\'est produite, veuillez vérifier votre connexion Internet ou si vous avez écrit correctement l\'URL de l\'API.',
    'NETWORK_ERROR': 'Erreur de réseau, veuillez vérifier votre connexion Internet.',

    '1': 'Le nombre maximum de factures en attente est dépassé',
    '3': 'Le type de facture n\'est pas valide',
    '4': 'La référence de la facture originale est manquante',
    '5': 'La référence de la facture originale ne comporte pas 24 caractères',
    '6': 'La valeur de l\'AIB n\'est pas valide',
    '7': 'Le type de paiement n\'est pas valide',
    '8': 'La facture doit contenir des articles',
    '9': 'Le groupe de taxation au niveau des articles n\'est pas valide',
    '10': 'La référence de la facture originale ne peut pas être validée, veuillez réessayer plus tard',
    '11': 'La référence de la facture originale n\'est pas valide (la facture originale est introuvable)',
    '12': 'La référence de la facture originale n\'est pas valide (le montant sur la facture d\'avoir a dépassé le montant de la facture originale)',
    '20': 'La facture n\'existe pas ou elle est déjà finalisée / annulée',
    '99': 'Erreur lors du traitement de la demande',
};

