import 'reflect-metadata';
import { container } from 'tsyringe';
import { IMediator } from './IMediator';
import { IRequest } from '@common/Core/Abstractions/IResquest';
import { HandlerRegistry } from './HandlerRegistry';
import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
import { OutboxMessage } from '@outbox/Model/OutboxMessage';

interface IHandler<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
}

export interface IEventHandler<TEvent> {
    handle(event: TEvent): Promise<void>;
}

export class Mediator implements IMediator {

	async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
		const requestType = request.constructor;
		const handlerType = HandlerRegistry.resolveSingle(requestType);

		if (!handlerType) {
			throw new Error(`No handler found for ${requestType.name}`);
		}

		const handler = container.resolve<IHandler<IRequest<TResponse>, TResponse>>(handlerType);

		return handler.execute(request);
	}

	async publish(event: DomainEvent): Promise<void> {

		const handlerTypes = HandlerRegistry.resolveMany(event.constructor);
		if (handlerTypes.length === 0) {return;}

		const handlers = handlerTypes.map((t) => container.resolve(t));
		const tasks = handlers.map((h) => h.handle(event));

		const results = await Promise.allSettled(tasks);

		results.forEach((r, i) => {
			if (r.status === 'rejected') {
				throw new Error(`Error in event handler ${handlerTypes[i]?.name}: ${r.reason}`);
			}
		});

	}

	// En Mediator.ts
	async publishOutboxMessage<TEvent extends DomainEvent>(message: OutboxMessage<TEvent>): Promise<void> {
		const content = message.content;

		if (!content) {
			console.error(`[Outbox] Mensaje ${message.id} ignorado por falta de contenido.`);
			return;
		}

		// 1. Identificar la clase especializada mediante el HandlerRegistry
		const contentConstructor = content.constructor;
		const specializedClass = HandlerRegistry.resolveOutboxClassFor(contentConstructor);

		// 2. Determinar qué objeto enviar a los handlers
		let eventToPublish: any = message;

		if (specializedClass) {
			// Rehidratamos a la clase específica (ej. PackageCompletedOutbox)
			const specializedInstance = new specializedClass(content);
			Object.assign(specializedInstance, message);
			eventToPublish = specializedInstance;
		}

		// 3. Ejecutar los handlers
		const handlerTypes = HandlerRegistry.resolveMany(eventToPublish.constructor);

		if (handlerTypes.length === 0) {
			console.warn(`[Outbox] No se encontró un Handler para: ${eventToPublish.constructor.name}`);
			return;
		}

		const handlers = handlerTypes.map(t => container.resolve<IEventHandler<any>>(t));

		// Ejecución y manejo de resultados
		const tasks = handlers.map(h => h.handle(eventToPublish));
		const results = await Promise.allSettled(tasks);

		this.handleResults(results, handlerTypes);
	}

	private handleResults(results: PromiseSettledResult<void>[], types: any[]) {
		results.forEach((r, i) => {
			if (r.status === 'rejected') {
				console.error(`[Outbox Error] en ${types[i].name}:`, r.reason);
				// Aquí podrías lanzar el error si quieres que el OutboxProcessor haga rollback
				throw r.reason;
			}
		});
	}

	// async publishOutboxMessage<TEvent extends DomainEvent>(message: OutboxMessage<TEvent>): Promise<void> {
	//     const handlerTypes = HandlerRegistry.resolveMany(message.constructor);
	//     if (handlerTypes.length === 0) {return;}
	//     const handlers = handlerTypes.map((t) => {
	//         const handler = container.resolve<IEventHandler<OutboxMessage<TEvent>>>(t);
	//         if (handler) {
	//             return handler;
	//         }
	//         return null;
	//     });
	//     const tasks = handlers.map((h) => {
	//         if (h) {
	//             return h.handle(message);
	//         }
	//         return Promise.resolve();
	//     });
	//     const results = await Promise.allSettled(tasks);
	//     results.forEach((r, i) => {
	//         if (r.status === 'rejected') {
	//             throw new Error(`Error in outbox message handler ${handlerTypes[i].name}: ${r.reason}`);
	//         }
	//     });
	// }
}
