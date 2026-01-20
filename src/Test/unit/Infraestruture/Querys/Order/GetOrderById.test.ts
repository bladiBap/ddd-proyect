import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { GetOrderByIdHandler } from '@infrastructure/Querys/Order/GetOrderByIdHandler';
import { GetOrderById } from '@application/Order/Queries/GetOrderByIdQuery';
import { Order } from '@infrastructure/Persistence/PersistenceModel/Entities/Order';
import { OrderDTOMapper } from '@application/Order/Queries/Mappers/OrderDTOMapper';
import { OrderDTO } from '@application/Order/Dto/OrderDTO';

// Mock del Mapper
jest.mock('@application/Order/Queries/Mappers/OrderDTOMapper');

describe('GetOrderByIdHandler', () => {
    let handler: GetOrderByIdHandler;
    let mockDataSource: jest.Mocked<DataSource>;
    let mockOrderRepository: jest.Mocked<Repository<Order>>;

    const orderId = 123;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock del repositorio
        mockOrderRepository = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<Order>>;

        // Mock del DataSource
        mockDataSource = {
            getRepository: jest.fn().mockReturnValue(mockOrderRepository),
        } as unknown as jest.Mocked<DataSource>;

        handler = new GetOrderByIdHandler(mockDataSource);
    });

    describe('execute', () => {
        it('should return OrderDTO when an order is found by ID (Happy Path)', async () => {
            // Arrange
            const query = new GetOrderById(orderId);
            const mockOrderEntity = { id: orderId, orderItems: [] } as unknown as Order;
            const mockOrderDTO = { id: orderId, items: [] } as unknown as OrderDTO;

            mockOrderRepository.findOne.mockResolvedValue(mockOrderEntity);
            (OrderDTOMapper.toDTO as jest.Mock).mockReturnValue(mockOrderDTO);

            // Act
            const result = await handler.execute(query);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockOrderDTO);

            // Verificar que la consulta se hizo con el ID correcto y todas las relaciones
            expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
                where: { id: orderId },
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

        it('should return an empty object as OrderDTO when the order is not found', async () => {
            // Arrange
            const query = new GetOrderById(orderId);
            mockOrderRepository.findOne.mockResolvedValue(null);

            // Act
            const result = await handler.execute(query);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual({}); // Verifica el retorno de {} as OrderDTO
            expect(OrderDTOMapper.toDTO).not.toHaveBeenCalled();
        });

        it('should throw an error if the repository fails', async () => {
            // Arrange
            const query = new GetOrderById(orderId);
            mockOrderRepository.findOne.mockRejectedValue(new Error('Database Error'));

            // Act & Assert
            await expect(handler.execute(query)).rejects.toThrow('Database Error');
        });
    });
});