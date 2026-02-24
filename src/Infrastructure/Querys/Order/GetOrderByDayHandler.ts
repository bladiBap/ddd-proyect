import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ResultWithValue } from '@common/Core/Results/Result';

import { QueryHandler } from '@/Common/Mediator/Decorators';
import { GetOrderByDay } from '@application/Order/Queries/GetOrderByDayQuery';

import { OrderDTOMapper } from '@application/Order/Queries/Mappers/OrderDTOMapper';
import { OrderDTO } from '@application/Order/Dto/OrderDTO';

import { Order } from '@infrastructure/Persistence/PersistenceModel/Entities/Order';
import { DateUtils } from '@/Common/Utils/Date';

@injectable()
@QueryHandler(GetOrderByDay)
export class GetOrderByDayHandler {

    constructor(
        @inject('DataSource') private readonly dataSource: DataSource
    ) {}

    async execute(query: GetOrderByDay): Promise< ResultWithValue<OrderDTO>> {
        
        const orderTable = this.dataSource.getRepository(Order);
        const date = DateUtils.formatDate(query.date);

        const order = await orderTable.findOne({
            where: { dateOrdered: date },
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
