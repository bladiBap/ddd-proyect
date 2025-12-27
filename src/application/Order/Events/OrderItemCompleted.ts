import { injectable, inject } from 'tsyringe';
import { EventHandler } from '@application/Mediator/Decorators';
import { OrderItemCompletedEvent } from '@domain/Order/Events/OrderItemCompletedEvent';
import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';
import { OrderExeption } from '../Exeptions/OrderExeption';

@injectable()
@EventHandler(OrderItemCompletedEvent)
export class OrderItemCompleted {

    constructor(
        @inject('IOrderRepository') private readonly _orderRepository: IOrderRepository
    ) {}

    async handle(event: OrderItemCompletedEvent): Promise<void> {
        const orderId = event.orderId;

        const order = await this._orderRepository.getByIdAsync(orderId);
        
        if (!order) {
            throw OrderExeption.notFoundById(orderId);
        }

        order.changeToCompleted();
        await this._orderRepository.updatedAsync(order);
    }
}
