import { Entity } from "../../../../core/abstractions/Entity";

export class PackageItem extends Entity {

    private recipeId: number;
    private packageId: number;

    constructor(id: number, recipeId: number, packageId: number) {
        super(id);
        this.recipeId = recipeId;
        this.packageId = packageId;
    }

    public getRecipeId(): number {
        return this.recipeId;
    }

    public getPackageId(): number {
        return this.packageId;
    }
}