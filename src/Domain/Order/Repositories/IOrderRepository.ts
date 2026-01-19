import { IRepository } from '@core/Abstractions/IRepository';
import { Order } from '../Entities/Order';

export interface IOrderRepository extends IRepository<Order> {
    deleteAsync(id: number): Promise<void>;
    findByDateAsync(date: Date): Promise<Order | null>;
    updatedAsync( order: Order): Promise<Order>;
    getByIdTodayAsync(id: number, readOnly?: boolean): Promise<Order | null>;
}