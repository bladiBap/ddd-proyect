import { IRepository } from "../shared/abstractions/IRepository";
import { Order } from './Order';

export interface IOrderRepository extends IRepository<Order> {
    getRecipientsByIdAsync(id: string, readOnly?: boolean): Promise<Order | null>;
}