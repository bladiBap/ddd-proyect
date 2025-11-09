import "reflect-metadata";
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { Order } from "@domain/aggregates/order/Order";
import { Order as OrderEntity } from "../PersistenceModel/Entities/Order";

import { OrderMapper } from "../DomainModel/Config/OrderMapper";
import { inject, injectable } from "tsyringe";
import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";

@injectable()
export class OrderRepository implements IOrderRepository {

    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}

    async findByDateAsync(date: Date): Promise<Order[]> {
        const manager = this.emProvider.getManager();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        
        const orders = await manager.createQueryBuilder(OrderEntity, "o")
            .where("o.dateOrdered >= :start AND o.dateOrdered <= :end", { start, end })
            .getMany();
        if (orders.length === 0) {
            return [];
        }
        return OrderMapper.toDomainList(orders);
    }

    async deleteAsync(id: number): Promise<void> {
        const manager = this.emProvider.getManager();
        await manager.getRepository(OrderEntity).delete(id);
        return;
    }

    async getByIdAsync(id: number): Promise<Order | null> {
        const manager = this.emProvider.getManager();
        const orderEntity = await manager.getRepository(OrderEntity).findOne({
            where: { id }
        });
        if (!orderEntity) return null;
        return OrderMapper.toDomain(orderEntity);
    }

    async getByIdTodayAsync(id: number, readOnly: boolean = false): Promise<Order | null> {
        const manager = this.emProvider.getManager();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const orderEntity = await manager.getRepository(OrderEntity).findOne({
            where: { id, dateOrdered: today }
        });
        if (!orderEntity) return null;
        return OrderMapper.toDomain(orderEntity);
    }

    async addAsync(entity: Order): Promise<void> {
        const manager = this.emProvider.getManager();
        const orderEntity = OrderMapper.toPersistence(entity);
        const res = await manager.getRepository(OrderEntity).save(orderEntity);
    }

    async updatedAsync(order: Order): Promise<Order> {
        const manager = this.emProvider.getManager();
        const orderEntity = OrderMapper.toPersistence(order);
        await manager.getRepository(OrderEntity).save(orderEntity);
        return order;
    }
}