export class ApiError extends Error {
    constructor(
        public readonly code: string | undefined,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static fromResponse(error: any): ApiError {
        if (error.response?.data) {
            const { errorCode, errorDesc } = error.response.data;
            return new ApiError(errorCode, errorDesc || 'Unknown API error');
        }
        return new ApiError(undefined, `Network Error: ${error.message}`);
    }
}