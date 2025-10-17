import { Entity } from "../shared/abstractions/Entity";
import { DomainException } from "../shared/results/DomainExeption";
import { MeasurementUnitError } from "./MeasurementUnitError";

export class MeasurementUnit extends Entity {

    private name: string;
    private simbol: string;

    constructor(id: number, name: string, simbol: string) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( MeasurementUnitError.nameIsRequired() );
        }
        if (simbol.trim().length === 0) {
            throw new DomainException( MeasurementUnitError.simbolIsRequired() );
        }
        this.name = name;
        this.simbol = simbol;
    }

    public getName(): string {
        return this.name;
    }

    public getSimbol(): string {
        return this.simbol;
    }

    public setName(name: string): void {
        if (name.trim().length === 0) {
            throw new DomainException( MeasurementUnitError.nameIsRequired() );
        }
        this.name = name;
    }

    public setSimbol(simbol: string): void {
        if (simbol.trim().length === 0) {
            throw new DomainException( MeasurementUnitError.simbolIsRequired() );
        }
        this.simbol = simbol;
    }
}