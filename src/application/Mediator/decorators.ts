import "reflect-metadata";
import { HandlerRegistry } from "./HandlerRegistry";

export const COMMAND_HANDLER_METADATA = Symbol("COMMAND_HANDLER_METADATA");
export const QUERY_HANDLER_METADATA   = Symbol("QUERY_HANDLER_METADATA");
export const EVENT_HANDLER_METADATA   = Symbol("EVENT_HANDLER_METADATA");

export function CommandHandler(commandType: Function): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA, commandType, target);
        HandlerRegistry.registerSingle(commandType, target);
    };
}

export function QueryHandler(queryType: Function): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(QUERY_HANDLER_METADATA, queryType, target);
        HandlerRegistry.registerSingle(queryType, target);
    };
}

export function EventHandler(eventType: Function): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(EVENT_HANDLER_METADATA, eventType, target);
        HandlerRegistry.registerMany(eventType, target);
    };
}
