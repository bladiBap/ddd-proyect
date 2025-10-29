import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CompleteOrderItemCommand } from "./CompleteOrderItemCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Result } from "core/results/Result";
import { ErrorCustom } from "core/results/ErrorCustom";
import { OrderItemRepository } from "@infrastructure/Persistence/Repositories/OrderItemRepository";

@injectable()
@CommandHandler(CompleteOrderItemCommand)
export class CompleteOrderItemCommandHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("IOrderItemRepository") private readonly orderItemRepository: OrderItemRepository
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
