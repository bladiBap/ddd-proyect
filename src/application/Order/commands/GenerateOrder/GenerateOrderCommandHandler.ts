import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/mediator/decorators";
import { GenerateOrderCommand } from "./GenerateOrderCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Order } from "@domain/aggregates/order/Order";
import { StatusOrder } from "@domain/aggregates/order/StatusOrderEnum";
import { Result } from "core/results/Result";
import { Exception } from "core/results/ErrorCustom";

import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";
import { IDailyAllocationRepository } from "@domain/aggregates/dailyAllocation/IDailyAllocationRepository";
import { DailyAllocation } from "@domain/aggregates/dailyAllocation/DailyAllocation";
import { AllocationLine } from "@domain/aggregates/dailyAllocation/AllocationLine";

@injectable()
@CommandHandler(GenerateOrderCommand)
export class GenerateOrderCommandHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("IOrderRepository") private readonly orderRepository: IOrderRepository,
        @inject("IAddressRepository") private readonly addressRepository: IAddressRepository,
        @inject("IDailyAllocationRepository") private readonly dailyAllocationRepository: IDailyAllocationRepository
    ) {}

    async execute(_: GenerateOrderCommand): Promise<Result> {
        await this.unitOfWork.startTransaction();
        try {
            const today = new Date();

            const existing = await this.orderRepository.findByDateAsync(today);
            if (existing.length > 0) {
                await this.unitOfWork.rollback();
                return Result.failure(Exception.Conflict("Order.AlreadyExists", "An order for today already exists"));
            }

            const newOrder = new Order(0, today, today, StatusOrder.CREATED);
            const dailyAllocations = new DailyAllocation(0, today);

            const recipesToOrder = await this.addressRepository.getRecipesToPrepare(today);
            const recipesPerClient = await this.addressRepository.getPerClientNeeds(today);

            if (recipesToOrder.length === 0) {
                await this.unitOfWork.rollback();
                return Result.failure(Exception.NotFound("Order.NoRecipes", "No recipes found to generate an order"));
            }

            for (const item of recipesToOrder) {
                newOrder.addItem(item.recipeId, item.quantity, 0, 0, StatusOrder.CREATED);
            }

            for (const clientNeed of recipesPerClient) {
                const line = new AllocationLine(0, dailyAllocations.getId(), clientNeed.clientId, clientNeed.recipeId, clientNeed.quantity);
                dailyAllocations.addLine(line);
            }
            
            await this.orderRepository.addAsync(newOrder);
            await this.dailyAllocationRepository.addAsync(dailyAllocations);
            
            await this.unitOfWork.commit();

            return Result.success();
        } catch (error) {
            await this.unitOfWork.rollback();
            return Result.failure(Exception.Problem("Order.CreationFailed", "Failed to create order due to an internal error"));
        }
    }
}
