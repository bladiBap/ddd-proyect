import { injectable } from "tsyringe";
import { QueryHandler } from "../../Mediator/decorators";
import { GetOrderByDayQuery } from "./GerOrderByDayQuery";
import { OrderDTOMapper } from "../mappers/OrderDTOMapper";
import { OrderDTO } from "../dto/OrderDTO";

import { AppDataSource } from "@infrastructure/Persistence/PersistenceModel/data-source";
import { Order } from "@infrastructure/Persistence/PersistenceModel/Entities/Order";

import { Between } from "typeorm";

@QueryHandler(GetOrderByDayQuery)
@injectable()
export class GetOrderDetailsQueryHandler {
    async execute(query: GetOrderByDayQuery): Promise<OrderDTO | null> {
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

        if (!order) return null;

        return OrderDTOMapper.fromEntity(order);
    }
}
