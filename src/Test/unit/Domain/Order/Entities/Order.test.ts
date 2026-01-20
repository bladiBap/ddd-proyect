import { Order } from '@domain/Order/Entities/Order';
import { OrderItem } from '@domain/Order/Entities/OrderItem';
import { StatusOrder } from '@domain/Order/Types/StatusOrderEnum';
import { DomainException } from '@common/Core/Results/DomainExeption';

describe('Order Aggregate Root', () => {
    let order: Order;
    const now = new Date();

    beforeEach(() => {
        order = new Order(1, now, now, StatusOrder.CREATED, []);
    });

    describe('addItem', () => {
        it('should add a new OrderItem to the list', () => {
            order.addItem(50, 10, 0, 0, StatusOrder.CREATED);
            expect(order.getListOrderItems()).toHaveLength(1);
            expect(order.getListOrderItems()[0].getRecipeId()).toBe(50);
        });
    });

    describe('changeToCompleted', () => {
        it('should throw if order is already COMPLETED', () => {
            const completedOrder = new Order(1, now, now, StatusOrder.COMPLETED, []);
            expect(() => completedOrder.changeToCompleted()).toThrow(DomainException);
        });

        it('should throw if some items are NOT COMPLETED', () => {
            // Un item cmpletado y otro creado
            const item1 = new OrderItem(1, 1, 10, 10, 0, 50, StatusOrder.COMPLETED);
            const item2 = new OrderItem(2, 1, 10, 0, 0, 51, StatusOrder.CREATED);
            
            const myOrder = new Order(1, now, now, StatusOrder.CREATED, [item1, item2]);
            
            expect(() => myOrder.changeToCompleted()).toThrow(DomainException);
        });

        it('should successfully change status to COMPLETED if all items are COMPLETED', () => {
            const item1 = new OrderItem(1, 1, 10, 10, 0, 50, StatusOrder.COMPLETED);
            const myOrder = new Order(1, now, now, StatusOrder.CREATED, [item1]);

            myOrder.changeToCompleted();

            expect(myOrder.getStatus()).toBe(StatusOrder.COMPLETED);
            expect(myOrder.isStatusCompleted()).toBe(true);
        });

        it('should successfully change status if order has no items (edge case)', () => {
            order.changeToCompleted();
            expect(order.getStatus()).toBe(StatusOrder.COMPLETED);
        });
    });
});