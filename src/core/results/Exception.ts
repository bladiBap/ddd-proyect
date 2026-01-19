import { ExceptionType } from './ExceptionType';

export class Exception {
    static readonly None = new Exception('', '', ExceptionType.Failure);
    static readonly NullValue = new Exception(
        'General.Null',
        'Null value was provided',
        ExceptionType.Failure
    );

    readonly code: string;
    readonly description: string;
    readonly structuredMessage: string;
    readonly type: ExceptionType;

    protected constructor(
        code: string,
        structuredMessage: string,
        type: ExceptionType,
        ...args: (string | number)[]
    ) {
        this.structuredMessage = structuredMessage ?? '';
        this.description = this.buildMessage(this.structuredMessage, args);
        this.code = code;
        this.type = type;
    }

    private buildMessage(structuredMessage: string, args: (string | number)[]): string {
        
        if (!args || args.length === 0) {
            return structuredMessage;
        }

        const placeholders = structuredMessage.match(/\{(\w+)\}/g);
        if (!placeholders) {
            return structuredMessage;
        }

        let result = structuredMessage;
        placeholders.forEach((placeholder, index) => {
            if (index >= args.length) {return;}
            const value = args[index]?.toString() ?? '';
            result = result.replace(placeholder, value);
        });

        return result;
    }

    static Failure(code: string, structuredMessage: string, ...args: (string | number)[]): Exception {
        return new Exception(code, structuredMessage, ExceptionType.Failure, ...args);
    }

    static NotFound(code: string, structuredMessage: string, ...args: (string | number)[]): Exception {
        return new Exception(code, structuredMessage, ExceptionType.NotFound, ...args);
    }

    static Problem(code: string, structuredMessage: string, ...args: (string | number)[]): Exception {
        return new Exception(code, structuredMessage, ExceptionType.Problem, ...args);
    }

    static Conflict(code: string, structuredMessage: string, ...args: (string | number)[]): Exception {
        return new Exception(code, structuredMessage, ExceptionType.Conflict, ...args);
    }

    static InvalidOperation(code: string, structuredMessage: string, ...args: (string | number)[]): Exception {
        return new Exception(code, structuredMessage, ExceptionType.InvalidOperation, ...args);
    }
}
