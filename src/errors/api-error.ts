import {AxiosResponse} from 'axios';

export interface EmecfErrorDetails {
    code: string;
    description: string;
    stack?: unknown;
}

export class EmecfApiError extends Error {
    public readonly details: EmecfErrorDetails;

    constructor(details: EmecfErrorDetails) {
        super(`${details.code} : ${details.description}`);
        this.name = 'E-MECEF-ERROR';
        this.details = details;
    }

    /**
     * Vérifie qu'une réponse HTTP 200 ne contient pas un errorCode applicatif.
     * Lance directement un EmecfApiError si c'est le cas.
     */
    static checkSuccessResponse<T>(response: AxiosResponse<T & { errorCode?: string }>): T {
        if (response?.data?.errorCode) {
            throw new EmecfApiError({
                code: response.data.errorCode,
                description: getErrorMessage(response.data.errorCode),
            });
        }
        return response.data;
    }

    /**
     * Construit un EmecfApiError à partir d'une erreur Axios (HTTP 4xx/5xx ou réseau).
     */
    static fromResponse(error: unknown): EmecfApiError {
        const asAxiosError = error as {
            response?: AxiosResponse & { data?: { errorCode?: string; errorDesc?: string } };
            message?: string;
            code?: string;
        };

        // Erreur réseau (pas de réponse du serveur)
        if (!asAxiosError.response) {
            return new EmecfApiError({
                code: 'NETWORK_ERROR',
                description: getErrorMessage('NETWORK_ERROR'),
                stack: error,
            });
        }

        if (asAxiosError.response.status === 400) {
            if (asAxiosError.response.data?.errorCode) {
                return new EmecfApiError({
                    code: asAxiosError.response.data.errorCode,
                    description: getErrorMessage(asAxiosError.response.data.errorCode),
                    stack: error,
                });
            }
            return new EmecfApiError({
                code: 'BAD_REQUEST',
                description: getErrorMessage('BAD_REQUEST'),
                stack: error,
            });
        }

        if (asAxiosError.response.status === 500) {
            return new EmecfApiError({
                code: 'INTERNAL_SERVER_ERROR',
                description: getErrorMessage('INTERNAL_SERVER_ERROR'),
                stack: error,
            });
        }

        if (asAxiosError.response.data?.errorCode) {
            const {errorCode, errorDesc} = asAxiosError.response.data;
            return new EmecfApiError({
                code: errorCode,
                description: errorDesc || getErrorMessage(errorCode),
                stack: error,
            });
        }

        return new EmecfApiError({
            code: 'UNKNOWN_ERROR',
            description: asAxiosError.message || getErrorMessage('UNKNOWN_ERROR'),
            stack: error,
        });
    }
}

export function getErrorMessage(errorCode: string): string {
    return errors[errorCode] || 'Contactez le support technique e-mecef pour plus d\'assistance.';
}

export const errors: Record<string, string> = {
    'INTERNAL_SERVER_ERROR': 'Erreur interne du serveur emecef, veuillez réessayer ultérieurement.',
    'VALIDATION_ERROR': 'Données invalides.',
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
