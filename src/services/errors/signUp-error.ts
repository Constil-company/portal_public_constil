export class SignUpError extends Error {
    status: number;
    message: string;

    constructor(statusCode: number, message?: string) {
        super();
        this.status = statusCode;
        this.message = message ?? getErrorMessageKey(statusCode);
    }
}

function getErrorMessageKey(statusCode: number) {
    switch(statusCode) {
        case 404:
        case 400:
            return 'Email or password may be incorrect.';
        case 401:
            return 'Invalid credentials.';
        case 403:
            return 'You do not have permission.';
        case 500:
        default:
            return 'Please try again late.';
    }
}