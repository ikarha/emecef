import { ApiConfig } from '../types/common';

export const getConfig = (): ApiConfig => {
    const baseUrl = process.env.EMCF_BASE_URL;
    const token = process.env.EMCF_TOKEN;

    if (!baseUrl) {
        throw new Error('EMCF_BASE_URL environment variable must be provided');
    }
    if (!token) {
        throw new Error('EMCF_TOKEN environment variable must be provided');
    }

    return {
        baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
};