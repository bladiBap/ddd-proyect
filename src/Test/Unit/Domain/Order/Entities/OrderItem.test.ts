import { OrderItem } from '@domain/Order/Entities/OrderItem';
import { StatusOrder } from '@domain/Order/Types/StatusOrderEnum';
import { DomainException } from '@common/Core/Results/DomainExeption';

describe('OrderItem Entity', () => {
    const createItem = (planned = 10, prepared = 0, status = StatusOrder.CREATED) => 
        new OrderItem(1, 100, planned, prepared, 0, 50, status);

    describe('Constructor', () => {
        it('should throw DomainException if quantityPlanned is 0 or negative', () => {
            expect(() => new OrderItem(1, 100, 0, 0, 0, 50, StatusOrder.CREATED)).toThrow(DomainException);
            expect(() => new OrderItem(1, 100, -1, 0, 0, 50, StatusOrder.CREATED)).toThrow(DomainException);
        });
    });

    describe('increaseQuantityPrepared', () => {
        it('should increase quantityPrepared correctly', () => {
            const item = createItem(10, 2);
            item.increaseQuantityPrepared(3);
            expect(item.getQuantityPrepared()).toBe(5);
        });

        it('should change status to COMPLETED and add domain event when quantityPlanned is reached', () => {
            const item = createItem(10, 8);
            item.increaseQuantityPrepared(2);

            expect(item.getStatus()).toBe(StatusOrder.COMPLETED);
            // Verificamos que se haya registrado el evento de dominio
            expect(item.getDomainEvents()).toHaveLength(1);
            expect(item.getDomainEvents()[0].constructor.name).toBe('OrderItemCompletedEvent');
        });

        it('should throw if amount to increase is 0 or negative', () => {
            const item = createItem(10, 0);
            expect(() => item.increaseQuantityPrepared(0)).toThrow(DomainException);
        });

        it('should throw if new quantity exceeds planned quantity', () => {
            const item = createItem(10, 5);
            expect(() => item.increaseQuantityPrepared(6)).toThrow(DomainException);
        });

        it('should do nothing if already at maximum capacity (prepared === planned)', () => {
            const item = createItem(10, 10);
            item.increaseQuantityPrepared(1);
            expect(item.getQuantityPrepared()).toBe(10);
        });
    });

    describe('Calculated Quantities', () => {
        it('should calculate remaining quantities correctly', () => {
            const item = new OrderItem(1, 100, 10, 6, 2, 50, StatusOrder.CREATED);
            expect(item.remainingQuantityToPrepare()).toBe(4);
            expect(item.remainingQuantityToDeliver()).toBe(4);
        });
    });
});