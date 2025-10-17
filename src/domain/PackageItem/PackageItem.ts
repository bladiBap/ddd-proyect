import { Entity } from "../shared/abstractions/Entity";
import { DomainException } from "../shared/results/DomainExeption";
import { PackageItemError } from "./PackageItemError";

export class PackageItem extends Entity {

    private recetaId: number;

    constructor(id: number, recipeId: number) {
        super(id);
        if (recipeId <= 0) {
            throw new DomainException( PackageItemError.recipeIdMustBeGreaterThanZero(recipeId) );
        }
        this.recetaId = recipeId;
    }

    public getRecetaId(): number {
        return this.recetaId;
    }
}