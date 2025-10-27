import "reflect-metadata";
import { container } from "tsyringe";

// Importar tus servicios, repositorios y handlers
// import { AppDataSource } from "./Persistence/PersistenceModel/data-source";
import { UnitOfWork } from "./Persistence/UnitOfWork";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Mediator } from "@application/Mediator/Mediator";

// Query / Command handlers (si usas CQRS)
import { GetOrderDetailsHandler } from "@infrastructure/querys/GetOrderByDayhandler";
import { GenerateOrderCommandHandler } from "@application/Order/GenerateOrder/GenerateOrderCommandHandler";
import { CompleteOrderItemCommandHandler } from "@application/Order/CompleteOrderItem/CompleteOrderItemCommandHandler";
import { GetClientsForDeliveredHandler } from "@infrastructure/querys/GetClientsForDeliveredHandler";
//import { CompleteOrderItemCommandHandler } from "@application/commands/CompleteOrderItemCommandHandler";

// Repositorios concretos (infraestructura)
import { OrderRepository } from "./Persistence/Repositories/OrderRepositorty";
import { AddressRepository } from "./Persistence/Repositories/AddressRepository";
import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";
import { ClientRepository } from "./Persistence/Repositories/ClientRepository";
import { PackageRepository } from "./Persistence/Repositories/PackageRepository";
//import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";

// Interfaces del dominio (pueden vivir en domain/)
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";
import { IOrderItemRepository } from "@domain/aggregates/order/IOrderItemRepository";
import { IClientRepository } from "@domain/Client/IClientRepository";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
//import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";

container.registerSingleton(Mediator, Mediator);

// Registro de UnitOfWork
container.register<IUnitOfWork>("IUnitOfWork", {
    useClass: UnitOfWork,
});

// Registrar repositorios concretos por sus interfaces
container.registerSingleton<IOrderRepository>("IOrderRepository", OrderRepository);
container.registerSingleton<IAddressRepository>("IAddressRepository", AddressRepository);
container.registerSingleton<IOrderItemRepository>("IOrderItemRepository", OrderItemRepository);
container.registerSingleton<IClientRepository>("IClientRepository", ClientRepository);
container.registerSingleton<IPackageRepository>("IPackageRepository", PackageRepository);
// Registrar Handlers (para Mediator)
container.registerSingleton(GetOrderDetailsHandler, GetOrderDetailsHandler);
container.registerSingleton(GenerateOrderCommandHandler, GenerateOrderCommandHandler);
container.registerSingleton(CompleteOrderItemCommandHandler, CompleteOrderItemCommandHandler);
container.registerSingleton(GetClientsForDeliveredHandler, GetClientsForDeliveredHandler);

// Exportar para que otras partes lo puedan usar
export { container };
