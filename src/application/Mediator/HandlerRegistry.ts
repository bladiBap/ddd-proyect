type HandlerType = new (...args: any[]) => any;

export class HandlerRegistry {
    
    private static singleHandlers = new Map<Function, HandlerType>();

    private static multiHandlers = new Map<Function, HandlerType[]>();

    static registerSingle(requestType: Function, handlerType: HandlerType) {
        this.singleHandlers.set(requestType, handlerType);
    }

    static resolveSingle(requestType: Function): HandlerType | undefined {
        return this.singleHandlers.get(requestType);
    }

    static registerMany(eventType: Function, handlerType: HandlerType) {
        const list = this.multiHandlers.get(eventType) ?? [];
        list.push(handlerType);
        this.multiHandlers.set(eventType, list);
    }

    static resolveMany(eventType: Function): HandlerType[] {
        return this.multiHandlers.get(eventType) ?? [];
    }
}
