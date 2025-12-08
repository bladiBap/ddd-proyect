export class AddressError {

    // no puede ser menor o igual a 0
    public static notLessThanOrEqualToZero(fieldName: string, value: number): Error {
        return new Error(`The field '${fieldName}' cannot be less than or equal to zero. Current value: ${value}.`);
    }
}