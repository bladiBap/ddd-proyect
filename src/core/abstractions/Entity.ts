import { DomainEvent } from "./DomainEvent";

export abstract class Entity {

    protected id: number;
    private _domainEvents: DomainEvent[];

    public constructor(id?: number) {
        if (id !== undefined) {
            this.publicContructor(id);
        }else {
            this.protectedContructor();
        }
    }

    private publicContructor(id: number): void {
        this.id = id;
        this._domainEvents = [];
    }

    private protectedContructor(): void {
        this._domainEvents = [];
    }

    public addDomainEvent(domainEvent: DomainEvent): void {
        this._domainEvents.push(domainEvent);
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }

    public getDomainEvents(): DomainEvent[] {
        return this._domainEvents;
    }

    public getId(): number {
        return this.id;
    }

    protected setId(id: number): void {
        this.id = id;
    }
}