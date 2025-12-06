import { DomainEvent } from "@core/Abstractions/DomainEvent";

export class OrderItemCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}