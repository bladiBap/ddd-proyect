import { DomainEvent } from "core/abstractions/DomainEvent";

export class OrderItemCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}