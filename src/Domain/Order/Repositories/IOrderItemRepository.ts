import { EntityManager } from 'typeorm';
import { IRepository } from '@common/Core/Abstractions/IRepository';
import { OrderItem } from '../Entities/OrderItem';

export interface IOrderItemRepository extends IRepository<OrderItem> {
    deleteAsync(id: number): Promise<void>;
    updateAsync(entity: OrderItem, em?: EntityManager): Promise<OrderItem>;
}