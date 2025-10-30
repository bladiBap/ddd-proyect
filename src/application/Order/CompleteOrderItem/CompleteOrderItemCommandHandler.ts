import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CompleteOrderItemCommand } from "./CompleteOrderItemCommand";
import { IUnitOfWork } from "@core/abstractions/IUnitOfWork";
import { Result } from "@core/results/Result";
import { ErrorCustom } from "@core/results/ErrorCustom";
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
        const manager = this.unitOfWork.getManager();
        try {
            const orderItem = await this.orderItemRepository.getByIdAsync(command.orderItemId);

            if (!orderItem) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    ErrorCustom.NotFound("OrderItem.NotFound", "Order item not found")
                );
            }

            const order = await this.orderRepository.getByIdAsync(orderItem.getOrderId());
            
            if (!order) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    ErrorCustom.NotFound("Order.NotFound", "Order not found")
                );
            }
            if (order.isStatusCompleted()) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    ErrorCustom.InvalidOperation("OrderItem.CompleteFailed", "Cannot complete item of a completed order")
                );
            }
            const quantityPrepared = command.quantity ?? orderItem.getQuantityPlanned();
            orderItem.increaseQuantityPrepared(quantityPrepared);

            await this.orderItemRepository.updateAsync(orderItem, manager);

            await this.unitOfWork.commit();
            return Result.success();
        } catch (error : any) {
            await this.unitOfWork.rollback();
            return Result.failure(
                ErrorCustom.Problem("OrderItem.CompleteFailed", error)
            );
        }
    }
}
