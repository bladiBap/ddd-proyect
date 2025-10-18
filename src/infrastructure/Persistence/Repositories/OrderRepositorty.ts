import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { Order } from "@domain/aggregates/order/Order";
import { Order as OrderEntity } from "../PersistenceModel/Entities/Order";

import { AppDataSource } from "../PersistenceModel/data-source";
import { OrderMapper } from "../DomainModel/Config/OrderMapper";
export class OrderRepository implements IOrderRepository {

    private readonly repo = AppDataSource.getRepository(OrderEntity);

    async findByDateAsync(date: Date): Promise<Order[]> {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const orders = await this.repo.createQueryBuilder("o")
            .where("o.dateOrdered >= :start AND o.dateOrdered <= :end", { start, end })
            .getMany();
        if (orders.length === 0) {
            return [];
        }
        return OrderMapper.toDomainList(orders);
    }
    
    async deleteAsync(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async getByIdAsync(id: number, readOnly?: boolean): Promise<Order | null> {
        const orderEntity = await this.repo.findOne({ where: { id } });
        if (!orderEntity) return null;
        return OrderMapper.toDomain(orderEntity);
    }

    async addAsync(entity: Order): Promise<void> {
        const orderEntity = OrderMapper.toPersistence(entity);
        const res = await this.repo.save(orderEntity);
    }
}