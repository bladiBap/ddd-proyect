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
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("IOrderRepository") private readonly orderItemRepository: IOrderRepository
    ) {}

    async handle(event: OrderItemCompletedEvent): Promise<void> {
        const orderId = event.orderId;

        await this.unitOfWork.startTransaction();
        const order = await this.orderItemRepository.getByIdAsync(orderId);
        
        if (!order) {
            await this.unitOfWork.rollback();
            return;
        }

        if (order.isStatusCompleted()) {
            await this.unitOfWork.rollback();
            return;
        }

        order.tryMarkCompleted();
        if (order.isStatusCompleted()) {
            await this.orderItemRepository.updatedAsync(order);
            await this.unitOfWork.commit();
        }else {
            await this.unitOfWork.rollback();
        }
    }
}
