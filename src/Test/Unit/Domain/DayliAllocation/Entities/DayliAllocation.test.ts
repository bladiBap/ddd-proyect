import { DailyAllocation } from '@domain/DailyAllocation/Entities/DailyAllocation';
import { AllocationLine } from '@domain/DailyAllocation/Entities/AllocationLine';

jest.mock('@domain/DailyAllocation/Entities/AllocationLine');

describe('DailyAllocation', () => {
    let dailyAllocation: DailyAllocation;
    const mockDate = new Date('2026-01-20');
    const allocationId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
        dailyAllocation = new DailyAllocation(allocationId, mockDate);
    });

    describe('Constructor & Getters', () => {
        it('should initialize with provided values', () => {
            expect(dailyAllocation.getId()).toBe(allocationId);
            expect(dailyAllocation.getDate()).toBe(mockDate);
            expect(dailyAllocation.getLines()).toEqual([]);
        });
    });

    describe('addLine', () => {
        it('should add a new line to the collection', () => {
            const mockLine = { getClientId: () => 101 } as AllocationLine;
            
            dailyAllocation.addLine(mockLine);
            
            expect(dailyAllocation.getLines()).toHaveLength(1);
            expect(dailyAllocation.getLines()[0]).toBe(mockLine);
        });
    });

    describe('clientHasAllRecipes', () => {
        const clientId = 101;

        const createMockLine = (cId: number, rId: number) => ({
            getClientId: () => cId,
            getRecipeId: () => rId
        } as AllocationLine);

        it('should return true when the client has all requested recipes', () => {
            // Arrange
            dailyAllocation.addLine(createMockLine(clientId, 1));
            dailyAllocation.addLine(createMockLine(clientId, 2));
            dailyAllocation.addLine(createMockLine(999, 3));

            // Act
            const hasAll = dailyAllocation.clientHasAllRecipes(clientId, [1, 2]);

            // Assert
            expect(hasAll).toBe(true);
        });

        it('should return false when the client is missing at least one recipe', () => {
            // Arrange
            dailyAllocation.addLine(createMockLine(clientId, 1));

            // Act
            const hasAll = dailyAllocation.clientHasAllRecipes(clientId, [1, 2]);

            // Assert
            expect(hasAll).toBe(false);
        });

        it('should return false when the client has no lines at all', () => {
            // Act
            const hasAll = dailyAllocation.clientHasAllRecipes(clientId, [1]);

            // Assert
            expect(hasAll).toBe(false);
        });

        it('should return true if the required recipes list is empty (edge case)', () => {
            // Act
            const hasAll = dailyAllocation.clientHasAllRecipes(clientId, []);

            // Assert
            expect(hasAll).toBe(true);
        });

        it('should ignore recipes that belong to other clients', () => {
            // Arrange
            dailyAllocation.addLine(createMockLine(202, 1));
            
            // Act
            const hasAll = dailyAllocation.clientHasAllRecipes(clientId, [1]);

            // Assert
            expect(hasAll).toBe(false);
        });
    });
});