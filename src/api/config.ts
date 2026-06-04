export interface EmecefConfig {
    baseUrl: string;
    token: string;
    /** Timeout des requêtes en millisecondes (défaut : 30 000) */
    timeout?: number;
    /** Nombre de tentatives en cas d'erreur réseau ou 5xx (défaut : 3, mettre 0 pour désactiver) */
    retries?: number;
}

/**
 * Résout la configuration à partir des paramètres fournis ou des variables d'environnement.
 * Les paramètres explicites ont la priorité sur les variables d'environnement.
 */
export const resolveConfig = (config?: Partial<EmecefConfig>): EmecefConfig => {
    const baseUrl = config?.baseUrl ?? process.env.EMECEF_BASE_URL;
    const token = config?.token ?? process.env.EMECEF_TOKEN;

    if (!baseUrl) {
        throw new Error(
            'baseUrl est requis. Passez-le en paramètre ou définissez la variable d\'environnement EMECEF_BASE_URL.'
        );
    }
    if (!/^https?:\/\/.+/i.test(baseUrl)) {
        throw new Error('baseUrl doit être une URL valide (http:// ou https://).');
    }
    if (!token) {
        throw new Error(
            'token est requis. Passez-le en paramètre ou définissez la variable d\'environnement EMECEF_TOKEN.'
        );
    }

    return {
        baseUrl,
        token,
        timeout: config?.timeout ?? 30_000,
        retries: config?.retries ?? 3,
    };
};

/** @deprecated Utilisez resolveConfig() à la place */
export const getConfig = resolveConfig;
