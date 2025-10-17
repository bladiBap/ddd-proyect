export class IngredientError {

    public static nameIsRequired(): Error {
        return new Error(`The name of the ingredient is required.`);
    }

    public static quantityMustBeGreaterThanZero(cantidad: number): Error {
        return new Error(`Quantity must be greater than zero. Given: ${cantidad}.`);
    }
}