// handler de evento
import { injectable, inject } from "tsyringe";
import { EventHandler } from "@application/Mediator/decorators";
import { OrderItemCompletedEvent } from "@domain/aggregates/order/events/OrderItemCompletedEvent";
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { IUnitOfWork } from "@core/abstractions/IUnitOfWork";


@injectable()
@EventHandler(OrderItemCompletedEvent)
export class OrderItemCompletedEventHandler {

    constructor(
        @inject("IOrderRepository") private readonly orderRepository: IOrderRepository
    ) {}

    async handle(event: OrderItemCompletedEvent): Promise<void> {
        const orderId = event.orderId;

        const order = await this.orderRepository.getByIdAsync(orderId);
        
        if (!order) {
            throw new Error(`Order with id ${orderId} not found.`);
        }

        if (order.isStatusCompleted()) {
            throw new Error("Order is already completed.");
        }

        order.tryMarkCompleted();
        if (order.isStatusCompleted()) {
            await this.orderRepository.updatedAsync(order);
        }
    }
}
