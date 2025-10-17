import { OrderItem } from '../OrderItem/OrderItem';
import { Recipe } from '../Recipe/Recipe';
import { AggregateRoot } from '../shared/abstractions/AgregateRoot';
import { DomainException } from '../shared/results/DomainExeption';
import { OrderError } from './OrderError';
import { StatusOrder } from './StatusOrderEnum';

export class Order extends AggregateRoot {

    private dateOrdered : Date;
    private dateCreatedOn : Date;
    private status : StatusOrder;
    private listOrderItems : OrderItem[];

    constructor(id: number, dateOrdered: Date, dateCreatedOn: Date, status: StatusOrder, listOrderItems: OrderItem[] = []) {
        super(id);

        // if (listOrderItems.length === 0) {
        //     throw new DomainException( OrderError.listOfOrderItemsCannotBeEmpty() );
        // }

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

    public generate()    {
        
    }

    public viewRecipes(): ReadonlyArray<Recipe> {
        const recipes: Recipe[] = this.listOrderItems.map(item => item.getRecipe());
        return recipes;
    }

    public updateStatusToInProgress() {
        if (this.status !== StatusOrder.PENDING) {
            throw new DomainException( 
                OrderError.canNotChangeStatus(this.status, StatusOrder.IN_PROGRESS) 
            );
        }
        this.status = StatusOrder.IN_PROGRESS;
    }

    public updateStatusToCompleted() {
        if (this.status !== StatusOrder.IN_PROGRESS) {
            throw new DomainException( 
                OrderError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) 
            );
        }
        this.status = StatusOrder.COMPLETED;
    }

    public get idOrder(): number {
        return this.id;
    }

    public get orderDateOrdered(): Date {
        return this.dateOrdered;
    }

    public get orderDateCreatedOn(): Date {
        return this.dateCreatedOn;
    }

    public get orderStatus(): StatusOrder {
        return this.status;
    }

    public get orderListOrderItems(): ReadonlyArray<OrderItem> {
        return this.listOrderItems;
    }
}