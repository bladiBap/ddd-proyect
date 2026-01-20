import { AllocationLine } from '@domain/DailyAllocation/Entities/AllocationLine';
import { AllocationLineError } from '@domain/DailyAllocation/Errors/AllocationLineError';

describe('AllocationLine', () => {
    const validParams = {
        id: 1,
        allocationId: 10,
        clientId: 101,
        recipeId: 5,
        quantityNeeded: 10,
        quantityPackaged: 0
    };

    describe('Constructor & Invariants', () => {
        it('should create a valid AllocationLine instance', () => {
            const line = new AllocationLine(
                validParams.id,
                validParams.allocationId,
                validParams.clientId,
                validParams.recipeId,
                validParams.quantityNeeded,
                5
            );

            expect(line.getId()).toBe(validParams.id);
            expect(line.getQuantityNeeded()).toBe(10);
            expect(line.getQuantityPackaged()).toBe(5);
        });

        it('should throw AllocationLineError if quantityNeeded is zero or negative', () => {
            expect(() => {
                new AllocationLine(1, 10, 101, 5, 0); // zero
            }).toThrow(AllocationLineError.quantityNeededMustBeGreaterThanZero(0));

            expect(() => {
                new AllocationLine(1, 10, 101, 5, -5); // negative
            }).toThrow(AllocationLineError.quantityNeededMustBeGreaterThanZero(-5));
        });

        it('should throw AllocationLineError if initial quantityPackaged exceeds quantityNeeded', () => {
            expect(() => {
                new AllocationLine(1, 10, 101, 5, 10, 15); // 15 > 10
            }).toThrow(AllocationLineError.quantityPackagedExceedsNeeded(15, 10));
        });

        it('should default quantityPackaged to 0 if not provided', () => {
            const line = new AllocationLine(1, 10, 101, 5, 10);
            expect(line.getQuantityPackaged()).toBe(0);
        });
    });

    describe('Business Logic Methods', () => {
        let line: AllocationLine;

        beforeEach(() => {
            line = new AllocationLine(1, 10, 101, 5, 10, 2);
        });

        it('should return correct remaining quantity to package', () => {

            expect(line.remainingQuantityToPackage()).toBe(8);
        });

        it('should update quantity packaged successfully when value is valid', () => {
            line.updateQuantityPackaged(7);
            expect(line.getQuantityPackaged()).toBe(7);
            expect(line.remainingQuantityToPackage()).toBe(3);
        });

        it('should throw error when updating quantity packaged with a value greater than needed', () => {
            expect(() => {
                line.updateQuantityPackaged(11);
            }).toThrow(AllocationLineError.quantityPackagedExceedsNeeded(11, 10));
            
            expect(line.getQuantityPackaged()).toBe(2);
        });

        it('should allow setting packaged quantity equal to needed quantity', () => {
            expect(() => {
                line.updateQuantityPackaged(10);
            }).not.toThrow();
            expect(line.remainingQuantityToPackage()).toBe(0);
        });
    });

    describe('Getters', () => {
        it('should return all basic properties', () => {
            const line = new AllocationLine(1, 2, 3, 4, 10, 5);
            expect(line.getAllocationId()).toBe(2);
            expect(line.getClientId()).toBe(3);
            expect(line.getRecipeId()).toBe(4);
        });
    });
});