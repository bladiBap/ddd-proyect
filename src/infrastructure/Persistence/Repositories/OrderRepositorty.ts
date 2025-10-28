import "reflect-metadata";
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { Order } from "@domain/aggregates/order/Order";
import { Order as OrderEntity } from "../PersistenceModel/Entities/Order";
import { OrderItem } from "../PersistenceModel/Entities/OrderItem";

import { AppDataSource } from "../PersistenceModel/data-source";
import { OrderMapper } from "../DomainModel/Config/OrderMapper";
import { DataSource, EntityManager } from "typeorm";
import { inject, injectable } from "tsyringe";

@injectable()
export class OrderRepository implements IOrderRepository {

    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {}
        
    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    async findByDateAsync(date: Date): Promise<Order[]> {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const orders = await this.getManager().createQueryBuilder(OrderEntity, "o")
            .where("o.dateOrdered >= :start AND o.dateOrdered <= :end", { start, end })
            .getMany();
        if (orders.length === 0) {
            return [];
        }
        return OrderMapper.toDomainList(orders);
    }
    
    async deleteAsync(id: number, em?: EntityManager): Promise<void> {
        const manager = em || this.getManager();
        await manager.getRepository(OrderEntity).delete(id);
        return;
    }

    async getByIdAsync(id: number): Promise<Order | null> {
        const orderEntity = await this.getManager().getRepository(OrderEntity).findOne({
            where: { id }
        });
        if (!orderEntity) return null;
        return OrderMapper.toDomain(orderEntity);
    }

    async addAsync(entity: Order, em?: EntityManager): Promise<void> {
        const manager = em || this.getManager();
        const orderEntity = OrderMapper.toPersistence(entity);
        const res = await manager.getRepository(OrderEntity).save(orderEntity);
    }
}