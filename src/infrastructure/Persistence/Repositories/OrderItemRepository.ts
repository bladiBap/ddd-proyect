import { IOrderItemRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { OrderItem } from "../PersistenceModel/Entities/OrderItem";

import { AppDataSource } from "../PersistenceModel/data-source";
import { OrderItemMapper } from "../DomainModel/Config/OrderItemMapper";
import { OrderItem as DomainOrderItem } from "@domain/aggregates/order/OrderItem";

import { DomainEventsCollector } from "@application/DomainEventsCollector";

export class OrderItemRepository implements IOrderItemRepository {
    private readonly repo = AppDataSource.getRepository(OrderItem);

    private getManager(): EntityManager {
        return this.dataSource.manager;
    }

    async deleteAsync(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async getByIdAsync(id: number, readOnly = true): Promise<DomainOrderItem | null> {
        const item = await this.repo.findOne({
            where: { id },
            relations: ["order"],
        });

        if (!item) return null;

        const domainItem = OrderItemMapper.toDomain(item);
        return domainItem;
    }

    async addAsync(entity: DomainOrderItem): Promise<void> {
        const itemEntity = OrderItemMapper.toPersistence(entity);
        await this.repo.save(itemEntity);
    }

    async updateAsync(entity: DomainOrderItem): Promise<DomainOrderItem> {
        const itemEntity = OrderItemMapper.toPersistence(entity);
        const updatedItem = await this.repo.save(itemEntity);
        DomainEventsCollector.collect(entity.getDomainEvents());
        return OrderItemMapper.toDomain(updatedItem);
    }
}