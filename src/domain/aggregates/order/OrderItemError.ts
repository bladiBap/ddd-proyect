import { StatusOrder } from "./StatusOrderEnum";

export class OrderItemError {

    public static quantityMustBeGreaterThanZero(cantidad: number): Error {
        return new Error(`Quantity must be greater than zero. Given: ${cantidad}.`);
    }

    public static canNotChangeStatus ( currentStatus: StatusOrder, newStatus: StatusOrder ) : Error {
        return new Error(`Cannot change order status from ${currentStatus} to ${newStatus}.`);
    }

    public static quantityPreparedExceedsPlanned( quantityPrepared: number, quantityPlanned: number ) : Error {
        return new Error(`The prepared quantity (${quantityPrepared}) exceeds the planned quantity (${quantityPlanned}).`);
    }
}