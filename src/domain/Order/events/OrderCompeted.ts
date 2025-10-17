import { DomainEvent } from '../../shared/abstractions/DomainEvent';
export class OrderCompleted extends DomainEvent {

    public readonly orderId: string;
    public readonly dateCompleted: Date;

    constructor(orderId: string) {
        super();
        this.orderId = orderId;
        this.dateCompleted = new Date();
    }
}