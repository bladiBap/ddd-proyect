import { IOrderItemRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { OrderItem } from "../PersistenceModel/Entities/OrderItem";

import { AppDataSource } from "../PersistenceModel/data-source";
import { OrderItemMapper } from "../DomainModel/Config/OrderItemMapper";
import { OrderItem as DomainOrderItem } from "@domain/aggregates/order/OrderItem";

import { IEntityManagerProvider } from "@core/abstractions/IEntityManagerProvider";
import { DomainEventsCollector } from "@application/DomainEventsCollector";
import { inject, injectable } from "tsyringe";
import { DataSource, EntityManager } from "typeorm";

@injectable()
export class OrderItemRepository implements IOrderItemRepository {

    constructor(
        @inject("IEntityManagerProvider") private readonly emProvider: IEntityManagerProvider
    ) {}

    async deleteAsync(id: number): Promise<void> {
        const manager = this.emProvider.getManager();
        await manager.getRepository(OrderItem).delete(id);
        return;
    }

    async getByIdAsync(id: number, readOnly = true): Promise<DomainOrderItem | null> {
        const manager = this.emProvider.getManager();
        const item = await manager.getRepository(OrderItem).findOne({
            where: { id },
            relations: ["order"],
        });

        if (!item) return null;

        const domainItem = OrderItemMapper.toDomain(item);
        return domainItem;
    }

    async addAsync(entity: DomainOrderItem): Promise<void> {
        const manager = this.emProvider.getManager();
        const itemEntity = OrderItemMapper.toPersistence(entity);
        await manager.getRepository(OrderItem).save(itemEntity);
    }

    async updateAsync(entity: DomainOrderItem): Promise<DomainOrderItem> {
        const manager = this.emProvider.getManager();
        const itemEntity = OrderItemMapper.toPersistence(entity);
        const updatedItem = await manager.getRepository(OrderItem).save(itemEntity);
        DomainEventsCollector.collect(entity.getDomainEvents());
        return OrderItemMapper.toDomain(updatedItem);
    }
}