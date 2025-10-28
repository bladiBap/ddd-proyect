import { OrderItem } from './OrderItem';
import { OrderError } from './OrderError';
import { StatusOrder } from './StatusOrderEnum';

import { AggregateRoot } from 'core/abstractions/AgregateRoot';
import { DomainException } from 'core/results/DomainExeption';

//Eventos
import { OrderCompletedEvent } from './events/OrderCreatedEvent';

export class Order extends AggregateRoot {

    private dateOrdered : Date;
    private dateCreatedOn : Date;
    private status : StatusOrder;
    private listOrderItems : OrderItem[];

    constructor( id: number, dateOrdered: Date, dateCreatedOn: Date, status: StatusOrder, listOrderItems: OrderItem[] = []) {
        super(id);
        this.dateOrdered = dateOrdered;
        this.dateCreatedOn = dateCreatedOn;
        this.status = status;
        this.listOrderItems = listOrderItems;
    }

    public tryMarkCompleted() {
        if (this.status === StatusOrder.COMPLETED) return;

        if (this.status !== StatusOrder.CREATED && this.status !== StatusOrder.COMPLETED) {
            throw new DomainException( 
                OrderError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) 
            );
        }
        if (!this.isItemsCompleted()) {
            return;
        }
        this.status = StatusOrder.COMPLETED;
    }

    public addItem(recipeId: number, quantityPlanned: number, quantityPrepared: number, quantityDelivered: number, status: StatusOrder) : void {
        const newItem = new OrderItem(0, this.id, quantityPlanned, quantityPrepared, quantityDelivered, recipeId, status);
        this.listOrderItems.push(newItem);
    }

    public isItemsCompleted (): boolean {
        return this.listOrderItems.every(item => item.getStatus() === StatusOrder.COMPLETED);
    } 

    public getIdOrder(): number {
        return this.id;
    }

    public getDateOrdered(): Date {
        return this.dateOrdered;
    }

    public getDateCreatedOn(): Date {
        return this.dateCreatedOn;
    }

    public getStatus(): StatusOrder {
        return this.status;
    }

    public getListOrderItems(): ReadonlyArray<OrderItem> {
        return this.listOrderItems;
    }
}