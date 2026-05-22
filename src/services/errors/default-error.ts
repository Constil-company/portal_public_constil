export class DefaultError extends Error {
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
        case 400:
            return 'There was an unexpected error. Request contains invalid data!';
        case 401:
            return 'There was an unexpected error. You are not authorized to access this resource!';
        case 403:
            return 'There was an unexpected error. You do not have permission to access this resource!';
        case 404:
            return 'There was an unexpected error. The requested resource was not found!';
        case 500:
        default:
            return 'There was an unexpected error, please try again!';
    }
}