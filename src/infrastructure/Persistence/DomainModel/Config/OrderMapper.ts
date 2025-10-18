import { Order as OrderDomain } from '@domain/aggregates/order/Order';
import { Order as OrderEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Order'; 
import { OrderItem as OrderItemDomain } from '@domain/aggregates/order/OrderItem';
import { OrderItem as OrderItemEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/OrderItem';

export class OrderMapper {

    static toPersistenceList(orders: OrderDomain[]): OrderEntity[] {
        return orders.map(order => this.toPersistence(order));
    }

    static toPersistence(order: OrderDomain): OrderEntity {

        const orderItemsEntities: OrderItemEntity[] = order.getListOrderItems()?.map(item => {
            const itemEntity = new OrderItemEntity();
            if (item.getId() !== 0) {
                itemEntity.id = item.getId();
            }
            if (item.getOrderId() !== 0) {
                itemEntity.orderId = item.getOrderId();
            }
            itemEntity.quantity = item.getQuantity();
            itemEntity.status = item.getStatus();
            itemEntity.recipeId = item.getRecipeId();
            return itemEntity;
        });

        const orderEntity = new OrderEntity();
        if (order.getId() !== 0) {
            orderEntity.id = order.getId();
        }
        orderEntity.dateOrdered = order.getDateOrdered();
        orderEntity.dateCreatedOn = order.getDateCreatedOn();
        orderEntity.status = order.getStatus();
        orderEntity.orderItems = orderItemsEntities || [];

        orderEntity.orderItems.forEach(item => {
            item.order = orderEntity;
        });

        return orderEntity;
    }

    static toDomainList(data: OrderEntity[]): OrderDomain[] {
        const array: OrderDomain[] = [];
        data.forEach(item => {
            array.push(this.toDomain(item));
        });
        return array;
    }

    static toDomain(data: OrderEntity): OrderDomain {

        const orderItems: OrderItemDomain[] = data.orderItems?.map(item => {
            return new OrderItemDomain(
                item.id,
                item.quantity,
                item.status,
                item.recipeId,
                item.orderId
            );
        }); 

        const order = new OrderDomain(
            data.id,
            data.dateOrdered,
            data.dateCreatedOn,
            data.status,
            orderItems || []
        );
        return order;
    }
}