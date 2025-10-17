import { Order as OrderDomain } from '@domain/Order/Order';
import { Order as OrderEntity } from '@infrastructure/Persistence/PersistenceModel/Entities/Order'; 

export class OrderMapper {

    toPersistence(order: OrderDomain): OrderEntity {
        // return {
        //     id: order.getId(),
        //     customerId: order.customerId,
        //     total: order.total,
        //     items: order.items.map(item => ({
        //         productId: item.productId,
        //         quantity: item.quantity
        //     }))
        // };
    }

    toDomain(data: OrderEntity): OrderDomain {
        // return new Order(
        //     data.id,
        //     data.customerId,
        //     data.total,
        //     data.items.map(item => ({
        //         productId: item.productId,
        //         quantity: item.quantity
        //     }))
        // );
    }
}