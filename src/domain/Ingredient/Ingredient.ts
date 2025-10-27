import { MeasurementUnit } from "../MeasurementUnit/MeasurementUnit";
import { Entity } from "../../core/abstractions/Entity";
import { DomainException } from "../../core/results/DomainExeption";
import { IngredientError } from "./IngredientError";

export class Ingredient extends Entity {

    private name: string;
    private measurementUnit: MeasurementUnit;
    private quantity: number;

    constructor(id: number, name: string, measurementUnit: MeasurementUnit, quantity: number) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( IngredientError.nameIsRequired() );
        }

        if (quantity <= 0) {
            throw new DomainException( IngredientError.quantityMustBeGreaterThanZero(quantity) );
        }

        this.name = name;
        this.measurementUnit = measurementUnit;
        this.quantity = quantity;
    }

    public getName(): string {
        return this.name;
    }

    public getMeasurementUnit(): MeasurementUnit {
        return this.measurementUnit;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public setName(name: string): void {
        if (name.trim().length === 0) {
            throw new DomainException( IngredientError.nameIsRequired() );
        }
        this.name = name;
    }

    public setMeasurementUnit(measurementUnit: MeasurementUnit): void {
        this.measurementUnit = measurementUnit;
    }

    public setQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new DomainException( IngredientError.quantityMustBeGreaterThanZero(quantity) );
        }
        this.quantity = quantity;
    }
}