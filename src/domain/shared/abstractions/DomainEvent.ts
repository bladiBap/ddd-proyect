export abstract class DomainEvent {
    public id: number;
    public occurredOn: Date;

    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        this.occurredOn = new Date();
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getOccurredOn(): Date {
        return this.occurredOn;
    }

    setOccurredOn(occurredOn: Date): void {
        this.occurredOn = occurredOn;
    }
}