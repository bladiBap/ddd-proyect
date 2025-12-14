import "reflect-metadata";
import { GenerateOrderHandler } from "../../../../src/Application/Order/Commands/GenerateOrder/GenerateOrderHandler";
import { GenerateOrderCommand } from "../../../../src/Application/Order/Commands/GenerateOrder/GenerateOrderCommand";
import { Result } from "../../../../src/Core/Results/Result";
import { Exception } from "../../../../src/Core/Results/ErrorCustom";
import { Order } from "../../../../src/Domain/Order/Entities/Order";
import { DailyAllocation } from "../../../../src/Domain/DailyAllocation/Entities/DailyAllocation";
import { AllocationLine } from "../../../../src/Domain/DailyAllocation/Entities/AllocationLine";
import { StatusOrder } from "../../../../src/Domain/Order/Types/StatusOrderEnum";

jest.mock("@core/Abstractions/IUnitOfWork");
jest.mock("@domain/Order/Repositories/IOrderRepository");
jest.mock("@domain/Address/Repositories/IAddressRepository");
jest.mock("@domain/DailyAllocation/Repositories/IDailyAllocationRepository");
jest.mock("@domain/Recipe/Repositories/IRecipeRepository");

import { IUnitOfWork } from "../../../../src/Core/Abstractions/IUnitOfWork";
import { IOrderRepository } from "../../../../src/Domain/Order/Repositories/IOrderRepository";
import { IAddressRepository } from "../../../../src/Domain/Address/Repositories/IAddressRepository";
import { IDailyAllocationRepository } from "../../../../src/Domain/DailyAllocation/Repositories/IDailyAllocationRepository";
import { IRecipeRepository } from "../../../../src/Domain/Recipe/Repositories/IRecipeRepository";

