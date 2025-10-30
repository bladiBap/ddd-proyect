import { ErrorType } from "./ErrorType";

export class ErrorCustom {
    static readonly None = new ErrorCustom("", "", ErrorType.Failure);
    static readonly NullValue = new ErrorCustom(
        "General.Null",
        "Null value was provided",
        ErrorType.Failure
    );

    readonly code: string;
    readonly description: string;
    readonly structuredMessage: string;
    readonly type: ErrorType;

    constructor(
        code: string,
        structuredMessage: string,
        type: ErrorType,
        ...args: any[]
    ) {
        this.structuredMessage = structuredMessage ?? "";
        this.description = this.buildMessage(this.structuredMessage, args);
        this.code = code;
        this.type = type;
    }

    private buildMessage(structuredMessage: string, args: any[]): string {
        if (!args || args.length === 0) {
        return structuredMessage;
        }

        const placeholders = structuredMessage.match(/\{(\w+)\}/g);
        if (!placeholders) {
        return structuredMessage;
        }

        let result = structuredMessage;
        placeholders.forEach((placeholder, index) => {
        if (index >= args.length) return;
        const value = args[index]?.toString() ?? "";
        result = result.replace(placeholder, value);
        });

        return result;
    }

    static Failure(code: string, structuredMessage: string, ...args: any[]): ErrorCustom {
        return new ErrorCustom(code, structuredMessage, ErrorType.Failure, ...args);
    }

    static NotFound(code: string, structuredMessage: string, ...args: any[]): ErrorCustom {
        return new ErrorCustom(code, structuredMessage, ErrorType.NotFound, ...args);
    }

    static Problem(code: string, structuredMessage: string, ...args: any[]): ErrorCustom {
        return new ErrorCustom(code, structuredMessage, ErrorType.Problem, ...args);
    }

    static Conflict(code: string, structuredMessage: string, ...args: any[]): ErrorCustom {
        return new ErrorCustom(code, structuredMessage, ErrorType.Conflict, ...args);
    }

    static InvalidOperation(code: string, structuredMessage: string, ...args: any[]): ErrorCustom {
        return new ErrorCustom(code, structuredMessage, ErrorType.InvalidOperation, ...args);
    }
}
