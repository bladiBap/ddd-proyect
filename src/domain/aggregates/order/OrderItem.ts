import { OrderItemError } from './OrderItemError';
import { StatusOrder } from './StatusOrderEnum';

import { Entity } from 'core/abstractions/Entity';
import { DomainException } from 'core/results/DomainExeption';

//Eventos
import { OrderItemCompletedEvent } from './events/OrderItemCompletedEvent';
export class OrderItem extends Entity{

    private orderId : number;
    private recipeId : number;
    private quantityPlanned : number;
    private quantityPrepared : number;
    private quantityDelivered : number;
    private status : StatusOrder;

    constructor(id: number, orderId: number, quantityPlanned: number, quantityPrepared: number, quantityDelivered: number, recipeId: number, status: StatusOrder) {
        super(id);
        if (quantityPlanned <= 0) {
            throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(quantityPlanned) );
        }
        this.quantityPlanned = quantityPlanned;
        this.quantityPrepared = quantityPrepared;
        this.quantityDelivered = quantityDelivered;
        this.recipeId = recipeId;
        this.status = status;
        this.orderId = orderId;
    }

    private changeStatusToCompleted() : void {
        if (this.status === StatusOrder.COMPLETED) return;
        
        if (this.status !== StatusOrder.CREATED && this.status !== StatusOrder.COMPLETED) {
            throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
        }

        this.status = StatusOrder.COMPLETED;
        this.addDomainEvent(new OrderItemCompletedEvent(this.orderId));
    }

    public increaseQuantityPrepared(amount: number) : void {
        
        if (this.quantityPlanned === this.quantityPrepared) {
            return;
        }

        if (amount <= 0) {
            throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(amount) );
        }

        const newQuantityPrepared = this.quantityPrepared + amount;
        if (newQuantityPrepared > this.quantityPlanned) {
            throw new DomainException( OrderItemError.quantityPreparedExceedsPlanned(newQuantityPrepared, this.quantityPlanned) );
        }

        if (newQuantityPrepared === this.quantityPlanned) {
            this.changeStatusToCompleted()
        };

        this.quantityPrepared = newQuantityPrepared;
    }

    public updateQuantityDelivered(newQuantityDelivered: number) : void {
        if (newQuantityDelivered > this.quantityPrepared) {
            throw new DomainException( OrderItemError.quantityPreparedExceedsPlanned(newQuantityDelivered, this.quantityPrepared) );
        }
        this.quantityDelivered = newQuantityDelivered;
    }

    public remainingQuantityToPrepare() : number {
        return this.quantityPlanned - this.quantityPrepared;
    }

    public remainingQuantityToDeliver() : number {
        return this.quantityPrepared - this.quantityDelivered;
    }

    public getRecipeId() : number {
        return this.recipeId;
    }

    public getStatus() : StatusOrder {
        return this.status;
    }

    public getOrderId() : number {
        return this.orderId;
    }

    public getQuantityPrepared() : number {
        return this.quantityPrepared;
    }

    public getQuantityDelivered() : number {
        return this.quantityDelivered;
    }

    public getQuantityPlanned() : number {
        return this.quantityPlanned;
    }
}