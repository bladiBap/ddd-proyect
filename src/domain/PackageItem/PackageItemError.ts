export class PackageItemError {
    
    public static recipeIdMustBeGreaterThanZero(id: number): Error {
        return new Error(`The recipeId must be greater than zero. Given: ${id}.`);
    }
}