import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { GetClientsForDeliveredHandler } from '@infrastructure/Querys/Client/GetClientsForDeliveredHandler';
import { GetClientsForDelivered } from '@application/Client/GetClientsForDelivery/GetClientsForDelivered';
import { Address } from '@infrastructure/Persistence/PersistenceModel/Entities/Address';
import { ClientDeliveredDTOMapper } from '@application/Client/GetClientsForDelivery/ClientDeliveredDTOMapper';
import { DateUtils } from '@/Common/Utils/Date';

jest.mock('@common/Utils/Date');
jest.mock('@application/Client/GetClientsForDelivery/ClientDeliveredDTOMapper');

describe('GetClientsForDeliveredHandler', () => {
    let handler: GetClientsForDeliveredHandler;
    let mockDataSource: jest.Mocked<DataSource>;
    let mockAddressRepository: jest.Mocked<Repository<Address>>;
    let mockRequest: GetClientsForDelivered;

    const mockDate = new Date('2026-01-20');
    const mockFormattedDate = '2026-01-20';

    beforeEach(() => {
        jest.clearAllMocks();

        // Crear mock del repositorio
        mockAddressRepository = {
            find: jest.fn(),
        } as unknown as jest.Mocked<Repository<Address>>;

        // Crear mock del DataSource
        mockDataSource = {
            getRepository: jest.fn().mockReturnValue(mockAddressRepository),
        } as unknown as jest.Mocked<DataSource>;

        // Setup de DateUtils
        (DateUtils.formatDate as jest.Mock).mockReturnValue(mockFormattedDate);

        mockRequest = new GetClientsForDelivered(mockDate);

        handler = new GetClientsForDeliveredHandler(mockDataSource);
    });

    describe('execute', () => {
        it('should return a list of delivered clients successfully (Happy Path)', async () => {
            // Arrange
            const mockAddresses = [
                { id: 1, date: mockFormattedDate, calendar: {} },
                { id: 2, date: mockFormattedDate, calendar: {} }
            ] as unknown as Address[];

            const mockDTOs = [
                { clientId: 1, clientName: 'John Doe' },
                { clientId: 2, clientName: 'Jane Doe' }
            ];

            mockAddressRepository.find.mockResolvedValue(mockAddresses);
            (ClientDeliveredDTOMapper.toDTO as jest.Mock).mockReturnValue(mockDTOs);

            // Act
            const result = await handler.execute(mockRequest);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockDTOs);

            expect(mockDataSource.getRepository).toHaveBeenCalledWith(Address);
            expect(mockAddressRepository.find).toHaveBeenCalledWith({
                where: { date: mockFormattedDate },
                relations: [
                    'calendar',
                    'calendar.mealPlan',
                    'calendar.mealPlan.client',
                    'calendar.mealPlan.dayliDiets',
                    'calendar.mealPlan.dayliDiets.recipes'
                ]
            });

            expect(ClientDeliveredDTOMapper.toDTO).toHaveBeenCalledWith(mockAddresses);
        });

        it('should return an empty list when no clients are found for the date', async () => {
            // Arrange
            mockAddressRepository.find.mockResolvedValue([]);
            (ClientDeliveredDTOMapper.toDTO as jest.Mock).mockReturnValue([]);

            // Act
            const result = await handler.execute(mockRequest);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.value).toHaveLength(0);
            expect(mockAddressRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the repository fails', async () => {
            // Arrange
            const dbError = new Error('Database connection failed');
            mockAddressRepository.find.mockRejectedValue(dbError);

            // Act & Assert
            await expect(handler.execute(mockRequest)).rejects.toThrow('Database connection failed');
        });
    });
});