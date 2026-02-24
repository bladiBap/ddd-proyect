import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';

export class OrderItemCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}