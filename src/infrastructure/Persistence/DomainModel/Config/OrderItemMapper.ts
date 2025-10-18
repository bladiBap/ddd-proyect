import { OrderItem as OrderItemDomain } from '@domain/aggregates/order/OrderItem';
import { OrderItem as OrderItemEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/OrderItem';

export class OrderItemMapper {
    static toPersistenceList(items: OrderItemDomain[]): OrderItemEntity[] {
        return items.map(item => this.toPersistence(item));
    }

    static toPersistence(item: OrderItemDomain): OrderItemEntity {
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
    }

    static toDomainList(data: OrderItemEntity[]): OrderItemDomain[] {
        return data.map(item => this.toDomain(item));
    }

    static toDomain(data: OrderItemEntity): OrderItemDomain {
        return new OrderItemDomain(
            data.id,
            data.orderId,
            data.quantity,
            data.recipeId,
            data.status
        );
    }
}