import { Entity } from '../shared/abstractions/Entity';
import { DomainException } from '../shared/results/DomainExeption';
import { OrderItemError } from './OrderItemError';
import { Recipe } from '../Recipe/Recipe';
import { StatusOrder } from '../Order/StatusOrderEnum';

export class OrderItem extends Entity{

    private quantity : number;
    private recipe : Recipe;
    private status : StatusOrder;

    constructor(id: number, quantity: number, recipe: Recipe, status: StatusOrder) {
        super(id);
        if (quantity <= 0) {
            throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(quantity) );
        }
        this.quantity = quantity;
        this.recipe = recipe;
        this.status = status;
    }

    public getRecipe() : Recipe {
        return this.recipe;
    }

    public getQuantity() : number {
        return this.quantity;
    }

    public getStatus() : StatusOrder {
        return this.status;
    }

    public changeStatusToInProgress() : void {
        if (this.status !== StatusOrder.PENDING) {
            throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.IN_PROGRESS) );
        }
        this.status = StatusOrder.IN_PROGRESS;
    }

    public changeStatusToCompleted() : void {
        if (this.status !== StatusOrder.IN_PROGRESS) {
            throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
        }
        this.status = StatusOrder.COMPLETED;
    }

    public setCantidad(quantity: number) : void {
        if (quantity <= 0) {
            throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(quantity) );
        }
        this.quantity = quantity;
    }
}