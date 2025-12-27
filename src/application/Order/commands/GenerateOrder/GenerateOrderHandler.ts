import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@application/Mediator/Decorators';
import { GenerateOrderCommand } from './GenerateOrderCommand';
import { IUnitOfWork } from '@core/Abstractions/IUnitOfWork';
import { Order } from '@domain/Order/Entities/Order';
import { StatusOrder } from '@domain/Order/Types/StatusOrderEnum';
import { Result } from '@core/Results/Result';
import { Exception } from '@core/Results/ErrorCustom';

import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';
import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';
import { IDailyAllocationRepository } from '@domain/DailyAllocation/Repositories/IDailyAllocationRepository';
import { DailyAllocation } from '@domain/DailyAllocation/Entities/DailyAllocation';
import { AllocationLine } from '@domain/DailyAllocation/Entities/AllocationLine';
import { IRecipeRepository } from '@domain/Recipe/Repositories/IRecipeRepository';

@injectable()
@CommandHandler(GenerateOrderCommand)
export class GenerateOrderHandler {
    constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IOrderRepository') private readonly _orderRepository: IOrderRepository,
        @inject('IAddressRepository') private readonly _addressRepository: IAddressRepository,
        @inject('IRecipeRepository') private readonly _recipeRepository: IRecipeRepository,
        @inject('IDailyAllocationRepository') private readonly _dailyAllocationRepository: IDailyAllocationRepository
    ) {}

    async execute(_: GenerateOrderCommand): Promise<Result> {
        await this._unitOfWork.startTransaction();
        try {
            const today = new Date();

            const existing = await this._orderRepository.findByDateAsync(today);
            if (existing.length > 0) {
                await this._unitOfWork.rollback();
                return Result.failure(Exception.Conflict('Order.AlreadyExists', 'An order for today already exists'));
            }

            const newOrder = new Order(0, today, today, StatusOrder.CREATED);
            const dailyAllocations = new DailyAllocation(0, today);

            const recipesToOrder = await this._recipeRepository.getRecipesToPrepare(today);
            const recipesPerClient = await this._addressRepository.getPerClientNeeds(today);

            if (recipesToOrder.length === 0) {
                await this._unitOfWork.rollback();
                return Result.failure(
                    Exception.NotFound('Order.NoRecipes', 'No recipes found to generate an order')
                );
            }

            for (const item of recipesToOrder) {
                newOrder.addItem(item.recipeId, item.quantity, 0, 0, StatusOrder.CREATED);
            }

            for (const clientNeed of recipesPerClient) {
                const line = new AllocationLine(0, dailyAllocations.getId(), clientNeed.clientId, clientNeed.recipeId, clientNeed.quantity);
                dailyAllocations.addLine(line);
            }
            
            await this._orderRepository.addAsync(newOrder);
            await this._dailyAllocationRepository.addAsync(dailyAllocations);
            
            await this._unitOfWork.commit();

            return Result.success();
        } catch (error) {
            await this._unitOfWork.rollback();
            return Result.failure(Exception.Problem('Order.CreationFailed', 'Failed to create order due to an internal error'));
        }
    }
}
