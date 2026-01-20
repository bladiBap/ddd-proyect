import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ResultWithValue } from '@common/Core/Results/Result';

import { QueryHandler } from '@/Common/Mediator/Decorators';
import { GetOrderById } from '@application/Order/Queries/GetOrderByIdQuery';

import { OrderDTOMapper } from '@application/Order/Queries/Mappers/OrderDTOMapper';
import { OrderDTO } from '@application/Order/Dto/OrderDTO';

import { Order } from '@infrastructure/Persistence/PersistenceModel/Entities/Order';

@injectable()
@QueryHandler(GetOrderById)
export class GetOrderByIdHandler {

    constructor(
        @inject('DataSource') private readonly dataSource: DataSource
    ) {}

    async execute(query: GetOrderById): Promise< ResultWithValue<OrderDTO>> {
        
        const orderTable = this.dataSource.getRepository(Order);
        const orderId = query.id;

        const order = await orderTable.findOne({
            where: { id: orderId },
            relations: [
                'orderItems',
                'orderItems.recipe',
                'orderItems.recipe.ingredients',
                'orderItems.recipe.ingredients.ingredient',
                'orderItems.recipe.ingredients.ingredient.measurementUnit'
            ]
        });

        if (!order) {
            return ResultWithValue.fromValue<OrderDTO>({} as OrderDTO);
        }

        return ResultWithValue.fromValue<OrderDTO>(OrderDTOMapper.toDTO(order));
    }
}
