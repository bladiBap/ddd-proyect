import { Entity } from "../core/abstractions/Entity";
import { DomainException } from "../core/results/DomainExeption";
import { ClientError } from "./ClientError";
import { Address } from "./ValueObjects/Address";

export class Client extends Entity {

    private name: string;
    
    constructor(id: number, name: string) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( ClientError.nameIsRequired() );
        }
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        if (name.trim().length === 0) {
            throw new DomainException( ClientError.nameIsRequired() );
        }   
        this.name = name;
    }
}