describe("GenerateOrderHandler", () => {
	let handler: GenerateOrderHandler;
	let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
	let mockOrderRepository: jest.Mocked<IOrderRepository>;
	let mockAddressRepository: jest.Mocked<IAddressRepository>;
	let mockDailyAllocationRepository: jest.Mocked<IDailyAllocationRepository>;
	let mockRecipeRepository: jest.Mocked<IRecipeRepository>;
	let mockCommand: GenerateOrderCommand;

	const mockToday = new Date("2024-01-15");
	const mockRecipesToOrder = [
		{ recipeId: 1, quantity: 10 },
		{ recipeId: 2, quantity: 5 },
		{ recipeId: 3, quantity: 8 },
	];

	const mockRecipesPerClient = [
		{ clientId: 101, recipeId: 1, quantity: 4 },
		{ clientId: 101, recipeId: 2, quantity: 2 },
		{ clientId: 102, recipeId: 1, quantity: 6 },
		{ clientId: 103, recipeId: 3, quantity: 8 },
	];

	beforeEach(() => {
		// Limpiar todos los mocks
		jest.clearAllMocks();

		// Crear instancias mockeadas
		mockUnitOfWork = {
			startTransaction: jest.fn(),
			commit: jest.fn(),
			rollback: jest.fn(),
		} as any;

		mockOrderRepository = {
			findByDateAsync: jest.fn(),
			addAsync: jest.fn(),
		} as any;

		mockAddressRepository = {
			getPerClientNeeds: jest.fn(),
		} as any;

		mockDailyAllocationRepository = {
			addAsync: jest.fn(),
		} as any;

		mockRecipeRepository = {
			getRecipesToPrepare: jest.fn(),
		} as any;

		jest.useFakeTimers();
		jest.setSystemTime(mockToday);

		mockCommand = new GenerateOrderCommand();

		// Crear handler con mocks inyectados
		handler = new GenerateOrderHandler(
			mockUnitOfWork,
			mockOrderRepository,
			mockAddressRepository,
			mockRecipeRepository,
			mockDailyAllocationRepository
		);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe("execute", () => {
		describe("happy path - creación exitosa", () => {
			it("happy path - Generates order and daily allocation successfully", async () => {
				// Arrange
				mockOrderRepository.findByDateAsync.mockResolvedValue([]);
				mockRecipeRepository.getRecipesToPrepare.mockResolvedValue(
					mockRecipesToOrder
				);
				mockAddressRepository.getPerClientNeeds.mockResolvedValue(
					mockRecipesPerClient
				);

				let savedOrder: Order;
				let savedAllocation: DailyAllocation;

				mockOrderRepository.addAsync.mockImplementation(
					async (order) => {
						savedOrder = order;
						return Promise.resolve();
					}
				);

				mockDailyAllocationRepository.addAsync.mockImplementation(
					async (allocation) => {
						savedAllocation = allocation;
						return Promise.resolve();
					}
				);

				// Act
				const result = await handler.execute(mockCommand);

				// Assert
				expect(result.isSuccess).toBe(true);

				// Verificar transacción
				expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(
					1
				);
				expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
				expect(mockUnitOfWork.rollback).not.toHaveBeenCalled();

				// Verificar búsqueda de órdenes existentes
				expect(
					mockOrderRepository.findByDateAsync
				).toHaveBeenCalledWith(mockToday);

				// Verificar obtención de datos
				expect(
					mockRecipeRepository.getRecipesToPrepare
				).toHaveBeenCalledWith(mockToday);
				expect(
					mockAddressRepository.getPerClientNeeds
				).toHaveBeenCalledWith(mockToday);

				// Verificar que se guardó la orden
				expect(mockOrderRepository.addAsync).toHaveBeenCalledTimes(1);
				expect(savedOrder!).toBeInstanceOf(Order);
				expect(savedOrder!.getListOrderItems()).toHaveLength(3);
				expect(savedOrder!.getStatus()).toBe(StatusOrder.CREATED);

				// Verificar que se guardó la asignación diaria
				expect(
					mockDailyAllocationRepository.addAsync
				).toHaveBeenCalledTimes(1);
				expect(savedAllocation!).toBeInstanceOf(DailyAllocation);
				expect(savedAllocation!.getLines()).toHaveLength(4);

				// Verificar items de la orden
				const orderItems = savedOrder!.getListOrderItems();
				expect(orderItems[0].getRecipeId()).toBe(1);
				expect(orderItems[0].getQuantityPlanned()).toBe(10);
				expect(orderItems[1].getRecipeId()).toBe(2);
				expect(orderItems[1].getQuantityPlanned()).toBe(5);
				expect(orderItems[2].getRecipeId()).toBe(3);
				expect(orderItems[2].getQuantityPlanned()).toBe(8);

				// Verificar líneas de asignación
				const allocationLines = savedAllocation!.getLines();
				expect(allocationLines[0].getClientId()).toBe(101);
				expect(allocationLines[0].getRecipeId()).toBe(1);
				expect(allocationLines[0].getQuantityNeeded()).toBe(4);
			});
		});

		describe("failure scenarios", () => {
			it("should return conflict when order for today already exists", async () => {
				// Arrange
				const mockExistingOrder = new Order(
                    1,
                    mockToday,
                    mockToday,
                    StatusOrder.CREATED,
                    []
                );
				mockOrderRepository.findByDateAsync.mockResolvedValue([
					mockExistingOrder,
				]);

				// Act
				const result = await handler.execute(mockCommand);

				// Assert
				expect(result.isSuccess).toBe(false);
				expect(result.error?.code).toBe("Order.AlreadyExists");
				expect(result.error?.structuredMessage).toBe(
					"An order for today already exists"
				);

				expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(
					1
				);
				expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
				expect(mockUnitOfWork.commit).not.toHaveBeenCalled();

				expect(
					mockRecipeRepository.getRecipesToPrepare
				).not.toHaveBeenCalled();
				expect(
					mockAddressRepository.getPerClientNeeds
				).not.toHaveBeenCalled();
				expect(mockOrderRepository.addAsync).not.toHaveBeenCalled();
				expect(
					mockDailyAllocationRepository.addAsync
				).not.toHaveBeenCalled();
			});

			it("should return not found when no recipes to prepare", async () => {
				// Arrange
				mockOrderRepository.findByDateAsync.mockResolvedValue([]);
				mockRecipeRepository.getRecipesToPrepare.mockResolvedValue([]);

				// Act
				const result = await handler.execute(mockCommand);

				// Assert
				expect(result.isSuccess).toBe(false);
				expect(result.error?.code).toBe("Order.NoRecipes");
				expect(result.error?.structuredMessage).toBe(
					"No recipes found to generate an order"
				);

				expect(mockUnitOfWork.startTransaction).toHaveBeenCalledTimes(
					1
				);
				expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
				expect(mockUnitOfWork.commit).not.toHaveBeenCalled();

                expect(mockAddressRepository.getPerClientNeeds).toHaveBeenCalledTimes(
					1
				);

				expect(mockOrderRepository.addAsync).not.toHaveBeenCalled();
				expect(
					mockDailyAllocationRepository.addAsync
				).not.toHaveBeenCalled();
			});
		});
	});
});
