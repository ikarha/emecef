import {resolveConfig} from './config';

describe('resolveConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...originalEnv};
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return config with valid environment variables', () => {
        process.env.EMECEF_BASE_URL = 'https://test-api.com/emcf/api';
        process.env.EMECEF_TOKEN = 'test-token';

        const config = resolveConfig();
        expect(config).toEqual({
            baseUrl: 'https://test-api.com/emcf/api',
            token: 'test-token',
            timeout: 30_000,
            retries: 3,
        });
    });

    it('should override env variables with explicit config', () => {
        process.env.EMECEF_BASE_URL = 'https://env-url.com/api';
        process.env.EMECEF_TOKEN = 'env-token';

        const config = resolveConfig({baseUrl: 'https://explicit-url.com/api', token: 'explicit-token', timeout: 5000});
        expect(config.baseUrl).toBe('https://explicit-url.com/api');
        expect(config.token).toBe('explicit-token');
        expect(config.timeout).toBe(5000);
    });

    it('should throw error if baseUrl is missing', () => {
        delete process.env.EMECEF_BASE_URL;
        process.env.EMECEF_TOKEN = 'test-token';
        expect(() => resolveConfig()).toThrow('baseUrl est requis');
    });

    it('should throw error if token is missing', () => {
        process.env.EMECEF_BASE_URL = 'https://test-api.com/emcf/api';
        delete process.env.EMECEF_TOKEN;
        expect(() => resolveConfig()).toThrow('token est requis');
    });

    it('should throw error if baseUrl is invalid', () => {
        process.env.EMECEF_BASE_URL = 'invalid-url';
        process.env.EMECEF_TOKEN = 'test-token';
        expect(() => resolveConfig()).toThrow('baseUrl doit être une URL valide');
    });
});
