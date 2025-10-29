import { Entity } from '@core/abstractions/Entity';
import { AllocationLineError } from './AllocationLineError';
export class AllocationLine extends Entity {
    private allocationId : number;
    private clientId : number;
    private recipeId : number;
    private quantityNeeded : number;
    private quantityPackaged : number;

    constructor(id: number, allocationId: number, clientId: number, recipeId: number,  quantityNeeded: number, quantityPackaged: number = 0) {
        super(id);
        this.allocationId = allocationId;
        this.clientId = clientId;
        this.recipeId = recipeId;
        if (quantityNeeded <= 0) {
            throw AllocationLineError.quantityNeededMustBeGreaterThanZero(quantityNeeded);
        }

        if (quantityPackaged > quantityNeeded) {
            throw AllocationLineError.quantityPackagedExceedsNeeded(quantityPackaged, quantityNeeded);
        }
        this.quantityNeeded = quantityNeeded;
        this.quantityPackaged = quantityPackaged;
    }

    public updateQuantityPackaged(newQuantityPackaged: number) : void {
        if (newQuantityPackaged > this.quantityNeeded) {
            throw AllocationLineError.quantityPackagedExceedsNeeded(newQuantityPackaged, this.quantityNeeded);
        }
        this.quantityPackaged = newQuantityPackaged;
    }

    public remainingQuantityToPackage() : number {
        return this.quantityNeeded - this.quantityPackaged;
    }

    public getClientId() : number {
        return this.clientId;
    }

    public getRecipeId() : number {
        return this.recipeId;
    }

    public getQuantityNeeded() : number {
        return this.quantityNeeded;
    }

    public getQuantityPackaged() : number {
        return this.quantityPackaged;
    }

    public getAllocationId() : number {
        return this.allocationId;
    }
}