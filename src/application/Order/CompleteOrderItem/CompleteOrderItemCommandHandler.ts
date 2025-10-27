import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CompleteOrderItemCommand } from "./CompleteOrderItemCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Result } from "core/results/Result";
import { ErrorCustom } from "core/results/ErrorCustom";
import { OrderItemRepository } from "@infrastructure/Persistence/Repositories/OrderItemRepository";

@CommandHandler(CompleteOrderItemCommand)
@injectable()
export class CompleteOrderItemCommandHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(command: CompleteOrderItemCommand): Promise<Result> {
        await this.unitOfWork.startTransaction();

        try {
            const orderItemRepo = this.unitOfWork.getRepository(OrderItemRepository);

            const orderItem = await orderItemRepo.getByIdAsync(command.orderItemId);
            if (!orderItem) {
                await this.unitOfWork.rollback();
                return Result.failure(
                    ErrorCustom.NotFound("OrderItem.NotFound", "Order item not found")
                );
            }

            orderItem.changeStatusToCompleted();
            await orderItemRepo.updateAsync(orderItem);

            await this.unitOfWork.commit();
            return Result.success();
        } catch (error : any) {
            await this.unitOfWork.rollback();
            return Result.failure(
                ErrorCustom.Problem("OrderItem.CompleteFailed", error.message)
            );
        }
    }
}
