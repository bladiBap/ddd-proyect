import 'reflect-metadata';
import { CreatePackageHandler } from '@application/Package/Commands/CreatePackage/CreatePackageHandler';
import { CreatePackageCommand } from '@application/Package/Commands/CreatePackage/CreatePackageCommand';
import { Exception } from '@common/Core/Results/Exception';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { IClientRepository } from '@domain/Client/Repositories/IClientRepository';
import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';
import { IPackageRepository } from '@domain/Package/Repositories/IPackageRepository';
import { IDailyAllocationRepository } from '@domain/DailyAllocation/Repositories/IDailyAllocationRepository';
import { Client } from '@domain/Client/Entities/Client';
import { Address } from '@domain/Address/Entities/Address';
import { Package } from '@domain/Package/Entities/Package';
import { DailyAllocation } from '@domain/DailyAllocation/Entities/DailyAllocation';
import { AllocationLine } from '@domain/DailyAllocation/Entities/AllocationLine';
import { PackageItem } from '@domain/Package/Entities/PackageItem';
import { StatusPackage } from '@domain/Package/Types/StatusPackage';

// Mocks
jest.mock('@domain/Client/Entities/Client');
jest.mock('@domain/Address/Entities/Address');
jest.mock('@domain/Package/Entities/Package');
jest.mock('@domain/DailyAllocation/Entities/DailyAllocation');
jest.mock('@domain/DailyAllocation/Entities/AllocationLine');
jest.mock('@domain/Package/Entities/PackageItem');

