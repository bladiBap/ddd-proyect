import { OrderItemError } from './OrderItemError';
import { StatusOrder } from './StatusOrderEnum';

import { Entity } from '@domain/core/abstractions/Entity';
import { DomainException } from '@domain/core/results/DomainExeption';

export class OrderItem extends Entity{

    private orderId : number;
    private recipeId : number;
    private quantity : number;
    private status : StatusOrder;

    constructor(id: number, orderId: number, quantity: number, recipeId: number, status: StatusOrder) {
        super(id);
        if (quantity <= 0) {
            throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(quantity) );
        }
        this.quantity = quantity;
        this.recipeId = recipeId;
        this.status = status;
        this.orderId = orderId;
    }

    public changeStatusToCompleted() : void {
        if (this.status !== StatusOrder.CREATED) {
            throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
        }
        this.status = StatusOrder.COMPLETED;
    }

    public getRecipeId() : number {
        return this.recipeId;
    }

    public getQuantity() : number {
        return this.quantity;
    }

    public getStatus() : StatusOrder {
        return this.status;
    }

    public getOrderId() : number {
        return this.orderId;
    }
}