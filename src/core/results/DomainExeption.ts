import { Exception } from './ErrorCustom';

export class DomainException extends Error {
    
    public readonly errorMessage: string;
    public readonly error: Error;
    
    constructor(error: Error) {
        super(error.message);
        this.error = error;
        this.errorMessage = error.message;
    }
}