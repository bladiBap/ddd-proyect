import { injectable } from "tsyringe";
import { QueryHandler } from "../../application/Mediator/decorators";
import { GetOrderByDay } from "../../application/Order/GetOrderByDay/GerOrderByDay";
import { OrderDTOMapper } from "../../application/Order/GetOrderByDay/OrderDTOMapper";
import { OrderDTO } from "../../application/Order/dto/OrderDTO";
import { ResultWithValue } from "@core/results/Result";

import { AppDataSource } from "@infrastructure/Persistence/PersistenceModel/data-source";
import { Order } from "@infrastructure/Persistence/PersistenceModel/Entities/Order";

import { Between } from "typeorm";

@QueryHandler(GetOrderByDay)
@injectable()
export class GetOrderDetailsHandler {

    async execute(query: GetOrderByDay): Promise< ResultWithValue<OrderDTO>> {
        
        const orderRepo = AppDataSource.getRepository(Order);

        const startOfDay = new Date(query.date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(query.date);
        endOfDay.setHours(23, 59, 59, 999);

        const order = await orderRepo.findOne({
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
