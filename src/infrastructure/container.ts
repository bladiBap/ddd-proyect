import "reflect-metadata";
import "@application/Order/events/OrderItemCompletedEventHandler";

import { container } from "tsyringe";

import { UnitOfWork } from "./Persistence/UnitOfWork";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Mediator } from "@application/Mediator/Mediator";


import { GetOrderDetailsHandler } from "@infrastructure/querys/GetOrderByDayhandler";
import { GenerateOrderCommandHandler } from "@application/Order/GenerateOrder/GenerateOrderCommandHandler";
import { CompleteOrderItemCommandHandler } from "@application/Order/CompleteOrderItem/CompleteOrderItemCommandHandler";
import { GetClientsForDeliveredHandler } from "@infrastructure/querys/GetClientsForDeliveredHandler";
import { CreatePackageCommandHandler } from "@application/Package/CreatePackage/CreatePackageCommandHandler";

import { OrderRepository } from "./Persistence/Repositories/OrderRepositorty";
import { AddressRepository } from "./Persistence/Repositories/AddressRepository";
import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";
import { ClientRepository } from "./Persistence/Repositories/ClientRepository";
import { PackageRepository } from "./Persistence/Repositories/PackageRepository";
import { DailyAllocationRepository } from "./Persistence/Repositories/DailyAllocationRepository";

import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";
import { IOrderItemRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { IClientRepository } from "@domain/aggregates/client/IClientRepository";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { IDailyAllocationRepository } from "@domain/aggregates/dailyAllocation/IDailyAllocationRepository";

container.registerSingleton(Mediator, Mediator);

container.register<IUnitOfWork>("IUnitOfWork", {
    useClass: UnitOfWork,
});

container.registerSingleton<IOrderRepository>("IOrderRepository", OrderRepository);
container.registerSingleton<IAddressRepository>("IAddressRepository", AddressRepository);
container.registerSingleton<IOrderItemRepository>("IOrderItemRepository", OrderItemRepository);
container.registerSingleton<IClientRepository>("IClientRepository", ClientRepository);
container.registerSingleton<IPackageRepository>("IPackageRepository", PackageRepository);
container.registerSingleton<IDailyAllocationRepository>("IDailyAllocationRepository", DailyAllocationRepository);

container.registerSingleton(GetOrderDetailsHandler, GetOrderDetailsHandler);
container.registerSingleton(GenerateOrderCommandHandler, GenerateOrderCommandHandler);
container.registerSingleton(CompleteOrderItemCommandHandler, CompleteOrderItemCommandHandler);
container.registerSingleton(GetClientsForDeliveredHandler, GetClientsForDeliveredHandler);
container.registerSingleton(CreatePackageCommandHandler, CreatePackageCommandHandler);

export { container };
