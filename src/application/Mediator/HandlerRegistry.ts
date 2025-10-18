type HandlerType = new (...args: any[]) => any;

export class HandlerRegistry {
    private static handlers = new Map<Function, HandlerType>();

    static register(requestType: Function, handlerType: HandlerType) {
        this.handlers.set(requestType, handlerType);
    }

    static resolve(requestType: Function): HandlerType | undefined {
        return this.handlers.get(requestType);
    }
}
