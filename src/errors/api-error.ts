export class ApiError extends Error {
    constructor(
        public readonly code: string | undefined,
        message: string
    ) {
        super(message);
        this.name = 'E-MeCef ApiError ';
    }

    static fromResponse(error: any): ApiError {
        if (error.response?.data) {
            const { status, title, } = error.response.data;
            return new ApiError(status, title || 'Unknown E-MeCef API error');
        }
        return new ApiError(undefined, `Network Error: ${error.message}`);
    }
}