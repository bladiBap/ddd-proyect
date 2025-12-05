import { inject, injectable } from "tsyringe";
import { Between, DataSource } from "typeorm";
import { ResultWithValue } from "@core/results/Result";

import { QueryHandler } from "@application/mediator/decorators";
import { GetOrderByDay } from "@application/order/queries/GetOrderByDay/GerOrderByDayQuery";

import { OrderDTOMapper } from "@application/order/queries/GetOrderByDay/OrderDTOMapper";
import { OrderDTO } from "@application/order/dto/OrderDTO";
import { Order } from "@infrastructure/Persistence/PersistenceModel/Entities/Order";

@injectable()
@QueryHandler(GetOrderByDay)
export class GetOrderDetailsHandler {

    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}

    async execute(query: GetOrderByDay): Promise< ResultWithValue<OrderDTO>> {
        
        const orderTable = this.dataSource.getRepository(Order);

        const startOfDay = new Date(query.date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(query.date);
        endOfDay.setHours(23, 59, 59, 999);

        const order = await orderTable.findOne({
            where: { dateOrdered: Between(startOfDay, endOfDay) },
            relations: [
                "orderItems",
                "orderItems.recipe",
                "orderItems.recipe.ingredients",
                "orderItems.recipe.ingredients.ingredient",
                "orderItems.recipe.ingredients.ingredient.measurementUnit"
            ]
        });

        if (!order) return ResultWithValue.fromValue<OrderDTO>({} as OrderDTO);

        return ResultWithValue.fromValue<OrderDTO>(OrderDTOMapper.toDTO(order));
    }
}
