import { Entity } from '@core/Abstractions/Entity';

export class PackageItem extends Entity {

    private recipeId: number;
    private packageId: number;
    private quantity: number;

    constructor(id: number, recipeId: number, packageId: number, quantity: number) {
        super(id);
        this.recipeId = recipeId;
        this.packageId = packageId;
        this.quantity = quantity;
    }

    public getRecipeId(): number {
        return this.recipeId;
    }

    public getPackageId(): number {
        return this.packageId;
    }

    public getQuantity(): number {
        return this.quantity;
    }
}