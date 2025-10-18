import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { Order } from "@domain/aggregates/order/Order";

export class OrderRepository implements IOrderRepository {
    
    deleteAsync(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getByIdAsync(id: number, readOnly?: boolean): Promise<Order | null> {
        throw new Error("Method not implemented.");
    }
    addAsync(entity: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
}