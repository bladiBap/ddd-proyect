import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';

export class OrderCompletedEvent extends DomainEvent {
    constructor(public readonly orderId: number) { super(); }
}