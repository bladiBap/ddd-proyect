import 'reflect-metadata';
import { container } from 'tsyringe';
import { IMediator } from './IMediator';
import { IRequest } from '../../Core/Abstractions/IResquest';
import { HandlerRegistry } from './HandlerRegistry';
import { DomainEvent } from '@core/Abstractions/DomainEvent';

interface IHandler<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
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
                throw new Error(`Error in event handler ${handlerTypes[i].name}: ${r.reason}`);
            }
        });
        
    }
}