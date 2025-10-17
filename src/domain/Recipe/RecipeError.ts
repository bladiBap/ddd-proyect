export class RecipeError {

    public static nameIsRequired(): Error {
        return new Error(`The name of the recipe is required.`);
    }

    public static listOfIngredientsCannotBeEmpty(): Error {
        return new Error(`The list of ingredients cannot be empty.`);
    }

    public static instructionsAreRequired(): Error {
        return new Error(`The instructions of the recipe are required.`);
    }
}