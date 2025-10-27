import { IOrderItemRepository as IRecipeRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { OrderItem } from "../PersistenceModel/Entities/OrderItem";

import { AppDataSource } from "../PersistenceModel/data-source";
import { OrderItemMapper } from "../DomainModel/Config/OrderItemMapper";
import { OrderItem as DomainOrderItem } from "@domain/aggregates/order/OrderItem";
import { In } from "typeorm";

export class RecipeRepository implements IRecipeRepository {
    
    private readonly repo = AppDataSource.getRepository(OrderItem);

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

    async getByIdsAsync(ids: number[], readOnly = true): Promise<DomainOrderItem[]> {
        const items = await this.repo.findBy({ id: In(ids) });
        const domainItems = items.map(OrderItemMapper.toDomain);
        return domainItems;
    }

    async addAsync(entity: DomainOrderItem): Promise<void> {
        const itemEntity = OrderItemMapper.toPersistence(entity);
        await this.repo.save(itemEntity);
    }

    async updateAsync(entity: DomainOrderItem): Promise<void> {
        const itemEntity = OrderItemMapper.toPersistence(entity);
        await this.repo.save(itemEntity);
    }
}