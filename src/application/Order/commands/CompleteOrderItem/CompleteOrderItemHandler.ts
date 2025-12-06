import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/Decorators";
import { CompleteOrderItemCommand } from "./CompleteOrderItemCommand";
import { IUnitOfWork } from "@core/Abstractions/IUnitOfWork";
import { Result } from "@core/Results/Result";
import { Exception } from "@core/Results/ErrorCustom";
import { IOrderItemRepository } from "@domain/Order/Repositories/IOrderItemRepository";
import { IOrderRepository } from "@domain/Order/Repositories/IOrderRepository";

@injectable()
@CommandHandler(CompleteOrderItemCommand)
export class CompleteOrderItemHandler {

    constructor(
        @inject("IUnitOfWork") private readonly _unitOfWork: IUnitOfWork,
        @inject("IOrderItemRepository") private readonly _orderItemRepository: IOrderItemRepository,
        @inject("IOrderRepository") private readonly _orderRepository: IOrderRepository,
    ) {}

    async execute(command: CompleteOrderItemCommand): Promise<Result> {
        await this._unitOfWork.startTransaction();
        try {
            const orderItem = await this._orderItemRepository.getByIdAsync(command.orderItemId);

            if (!orderItem) {
                await this._unitOfWork.rollback();
                return Result.failure(
                    Exception.NotFound("OrderItem.NotFound", "Order item not found")
                );
            }

            const order = await this._orderRepository.getByIdTodayAsync(orderItem.getOrderId());
            
            if (!order) {
                await this._unitOfWork.rollback();
                return Result.failure(
                    Exception.NotFound("Order.NotFound", "Order not found for today")
                );
            }

            if (order.isStatusCompleted()) {
                await this._unitOfWork.rollback();
                return Result.failure(
                    Exception.InvalidOperation("OrderItem.CompleteFailed", "Cannot complete item of a completed order")
                );
            }
            const quantityPrepared = command.quantity ?? orderItem.getQuantityPlanned();
            orderItem.increaseQuantityPrepared(quantityPrepared);

            await this._orderItemRepository.updateAsync(orderItem);

            await this._unitOfWork.commit();
            return Result.success();
        } catch (error : any) {
            await this._unitOfWork.rollback();
            return Result.failure(
                Exception.Problem("OrderItem.CompleteFailed", error)
            );
        }
    }
}
