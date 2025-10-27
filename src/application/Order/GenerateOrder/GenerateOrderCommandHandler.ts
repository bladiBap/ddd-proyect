import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { GenerateOrderCommand } from "./GenerateOrderCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Order } from "@domain/aggregates/order/Order";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";
import { OrderRepository } from "@infrastructure/Persistence/Repositories/OrderRepositorty";
import { AddressRepository } from "@infrastructure/Persistence/Repositories/AddressRepository";
import { Result } from "core/results/Result";
import { ErrorCustom } from "core/results/ErrorCustom";

@CommandHandler(GenerateOrderCommand)
@injectable()
export class GenerateOrderCommandHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(_: GenerateOrderCommand): Promise<Result> {
        await this.unitOfWork.startTransaction();

        try {
            const orderRepo = this.unitOfWork.getRepository(OrderRepository);
            const addressRepo = this.unitOfWork.getRepository(AddressRepository);
            const today = new Date();

            const existing = await orderRepo.findByDateAsync(today);
            if (existing.length > 0) {
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.Conflict("Order.AlreadyExists", "An order for today already exists"));
            }

            const newOrder = new Order(0, today, today, StatusOrder.CREATED);

            const recipesToOrder = await addressRepo.getRecipesToPrepare(today);

            if (recipesToOrder.length === 0) {
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.NotFound("Order.NoRecipes", "No recipes found to generate an order"));
            }

            for (const item of recipesToOrder) {
                newOrder.addItem(item.recipeId, item.quantity, StatusOrder.CREATED);
            }
            
            await orderRepo.addAsync(newOrder);
            throw new Error("Simulated failure");
            await this.unitOfWork.commit();

            return Result.success();
        } catch (error) {
            await this.unitOfWork.rollback();
            return Result.failure(ErrorCustom.Problem("Order.CreationFailed", "Failed to create order due to an internal error"));
        }
    }
}
