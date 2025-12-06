import "reflect-metadata";
import "@application/Order/Events/OrderItemCompleted";

import { container } from "tsyringe";

import { UnitOfWork } from "./Persistence/UnitOfWork";
import { IUnitOfWork } from "@core/Abstractions/IUnitOfWork";
import { Mediator } from "@application/Mediator/Mediator";


import { GetOrderDetailsHandler } from "@infrastructure/Querys/GetOrderByDayhandler";
import { GenerateOrderHandler } from "@application/Order/Commands/GenerateOrder/GenerateOrderHandler";
import { CompleteOrderItemHandler } from "@application/Order/Commands/CompleteOrderItem/CompleteOrderItemHandler";
import { GetClientsForDeliveredHandler } from "@infrastructure/Querys/GetClientsForDeliveredHandler";
import { CreatePackageHandler } from "@application/Package/Commands/CreatePackage/CreatePackageHandler";

import { OrderRepository } from "./Persistence/Repositories/OrderRepositorty";
import { AddressRepository } from "./Persistence/Repositories/AddressRepository";
import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";
import { ClientRepository } from "./Persistence/Repositories/ClientRepository";
import { PackageRepository } from "./Persistence/Repositories/PackageRepository";
import { DailyAllocationRepository } from "./Persistence/Repositories/DailyAllocationRepository";
import { RecipeRepository } from "./Persistence/Repositories/RecipeRepository";

import { IOrderRepository } from "@domain/Order/Repositories/IOrderRepository";
import { IAddressRepository } from "@domain/Address/Repositories/IAddressRepository";
import { IOrderItemRepository } from "@domain/Order/Repositories/IOrderItemRepository";
import { IClientRepository } from "@domain/Client/Repositories/IClientRepository";
import { IPackageRepository } from "@domain/Package/Repositories/IPackageRepository";
import { IDailyAllocationRepository } from "@domain/DailyAllocation/Repositories/IDailyAllocationRepository";
import { IRecipeRepository } from '@domain/Recipe/Repositories/IRecipeRepository';


container.registerSingleton(Mediator, Mediator);

container.registerSingleton<IUnitOfWork>("IUnitOfWork", UnitOfWork);

container.register("IEntityManagerProvider", {
    useToken: "IUnitOfWork",
});

container.registerSingleton<IOrderRepository>("IOrderRepository", OrderRepository);
container.registerSingleton<IAddressRepository>("IAddressRepository", AddressRepository);
container.registerSingleton<IOrderItemRepository>("IOrderItemRepository", OrderItemRepository);
container.registerSingleton<IClientRepository>("IClientRepository", ClientRepository);
container.registerSingleton<IPackageRepository>("IPackageRepository", PackageRepository);
container.registerSingleton<IDailyAllocationRepository>("IDailyAllocationRepository", DailyAllocationRepository);
container.registerSingleton<IRecipeRepository>("IRecipeRepository", RecipeRepository);

container.registerSingleton(GetOrderDetailsHandler, GetOrderDetailsHandler);
container.registerSingleton(GenerateOrderHandler, GenerateOrderHandler);
container.registerSingleton(CompleteOrderItemHandler, CompleteOrderItemHandler);
container.registerSingleton(GetClientsForDeliveredHandler, GetClientsForDeliveredHandler);
container.registerSingleton(CreatePackageHandler, CreatePackageHandler);

export { container };
