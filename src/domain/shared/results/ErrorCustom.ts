// src/results/error.ts

import { ErrorType } from './ErrorType';

export class ErrorCustom {
  // --- Propiedades Estáticas ---
    public static readonly None = new ErrorCustom('', '', ErrorType.Failure);
    public static readonly NullValue = new ErrorCustom(
        'General.Null',
        'Null value was provided',
        ErrorType.Failure
    );

    // --- Propiedades de Instancia ---
    public readonly code: string;
    public readonly description: string;
    public readonly structuredMessage: string;
    public readonly type: ErrorType;

    // El constructor es privado para forzar el uso de los métodos de fábrica
    private constructor(
        code: string,
        structuredMessage: string,
        type: ErrorType,
        ...args: any[] // Equivalente a 'params object[]'
    ) {
        this.code = code;
        this.type = type;
        this.structuredMessage = structuredMessage ?? ''; // Maneja el caso de null/undefined
        this.description = this.buildMessage(this.structuredMessage, ...args);
    }

    // --- Métodos Privados ---

    /**
     * Reemplaza placeholders como {nombre} con los argumentos proporcionados.
     */
    private buildMessage(message: string, ...args: any[]): string {
        if (!args || args.length === 0) {
        return message;
        }

        let result = message;
        // La expresión regular busca cualquier texto entre llaves {}
        const placeholders = message.match(/\{(\w+)\}/g);

        if (!placeholders) {
        return message;
        }
        
        for (let i = 0; i < placeholders.length; i++) {
        if (i >= args.length) break; // Evita errores si hay menos argumentos que placeholders

        const placeholder = placeholders[i];
        const value = args[i] !== null && args[i] !== undefined ? String(args[i]) : '';

        result = result.replace(placeholder, value);
        }

        return result;
    }

    // --- Métodos de Fábrica Estáticos ---

    public static failure(
        code: string,
        message: string,
        ...args: any[]
    ): ErrorCustom {
        return new ErrorCustom(code, message, ErrorType.Failure, ...args);
    }

    public static notFound(
        code: string,
        message: string,
        ...args: any[]
    ): ErrorCustom {
        return new ErrorCustom(code, message, ErrorType.NotFound, ...args);
    }

    public static problem(
        code: string,
        message: string,
        ...args: any[]
    ): ErrorCustom {
        return new ErrorCustom(code, message, ErrorType.Problem, ...args);
    }

    public static conflict(
        code: string,
        message: string,
        ...args: any[]
    ): ErrorCustom {
        return new ErrorCustom(code, message, ErrorType.Conflict, ...args);
    }
}