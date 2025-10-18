export class DomainException {
    
    public readonly errorMessage: string;
    public readonly error: Error;

    constructor(error: Error) {
        this.error = error;
        this.errorMessage = error.message;
    }
}