import { StatusOrder } from "./StatusOrderEnum";

export class OrderError {

    public static canNotChangeStatus ( currentStatus: StatusOrder, newStatus: StatusOrder ) : Error {
        return new Error(`Cannot change order status from ${currentStatus} to ${newStatus}.`);
    }

    public static listOfOrderItemsCannotBeEmpty(): Error {
        return new Error(`The list of order items cannot be empty.`);
    }

    public static dateCreatedOnMustBeBeforeCurrentDate(dateCreatedOn: Date): Error {
        return new Error(`The creation date (${dateCreatedOn.toISOString()}) must be before the current date.`);
    }

    public static dateCreatedOnMustBeBeforeDateOrdered(dateCreatedOn: Date, dateOrdered: Date): Error {
        return new Error(`The creation date (${dateCreatedOn.toISOString()}) must be before the order date (${dateOrdered.toISOString()}).`);
    }
}