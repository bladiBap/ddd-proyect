import "reflect-metadata";
import { container } from "tsyringe";
import { HandlerRegistry } from "./HandlerRegistry";

export class Mediator {
    async send(request: any): Promise<any> {
        const handlerType = HandlerRegistry.resolve(request.constructor);

        if (!handlerType) {
        throw new Error(`No handler found for ${request.constructor.name}`);
        }

        const handler = container.resolve(handlerType);
        return handler.execute(request);
    }
}
