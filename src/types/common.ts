export interface ApiConfig {
    baseUrl: string;
    headers: {
        'Content-Type': string;
        'Accept': string;
        'Authorization'?: string;
    };
}