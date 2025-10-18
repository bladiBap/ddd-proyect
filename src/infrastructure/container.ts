import "reflect-metadata";
import { container } from "tsyringe";

// 🧩 Importar tus servicios, repositorios y handlers
import { AppDataSource } from "./Persistence/PersistenceModel/data-source";
import { UnitOfWork } from "./Persistence/UnitOfWork";
import { IUnitOfWork } from "@domain/core/abstractions/IUnitOfWork";
import { Mediator } from "@application/Mediator/Mediator";

// Query / Command handlers (si usas CQRS)
import { GetOrderDetailsQueryHandler } from "@application/Order/GetOrderByDay/GetOrderByDayQueryhandler";
import { GenerateOrderCommandHandler } from "@application/Order/GenerateOrder/GenerateOrderCommandHandler";
//import { CompleteOrderItemCommandHandler } from "@application/commands/CompleteOrderItemCommandHandler";

// Repositorios concretos (infraestructura)
import { OrderRepository } from "./Persistence/Repositories/OrderRepositorty";
import { AddressRepository } from "./Persistence/Repositories/AddressRepository";
//import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";

// Interfaces del dominio (pueden vivir en domain/)
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
import { IAddressRepository } from "@domain/Address/IAddressRepository";
//import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";

container.registerSingleton(Mediator, Mediator);

// 🧩 Registro de UnitOfWork
container.register<IUnitOfWork>("IUnitOfWork", {
    useClass: UnitOfWork,
});

// Registrar repositorios concretos por sus interfaces
container.registerSingleton<IOrderRepository>("IOrderRepository", OrderRepository);
container.registerSingleton<IAddressRepository>("IAddressRepository", AddressRepository);
//container.registerSingleton<IOrderItemRepository>("IOrderItemRepository", OrderItemRepository);

// Registrar Handlers (para Mediator)
container.registerSingleton(GetOrderDetailsQueryHandler, GetOrderDetailsQueryHandler);
container.registerSingleton(GenerateOrderCommandHandler, GenerateOrderCommandHandler);
//container.registerSingleton(CompleteOrderItemCommandHandler, CompleteOrderItemCommandHandler);

// Exportar para que otras partes lo puedan usar
export { container };
