export class AllocationLineError {

    public static quantityPackagedExceedsNeeded(quantityPackaged: number, quantityNeeded: number) : Error {
        return new Error(`The packaged quantity (${quantityPackaged}) exceeds the needed quantity (${quantityNeeded}).`);
    }

    public static quantityNeededMustBeGreaterThanZero(quantityNeeded: number) : Error {
        return new Error(`The needed quantity (${quantityNeeded}) must be greater than zero.`);
    }
}