import "reflect-metadata";
import { container } from "tsyringe";
import { HandlerRegistry } from "./HandlerRegistry";

export class Mediator {
    async send(command: any): Promise<any> {
        const handlerType = HandlerRegistry.resolveSingle(command.constructor);
        if (!handlerType) {
            throw new Error(`No command handler found for ${command.constructor.name}`);
        }
        const handler = container.resolve(handlerType);
        return handler.execute(command);
    }

    async ask(query: any): Promise<any> {
        const handlerType = HandlerRegistry.resolveSingle(query.constructor);
        if (!handlerType) {
            throw new Error(`No query handler found for ${query.constructor.name}`);
        }
        const handler = container.resolve(handlerType);
        return handler.execute(query);
    }

    async publish(event: any): Promise<void> {
        
        const handlerTypes = HandlerRegistry.resolveMany(event.constructor);
        if (handlerTypes.length === 0) return;

        const handlers = handlerTypes.map((t) => container.resolve(t));
        const tasks = handlers.map((h) => h.handle(event));

        const results = await Promise.allSettled(tasks);

        results.forEach((r, i) => {
            if (r.status === "rejected") {
                throw new Error(`Error in event handler ${handlerTypes[i].name}: ${r.reason}`);
            }
        });
        
    }
}
