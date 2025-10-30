import { EntityManager } from "typeorm";
import { IRepository } from "core/abstractions/IRepository";
import { OrderItem } from './OrderItem';

export interface IOrderItemRepository extends IRepository<OrderItem> {
    deleteAsync(id: number): Promise<void>;
    updateAsync(entity: OrderItem, em?: EntityManager): Promise<OrderItem>;
}