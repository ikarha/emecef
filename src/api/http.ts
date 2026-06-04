import axios, {AxiosInstance} from 'axios';
import axiosRetry from 'axios-retry';
import {EmecefConfig} from './config';

/**
 * Crée une instance axios pré-configurée avec :
 * - les headers d'authentification
 * - un timeout
 * - un retry automatique avec backoff exponentiel sur les erreurs réseau et les 5xx
 */
export function createHttpClient(config: EmecefConfig, path: string): AxiosInstance {
    const instance = axios.create({
        baseURL: `${config.baseUrl}${path}`,
        timeout: config.timeout,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${config.token}`,
        },
    });

    axiosRetry(instance, {
        retries: config.retries ?? 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) =>
            axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
        onRetry: (retryCount, error) => {
            console.warn(`[emecef] Tentative ${retryCount} après erreur : ${error.message}`);
        },
    });

    return instance;
}
