import { OrderItem } from './OrderItem';
import { OrderError } from '../Errors/OrderError';
import { StatusOrder } from '../Types/StatusOrderEnum';

import { AggregateRoot } from '@core/Abstractions/AgregateRoot';
import { DomainException } from '@core/Results/DomainExeption';

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

    public changeToCompleted() {
        if (this.status === StatusOrder.COMPLETED){
            throw new DomainException( OrderError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
        }
        
        if (!this.verifyIfAllItemsCompleted()) {
            throw new DomainException( OrderError.orderItemsNotCompleted(this.id) );
        }
        this.status = StatusOrder.COMPLETED;
    }

    public addItem(recipeId: number, quantityPlanned: number, quantityPrepared: number, quantityDelivered: number, status: StatusOrder) : void {
        const newItem = new OrderItem(0, this.id, quantityPlanned, quantityPrepared, quantityDelivered, recipeId, status);
        this.listOrderItems.push(newItem);
    }

    private verifyIfAllItemsCompleted (): boolean {
        return this.listOrderItems.every(item => item.getStatus() === StatusOrder.COMPLETED);
    }
    
    public isStatusCompleted (): boolean{
        return this.status === StatusOrder.COMPLETED;
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