import { Entity } from '@core/Abstractions/Entity';
import { DomainException } from '@core/Results/DomainExeption';
import { ClientError } from '../Errors/ClientError';

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