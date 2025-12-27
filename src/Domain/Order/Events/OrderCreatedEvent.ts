import { DomainEvent } from '@core/Abstractions/DomainEvent';

export class OrderCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}