describe('CreatePackageHandler', () => {
    // Mocks de dependencias
    let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
    let mockClientRepository: jest.Mocked<IClientRepository>;
    let mockAddressRepository: jest.Mocked<IAddressRepository>;
    let mockPackageRepository: jest.Mocked<IPackageRepository>;
    let mockDailyAllocationRepository: jest.Mocked<IDailyAllocationRepository>;
    
    // Handler bajo test
    let createPackageHandler: CreatePackageHandler;
    
    // Datos de prueba
    const clientId = 1;
    const addressId = 100;
    const recipeIds = [101, 102, 103];
    const createPackageCommand = new CreatePackageCommand(clientId, recipeIds);
    
    // Mocks de entidades
    let mockClient: jest.Mocked<Client>;
    let mockAddress: jest.Mocked<Address>;
    let mockDailyAllocation: jest.Mocked<DailyAllocation>;
    let mockAllocationLine1: jest.Mocked<AllocationLine>;
    let mockAllocationLine2: jest.Mocked<AllocationLine>;
    let mockPackage: jest.Mocked<Package>;
    let mockPackageItem: jest.Mocked<PackageItem>;
    
    beforeEach(() => {
        mockUnitOfWork = {
            startTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            getRepository: jest.fn(),
            getManager: jest.fn(),
            getRequiredManager: jest.fn()
        } as jest.Mocked<IUnitOfWork>;
        
        mockClientRepository = {
            getByIdAsync: jest.fn(),
            deleteAsync: jest.fn(),
            addAsync: jest.fn()
        } as jest.Mocked<IClientRepository>;
        
        mockAddressRepository = {
            getAddressForTodayByClientId: jest.fn(),
            deleteAsync: jest.fn(),
            getPerClientNeeds: jest.fn(),
            getClientsForDeliveredInformation: jest.fn(),
            getByIdAsync: jest.fn(),
            addAsync: jest.fn()
        } as jest.Mocked<IAddressRepository>;
        
        mockPackageRepository = {
            getPackageByAddressClientIdAsync: jest.fn(),
            addAsync: jest.fn(),
            getByIdAsync: jest.fn(),
            getDetailsByIdAsync: jest.fn()
        } as jest.Mocked<IPackageRepository>;
        
        mockDailyAllocationRepository = {
            getDailyAllocationToday: jest.fn(),
            updatedLines: jest.fn(),
            addAsync: jest.fn(),
            findByDateAsync: jest.fn(),
            getByIdAsync: jest.fn()
        } as jest.Mocked<IDailyAllocationRepository>;
        
        mockClient = {
            getId: jest.fn().mockReturnValue(clientId)
        } as any;
        
        mockAddress = {
            getId: jest.fn().mockReturnValue(addressId)
        } as any;
        
        mockAllocationLine1 = {
            getRecipeId: jest.fn().mockReturnValue(101),
            getQuantityNeeded: jest.fn().mockReturnValue(5),
            updateQuantityPackaged: jest.fn()
        } as any;
        
        mockAllocationLine2 = {
            getRecipeId: jest.fn().mockReturnValue(102),
            getQuantityNeeded: jest.fn().mockReturnValue(3),
            updateQuantityPackaged: jest.fn()
        } as any;
        
        mockDailyAllocation = {
            clientHasAllRecipes: jest.fn(),
            getLines: jest.fn().mockReturnValue([mockAllocationLine1, mockAllocationLine2])
        } as any;
        
        mockPackage = {
            getId: jest.fn().mockReturnValue(999),
            addPackageItem: jest.fn()
        } as any;
        
        mockPackageItem = {
        
        } as any;
        
        // Mockear constructores
        (Package as jest.MockedClass<typeof Package>).mockImplementation(() => mockPackage);
        (PackageItem as jest.MockedClass<typeof PackageItem>).mockImplementation(() => mockPackageItem);
        
        // Crear instancia del handler
        createPackageHandler = new CreatePackageHandler(
            mockUnitOfWork,
            mockClientRepository,
            mockAddressRepository,
            mockPackageRepository,
            mockDailyAllocationRepository
        );
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('execute', () => {
        describe('happy path - creación exitosa', () => {
            it('should create package successfully when all conditions are met', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(mockClient);
                mockAddressRepository.getAddressForTodayByClientId.mockResolvedValue(mockAddress);
                mockPackageRepository.getPackageByAddressClientIdAsync.mockResolvedValue(null);
                mockDailyAllocationRepository.getDailyAllocationToday.mockResolvedValue(mockDailyAllocation);
                mockDailyAllocation.clientHasAllRecipes.mockReturnValue(true);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(true);
                expect(result.isFailure).toBe(false);
                
                expect(mockClientRepository.getByIdAsync).toHaveBeenCalledWith(clientId);
                expect(mockAddressRepository.getAddressForTodayByClientId).toHaveBeenCalledWith(clientId);
                expect(mockPackageRepository.getPackageByAddressClientIdAsync).toHaveBeenCalledWith(addressId, clientId);
                expect(mockDailyAllocationRepository.getDailyAllocationToday).toHaveBeenCalledWith(clientId);
                expect(mockDailyAllocation.clientHasAllRecipes).toHaveBeenCalledWith(clientId, recipeIds);
                
                expect(mockUnitOfWork.startTransaction).toHaveBeenCalled();
                expect(mockUnitOfWork.commit).toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).not.toHaveBeenCalled();
                
                // Verificar creación de Package
                expect(Package).toHaveBeenCalledWith(
                    0,
                    expect.any(String),
                    StatusPackage.PACKAGING,
                    clientId,
                    addressId,
                    expect.any(Date)
                );
                
                // Verificar PackageItems creados
                expect(PackageItem).toHaveBeenCalledTimes(2);
                expect(PackageItem).toHaveBeenNthCalledWith(
                    1,
                    0,
                    101,
                    999, // ID del package
                    5    // Quantity needed
                );
                expect(PackageItem).toHaveBeenNthCalledWith(
                    2,
                    0,
                    102,
                    999,
                    3
                );
                
                // Verificar adición de items al package
                expect(mockPackage.addPackageItem).toHaveBeenCalledTimes(2);
                
                // Verificar actualización de líneas
                expect(mockAllocationLine1.updateQuantityPackaged).toHaveBeenCalledWith(5);
                expect(mockAllocationLine2.updateQuantityPackaged).toHaveBeenCalledWith(3);
                expect(mockDailyAllocationRepository.updatedLines).toHaveBeenCalledWith([mockAllocationLine1, mockAllocationLine2]);
                
                // Verificar persistencia
                expect(mockPackageRepository.addAsync).toHaveBeenCalledWith(mockPackage);
            });
        });
        
        describe('failure scenarios', () => {
            it('should return failure when client is not found', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(null);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(false);
                expect(result.isFailure).toBe(true);
                expect(result.error).toBeInstanceOf(Exception);
                expect(result.error?.code).toBe('Client.NotFound');
                expect(result.error?.structuredMessage).toContain(`Client with id ${clientId} not found`);
                
                // Verificar que no se creó package
                expect(mockPackageRepository.addAsync).not.toHaveBeenCalled();
                expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            });
        
            it('should return failure when address is not found for today', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(mockClient);
                mockAddressRepository.getAddressForTodayByClientId.mockResolvedValue(null);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(false);
                expect(result.isFailure).toBe(true);
                expect(result.error?.code).toBe('Address.NotFound');
                expect(result.error?.structuredMessage).toContain(`No address found for client id ${clientId} today`);

                // Verificar que no se creó package
                expect(mockPackageRepository.addAsync).not.toHaveBeenCalled();
                expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            });
        
            it('should return failure when package already exists', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(mockClient);
                mockAddressRepository.getAddressForTodayByClientId.mockResolvedValue(mockAddress);
                mockPackageRepository.getPackageByAddressClientIdAsync.mockResolvedValue(mockPackage);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(false);
                expect(result.isFailure).toBe(true);
                expect(result.error?.code).toBe('Package.AlreadyExists');
                expect(result.error?.structuredMessage).toContain(`Package already exists for client id ${clientId}`);
                
                // Verificar que no se creó package
                expect(mockPackageRepository.addAsync).not.toHaveBeenCalled();
                expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            });
        
            it('should return failure when daily allocation is not found', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(mockClient);
                mockAddressRepository.getAddressForTodayByClientId.mockResolvedValue(mockAddress);
                mockPackageRepository.getPackageByAddressClientIdAsync.mockResolvedValue(null);
                mockDailyAllocationRepository.getDailyAllocationToday.mockResolvedValue(null);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(false);
                expect(result.isFailure).toBe(true);
                expect(result.error?.code).toBe('DailyAllocation.NotFound');
                expect(result.error?.structuredMessage).toContain(`No daily allocation found for client id ${clientId} today`);

                // Verificar que no se creó package
                expect(mockPackageRepository.addAsync).not.toHaveBeenCalled();
                expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            });
        
            it('should return failure when client does not have all recipes', async () => {
                // Arrange
                mockClientRepository.getByIdAsync.mockResolvedValue(mockClient);
                mockAddressRepository.getAddressForTodayByClientId.mockResolvedValue(mockAddress);
                mockPackageRepository.getPackageByAddressClientIdAsync.mockResolvedValue(null);
                mockDailyAllocationRepository.getDailyAllocationToday.mockResolvedValue(mockDailyAllocation);
                mockDailyAllocation.clientHasAllRecipes.mockReturnValue(false);
                
                // Act
                const result = await createPackageHandler.execute(createPackageCommand);
                
                // Assert
                expect(result.isSuccess).toBe(false);
                expect(result.isFailure).toBe(true);
                expect(result.error?.code).toBe('DailyAllocation.MissingRecipes');
                expect(result.error?.structuredMessage).toContain(`Client with id ${clientId} does not have all recipes`);

                // Verificar que no se creó package
                expect(mockPackageRepository.addAsync).not.toHaveBeenCalled();
                expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
                expect(mockUnitOfWork.rollback).toHaveBeenCalled();
            });
        });
    });
});