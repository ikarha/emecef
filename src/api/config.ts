import { ApiConfig } from '../types/common';

export const getConfig = (): ApiConfig => {
    const baseUrl = process.env.EMECEF_BASE_URL;
    const token = process.env.EMECEF_TOKEN;

    if (!baseUrl) {
        throw new Error('EMECEF_BASE_URL environment variable must be provided');
    }
    if (!/^https?:\/\/.+/i.test(baseUrl)) {
        throw new Error('EMECEF_BASE_URL must be a valid URL');
    }

    if (!token) {
        throw new Error('EMECEF_TOKEN environment variable must be provided');
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