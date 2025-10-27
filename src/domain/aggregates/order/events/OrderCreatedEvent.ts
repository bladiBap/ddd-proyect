import { DomainEvent } from "core/abstractions/DomainEvent";

export class OrderCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}