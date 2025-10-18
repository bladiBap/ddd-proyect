import { Order } from "@infrastructure/Persistence/PersistenceModel/Entities/Order";
import { OrderDTO } from "../dto/OrderDTO";

export class OrderDTOMapper {
    static fromEntity(order: Order): OrderDTO {
        return {
        id: order.id,
        dateOrdered: order.dateOrdered.toISOString(),
        dateCreatedOn: order.dateCreatedOn.toISOString(),
        status: order.status,
        orderItems: order.orderItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            status: item.status,
            recipe: {
                id: item.recipe.id,
                name: item.recipe.name,
                instructions: item.recipe.instructions,
                ingredients: item.recipe.ingredients.map(ri => ({
                    id: ri.ingredient.id,
                    name: ri.ingredient.name,
                    measurementUnit: {
                        id: ri.ingredient.measurementUnit.id,
                        name: ri.ingredient.measurementUnit.name,
                        simbol: ri.ingredient.measurementUnit.simbol
                    }
                }))
            }
        }))
        };
    }
}
