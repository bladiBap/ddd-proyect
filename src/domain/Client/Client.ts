import { Entity } from "../core/abstractions/Entity";
import { DomainException } from "../core/results/DomainExeption";
import { ClientError } from "./ClientError";
import { Address } from "./ValueObjects/Address";

export class Client extends Entity {

    private name: string;
    private address: Address;
    
    constructor(id: number, name: string, address: Address) {
        super(id);
        if (name.trim().length === 0) {
            throw new DomainException( ClientError.nameIsRequired() );
        }
        this.name = name;
        this.address = address;
    }

    public getName(): string {
        return this.name;
    }

    public getAddress(): Address {
        return this.address;
    }

    public setName(name: string): void {
        if (name.trim().length === 0) {
            throw new DomainException( ClientError.nameIsRequired() );
        }   
        this.name = name;
    }

    public setAddress(address: Address): void {
        this.address = address;
    }
}