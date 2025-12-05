import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/mediator/decorators";
import { CompleteOrderItemCommand } from "./CompleteOrderItemCommand";
import { IUnitOfWork } from "@core/abstractions/IUnitOfWork";
import { Result } from "@core/results/Result";
import { Exception } from "@core/results/ErrorCustom";
import { IOrderItemRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";

@injectable()
@CommandHandler(CompleteOrderItemCommand)
export class CompleteOrderItemCommandHandler {

    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("IOrderItemRepository") private readonly orderItemRepository: IOrderItemRepository,
        @inject("IOrderRepository") private readonly orderRepository: IOrderRepository,
    ) {}

    async execute(command: CompleteOrderItemCommand): Promise<Result> {
        await this.unitOfWork.startTransaction();
        try {
            const orderItem = await this.orderItemRepository.getByIdAsync(command.orderItemId);

            if (!orderItem) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    Exception.NotFound("OrderItem.NotFound", "Order item not found")
                );
            }

            const order = await this.orderRepository.getByIdTodayAsync(orderItem.getOrderId());
            
            if (!order) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    Exception.NotFound("Order.NotFound", "Order not found for today")
                );
            }

            if (order.isStatusCompleted()) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    Exception.InvalidOperation("OrderItem.CompleteFailed", "Cannot complete item of a completed order")
                );
            }
            const quantityPrepared = command.quantity ?? orderItem.getQuantityPlanned();
            orderItem.increaseQuantityPrepared(quantityPrepared);

            await this.orderItemRepository.updateAsync(orderItem);

            await this.unitOfWork.commit();
            return Result.success();
        } catch (error : any) {
            await this.unitOfWork.rollback();
            return Result.failure(
                Exception.Problem("OrderItem.CompleteFailed", error)
            );
        }
    }
}
