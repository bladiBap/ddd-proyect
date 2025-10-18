import { Order as OrderDomain } from '@domain/aggregates/order/Order';
import { Order as OrderEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Order'; 
import { OrderItem as OrderItemDomain } from '@domain/aggregates/order/OrderItem';
import { OrderItem as OrderItemEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/OrderItem';

export class OrderMapper {

    static toPersistence(order: OrderDomain): OrderEntity {
        const orderEntity = new OrderEntity();
        orderEntity.id = order.getId();
        orderEntity.dateOrdered = order.getDateOrdered();
        orderEntity.dateCreatedOn = order.getDateCreatedOn();
        orderEntity.status = order.getStatus();
        orderEntity.orderItems = order.getListOrderItems().map(item => {
            const itemEntity = new OrderItemEntity();
            itemEntity.id = item.getId();
            itemEntity.quantity = item.getQuantity();
            itemEntity.status = item.getStatus();
            itemEntity.recipeId = item.getRecipeId();
            itemEntity.orderId = item.getOrderId();
            return itemEntity;
        });

        return orderEntity;
    }

    static toDomain(data: OrderEntity): OrderDomain {
        const order = new OrderDomain(
            data.id,
            data.dateOrdered,
            data.dateCreatedOn,
            data.status,
            data.orderItems.map(item => {
                return new OrderItemDomain(
                    item.id,
                    item.quantity,
                    item.status,
                    item.recipeId,
                    item.orderId
                );
            })
        );
        return order;
    }
}