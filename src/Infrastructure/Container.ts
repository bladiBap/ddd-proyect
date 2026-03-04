import 'reflect-metadata';
import '@application/Order/Events/OrderItemCompleted';

import { container, Lifecycle } from 'tsyringe';

import { UnitOfWork } from './Persistence/UnitOfWork';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Mediator } from '@/Common/Mediator/Mediator';


import { GetOrderByDayHandler } from '@infrastructure/Querys/Order/GetOrderByDayHandler';
import { GetOrderByIdHandler } from '@infrastructure/Querys/Order/GetOrderByIdHandler';
import { GenerateOrderHandler } from '@application/Order/Commands/GenerateOrder/GenerateOrderHandler';
import { IncreaseQuantityOrderItemHandler } from '@application/Order/Commands/IncreaseQuantityOrderItem/IncreaseQuantityOrderItemHandler';
import { GetClientsForDeliveredHandler } from '@infrastructure/Querys/Client/GetClientsForDeliveredHandler';
import { CreatePackageHandler } from '@application/Package/Commands/CreatePackage/CreatePackageHandler';
import { CreateAddressHandler } from '@application/Address/Commands/CreateAddress/CreateAddressHandler';
import { UpdateAddressHandler } from '@application/Address/Commands/UpdateAddress/UpdateCommandHandler';
import { DeleteAddressHandler } from '@application/Address/Commands/DeleteAddress/DeleteCommandHandler';
import { GetAddressByIdHandler } from '@infrastructure/Querys/Address/GetAddressByIdHandler';

import { OrderRepository } from './Persistence/Repositories/OrderRepositorty';
import { AddressRepository } from './Persistence/Repositories/AddressRepository';
import { OrderItemRepository } from './Persistence/Repositories/OrderItemRepository';
import { ClientRepository } from './Persistence/Repositories/ClientRepository';
import { PackageRepository } from './Persistence/Repositories/PackageRepository';
import { DailyAllocationRepository } from './Persistence/Repositories/DailyAllocationRepository';
import { RecipeRepository } from './Persistence/Repositories/RecipeRepository';

import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';
import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';
import { IOrderItemRepository } from '@domain/Order/Repositories/IOrderItemRepository';
import { IClientRepository } from '@domain/Client/Repositories/IClientRepository';
import { IPackageRepository } from '@domain/Package/Repositories/IPackageRepository';
import { IDailyAllocationRepository } from '@domain/DailyAllocation/Repositories/IDailyAllocationRepository';
import { IRecipeRepository } from '@domain/Recipe/Repositories/IRecipeRepository';

//Services
import { OutboxService } from '@outbox/Service/OutboxService';
import { RabbitMQSettings } from '@/Comunication/RabbitMQ/Services/RabbitMQSetting';
import { constants } from '@common/Constants/Constants';
import { IOutboxDatabase } from '@outbox/Repository/IOutboxDatabase';
import { OutboxProcessor } from '@outbox/Processor/OutboxProcesor';
import { PackageCompletedHandler } from '@application/OutboxMessagehandler/PackageCompletedHandler';
import { RabbitMQExternalPublisher } from '@comunication/RabbitMQ/Services/RabbitMQExternalPublisher';
import { ClientCreatedHandler } from '@application/Client/Command/ClientCreatedHandler';


container.registerSingleton(Mediator, Mediator);
container.registerInstance(RabbitMQSettings, new RabbitMQSettings(
    5672,
    false,
    constants.RABBIT_MQ_SETTINGS.HOST,
    constants.RABBIT_MQ_SETTINGS.USERNAME,
    constants.RABBIT_MQ_SETTINGS.PASSWORD,
    constants.RABBIT_MQ_SETTINGS.VIRTUAL_HOST,
));

container.register<IUnitOfWork>('IUnitOfWork', {
    useClass: UnitOfWork,
}, {
    lifecycle: Lifecycle.ContainerScoped,
});

container.register('IEntityManagerProvider', {
    useToken: 'IUnitOfWork',
});


//Repositories
container.registerSingleton<IOrderRepository>('IOrderRepository', OrderRepository);
container.registerSingleton<IAddressRepository>('IAddressRepository', AddressRepository);
container.registerSingleton<IOrderItemRepository>('IOrderItemRepository', OrderItemRepository);
container.registerSingleton<IClientRepository>('IClientRepository', ClientRepository);
container.registerSingleton<IPackageRepository>('IPackageRepository', PackageRepository);
container.registerSingleton<IDailyAllocationRepository>('IDailyAllocationRepository', DailyAllocationRepository);
container.registerSingleton<IRecipeRepository>('IRecipeRepository', RecipeRepository);

//Outbox
container.register<IOutboxDatabase>('IOutboxDatabase', { useToken: 'IUnitOfWork' });
container.register(OutboxProcessor, { useClass: OutboxProcessor }, { lifecycle: Lifecycle.ContainerScoped });
container.registerSingleton(OutboxService);
container.register('IOutboxService', { useToken: OutboxService },{ lifecycle: Lifecycle.ContainerScoped });
container.register('IOutboxRepository', { useToken: OutboxService });

//Handlers Outbox 
container.register('OutboxMessage<PackageCompleted>', { useClass: PackageCompletedHandler });

//Rabbit
container.register('IExternalPublisher', { useClass: RabbitMQExternalPublisher }, { lifecycle: Lifecycle.ContainerScoped });

// Handlers
container.registerSingleton('GetOrderByDay', GetOrderByDayHandler);
container.registerSingleton('GetOrderById', GetOrderByIdHandler);
container.registerSingleton('GenerateOrderHandler', GenerateOrderHandler);
container.registerSingleton('IncreaseQuantityOrderItemHandler', IncreaseQuantityOrderItemHandler);
container.registerSingleton('GetClientsForDeliveredHandler', GetClientsForDeliveredHandler);
container.registerSingleton('CreatePackageHandler', CreatePackageHandler);
container.registerSingleton('CreateAddressCommand', CreateAddressHandler);
container.registerSingleton('UpdateAddressCommand', UpdateAddressHandler);
container.registerSingleton('DeleteAddressCommand', DeleteAddressHandler);
container.registerSingleton('GetAddressById', GetAddressByIdHandler);

//Handler incomming messages RabbitMQ
container.registerSingleton('ClientCreatedCommand', ClientCreatedHandler);
export { container };
