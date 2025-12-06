import "reflect-metadata";
import { DateUtils } from "@utils/Date";
import { IOrderRepository } from "@domain/Order/Repositories/IOrderRepository";
import { Order } from "@domain/Order/Entities/Order";
import { Order as OrderEntity } from "../PersistenceModel/Entities/Order";

import { OrderMapper } from "../DomainModel/Config/OrderMapper";
import { inject, injectable } from "tsyringe";
import { IEntityManagerProvider } from "@core/Abstractions/IEntityManagerProvider";

@injectable()
export class OrderRepository implements IOrderRepository {

    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}

    async findByDateAsync(date: Date): Promise<Order[]> {
        const manager = this.emProvider.getManager();
        const formattedDate = DateUtils.formatDate(date);
        
        const orders = await manager.getRepository(OrderEntity).find({
            where: { dateOrdered: formattedDate }
        });
        
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
        const today = DateUtils.formatDate(new Date());

        const orderEntity = await manager.getRepository(OrderEntity).findOne({
            where: { id, dateOrdered: today }
        });

        if (!orderEntity) return null;
        return OrderMapper.toDomain(orderEntity);
    }

    async addAsync(entity: Order): Promise<void> {
        const manager = this.emProvider.getManager();
        const orderEntity = OrderMapper.toPersistence(entity);
        await manager.getRepository(OrderEntity).save(orderEntity);
    }

    async updatedAsync(order: Order): Promise<Order> {
        const manager = this.emProvider.getManager();
        const orderEntity = OrderMapper.toPersistence(order);
        await manager.getRepository(OrderEntity).save(orderEntity);
        return order;
    }
}