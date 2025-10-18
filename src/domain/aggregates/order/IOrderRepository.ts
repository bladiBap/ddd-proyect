import { IRepository } from "@domain/core/abstractions/IRepository";
import { Order } from './Order';
import { OrderItem } from "./OrderItem";

export interface IOrderRepository extends IRepository<Order> {
    deleteAsync(id: number): Promise<void>;
    findByDateAsync(date: Date): Promise<Order[]>;
}