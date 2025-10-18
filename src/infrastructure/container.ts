import "reflect-metadata";
import { container } from "tsyringe";

// 🧩 Importar tus servicios, repositorios y handlers
import { AppDataSource } from "./Persistence/DomainModel/data-source";
import { UnitOfWork } from "./Persistence/UnitOfWork";

// Query / Command handlers (si usas CQRS)
import { GetOrderDetailsQueryHandler } from "@application/Order/GetOrderByDay/GetOrderByDayQueryhandler";
//import { CompleteOrderItemCommandHandler } from "@application/commands/CompleteOrderItemCommandHandler";

// Repositorios concretos (infraestructura)
import { OrderRepository } from "./Persistence/Repositories/OrderRepositorty";
//import { OrderItemRepository } from "./Persistence/Repositories/OrderItemRepository";

// Interfaces del dominio (pueden vivir en domain/)
import { IOrderRepository } from "@domain/aggregates/order/IOrderRepository";
//import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";

// Registrar UnitOfWork
container.registerSingleton(UnitOfWork);

// Registrar repositorios concretos por sus interfaces
container.registerSingleton<IOrderRepository>("IOrderRepository", OrderRepository);
//container.registerSingleton<IOrderItemRepository>("IOrderItemRepository", OrderItemRepository);

// Registrar Handlers (para Mediator)
container.registerSingleton(GetOrderDetailsQueryHandler, GetOrderDetailsQueryHandler);
//container.registerSingleton(CompleteOrderItemCommandHandler, CompleteOrderItemCommandHandler);

// Exportar para que otras partes lo puedan usar
export { container };
