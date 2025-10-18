import { OrderItem } from './OrderItem';
import { OrderError } from './OrderError';
import { StatusOrder } from './StatusOrderEnum';

import { AggregateRoot } from '@domain/core/abstractions/AgregateRoot';
import { DomainException } from '@domain/core/results/DomainExeption';

//Eventos
import { OrderCompletedEvent } from './events/OrderCreatedEvent';

export class Order extends AggregateRoot {

    private dateOrdered : Date;
    private dateCreatedOn : Date;
    private status : StatusOrder;
    private listOrderItems : OrderItem[];

    constructor( id: number, dateOrdered: Date, dateCreatedOn: Date, status: StatusOrder, listOrderItems: OrderItem[] = []) {
        super(id);

        if (dateCreatedOn > dateOrdered) {
            throw new DomainException( OrderError.dateCreatedOnMustBeBeforeDateOrdered(dateCreatedOn, dateOrdered) );
        }
        if (dateCreatedOn > new Date()) {
            throw new DomainException( OrderError.dateCreatedOnMustBeBeforeCurrentDate(dateCreatedOn) );
        }

        this.dateOrdered = dateOrdered;
        this.dateCreatedOn = dateCreatedOn;
        this.status = status;
        this.listOrderItems = listOrderItems;
    }

    public updateStatusToCompleted() {
        if (this.status !== StatusOrder.CREATED) {
            throw new DomainException( 
                OrderError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) 
            );
        }
        this.status = StatusOrder.COMPLETED;
        this.addDomainEvent(new OrderCompletedEvent(this.id));
    }

    public addItem(recipeId: number, quantity: number, status: StatusOrder) : void {
        const newItem = new OrderItem(0, this.id, quantity, recipeId, status);
        this.listOrderItems.push(newItem);
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