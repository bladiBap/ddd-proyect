import { ErrorType } from "./ErrorType";

export class Exception {
    static readonly None = new Exception("", "", ErrorType.Failure);
    static readonly NullValue = new Exception(
        "General.Null",
        "Null value was provided",
        ErrorType.Failure
    );

    readonly code: string;
    readonly description: string;
    readonly structuredMessage: string;
    readonly type: ErrorType;

    protected constructor(
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

    static Failure(code: string, structuredMessage: string, ...args: any[]): Exception {
        return new Exception(code, structuredMessage, ErrorType.Failure, ...args);
    }

    static NotFound(code: string, structuredMessage: string, ...args: any[]): Exception {
        return new Exception(code, structuredMessage, ErrorType.NotFound, ...args);
    }

    static Problem(code: string, structuredMessage: string, ...args: any[]): Exception {
        return new Exception(code, structuredMessage, ErrorType.Problem, ...args);
    }

    static Conflict(code: string, structuredMessage: string, ...args: any[]): Exception {
        return new Exception(code, structuredMessage, ErrorType.Conflict, ...args);
    }

    static InvalidOperation(code: string, structuredMessage: string, ...args: any[]): Exception {
        return new Exception(code, structuredMessage, ErrorType.InvalidOperation, ...args);
    }
}
