import { getConfig } from './config';

describe('getConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return config with valid environment variables', () => {
        process.env.EMECEF_BASE_URL = 'https://test-api.com/emcf/api';
        process.env.EMECEF_TOKEN = 'test-token';

        const config = getConfig();
        expect(config).toEqual({
            baseUrl: 'https://test-api.com/emcf/api',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer test-token'
            }
        });
    });

    it('should throw error if EMECEF_BASE_URL is missing', () => {
        delete process.env.EMECEF_BASE_URL;
        process.env.EMECEF_TOKEN = 'test-token';
        expect(() => getConfig()).toThrow('EMECEF_BASE_URL environment variable must be provided');
    });

    it('should throw error if EMECEF_TOKEN is missing', () => {
        process.env.EMECEF_BASE_URL = 'https://test-api.com/emcf/api';
        delete process.env.EMECEF_TOKEN;
        expect(() => getConfig()).toThrow('EMECEF_TOKEN environment variable must be provided');
    });

    it('should throw error if EMECEF_BASE_URL is invalid', () => {
        process.env.EMECEF_BASE_URL = 'invalid-url';
        process.env.EMECEF_TOKEN = 'test-token';
        expect(() => getConfig()).toThrow('EMECEF_BASE_URL must be a valid URL');
    });
});
