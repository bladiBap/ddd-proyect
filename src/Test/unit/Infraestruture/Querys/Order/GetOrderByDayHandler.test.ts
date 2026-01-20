import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { GetOrderByDayHandler } from '@infrastructure/Querys/Order/GetOrderByDayHandler';
import { GetOrderByDay } from '@application/Order/Queries/GetOrderByDayQuery';
import { Order } from '@infrastructure/Persistence/PersistenceModel/Entities/Order';
import { OrderDTOMapper } from '@application/Order/Queries/Mappers/OrderDTOMapper';
import { DateUtils } from '@/Common/Utils/Date';
import { OrderDTO } from '@application/Order/Dto/OrderDTO';

// Mockear utilidades y mappers
jest.mock('@common/Utils/Date');
jest.mock('@application/Order/Queries/Mappers/OrderDTOMapper');

describe('GetOrderDetailsHandler', () => {
    let handler: GetOrderByDayHandler;
    let mockDataSource: jest.Mocked<DataSource>;
    let mockOrderRepository: jest.Mocked<Repository<Order>>;
    
    const mockDate = new Date('2026-01-20');
    const mockFormattedDate = '2026-01-20';

    beforeEach(() => {
        jest.clearAllMocks();

        mockOrderRepository = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<Order>>;

        mockDataSource = {
            getRepository: jest.fn().mockReturnValue(mockOrderRepository),
        } as unknown as jest.Mocked<DataSource>;

        (DateUtils.formatDate as jest.Mock).mockReturnValue(mockFormattedDate);

        handler = new GetOrderByDayHandler(mockDataSource);
    });

    describe('execute', () => {
        it('should return OrderDTO when order is found (Happy Path)', async () => {
            // Arrange
            const mockQuery = new GetOrderByDay(mockDate);
            const mockOrderEntity = { id: 1, dateOrdered: mockFormattedDate } as unknown as Order;
            const mockDTO = { id: 1, items: [] } as unknown as OrderDTO;

            mockOrderRepository.findOne.mockResolvedValue(mockOrderEntity);
            (OrderDTOMapper.toDTO as jest.Mock).mockReturnValue(mockDTO);

            // Act
            const result = await handler.execute(mockQuery);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockDTO);
            
            expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
                where: { dateOrdered: mockFormattedDate },
                relations: [
                    'orderItems',
                    'orderItems.recipe',
                    'orderItems.recipe.ingredients',
                    'orderItems.recipe.ingredients.ingredient',
                    'orderItems.recipe.ingredients.ingredient.measurementUnit'
                ]
            });
            expect(OrderDTOMapper.toDTO).toHaveBeenCalledWith(mockOrderEntity);
        });

        it('should return an empty object (as OrderDTO) when order is not found', async () => {
            // Arrange
            const mockQuery = new GetOrderByDay(mockDate);
            mockOrderRepository.findOne.mockResolvedValue(null);

            // Act
            const result = await handler.execute(mockQuery);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual({});
            expect(OrderDTOMapper.toDTO).not.toHaveBeenCalled();
        });

        it('should throw error if repository findOne fails', async () => {
            // Arrange
            const mockQuery = new GetOrderByDay(mockDate);
            mockOrderRepository.findOne.mockRejectedValue(new Error('DB Error'));

            // Act & Assert
            await expect(handler.execute(mockQuery)).rejects.toThrow('DB Error');
        });
    });
});