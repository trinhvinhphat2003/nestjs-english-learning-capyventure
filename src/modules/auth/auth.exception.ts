export class AuthenticationError {
    nameError: string = 'AuthenticationError';
    message: string;
    code: number;
    constructor(message: string, code: number) {
        this.message = message;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}