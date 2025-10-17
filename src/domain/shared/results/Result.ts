// --- src/results/result.ts ---
import { ErrorCustom } from './ErrorCustom';

export class Result {
    public readonly isSuccess: boolean;
    public readonly error: ErrorCustom;

    protected constructor(isSuccess: boolean, error: ErrorCustom) {

        if (isSuccess && error !== ErrorCustom.None) {
            throw new global.Error("Invalid error: a success result cannot have an error.");
        }
        if (!isSuccess && error === ErrorCustom.None) {
            throw new global.Error("Invalid error: a failure result must have an error.");
        }

        this.isSuccess = isSuccess;
        this.error = error;
    }

    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    // --- Métodos de Fábrica (Factories) ---

    public static success(): Result {
        return new Result(true, ErrorCustom.None);
    }

    public static success<TValue>(value: TValue): Result<TValue> {
        return new Result<TValue>(value, true, Error.None);
    }

    public static failure(error: Error): Result {
        return new Result(false, error);
    }

    public static failure<TValue>(error: Error): Result<TValue> {
        // Usamos 'null' como el equivalente de 'default' para un tipo genérico
        return new Result<TValue>(null as TValue, false, error);
    }

    /**
     * Reemplazo del "implicit operator" de C#.
     * Crea un Result a partir de un valor, manejando el caso nulo.
     */
    public static from<TValue>(value: TValue | null | undefined): Result<TValue> {
        return value !== null && value !== undefined
        ? Result.success(value)
        : Result.failure<TValue>(Error.NullValue);
    }
}

export class Result<TValue> extends Result {
    private readonly _value: TValue;

    protected internal constructor(value: TValue, isSuccess: boolean, error: Error) {
        super(isSuccess, error);
        this._value = value;
    }

    public get value(): TValue {
        if (this.isFailure) {
        throw new global.Error("The value of a failure result can't be accessed.");
        }
        return this._value;
    }
    
    public static validationFailure<TValue>(error: Error): Result<TValue> {
        return new Result<TValue>(null as TValue, false, error);
    }
}