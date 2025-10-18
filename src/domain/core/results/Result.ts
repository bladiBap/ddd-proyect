import { ErrorCustom } from "./ErrorCustom";

export class Result {
    readonly isSuccess: boolean;
    readonly error: ErrorCustom;

    protected constructor(isSuccess: boolean, error: ErrorCustom) {
        if ((isSuccess && error !== ErrorCustom.None) || (!isSuccess && error === ErrorCustom.None)) {
            throw new Error('Invalid error state in Result.');
        }
        this.isSuccess = isSuccess;
        this.error = error;
    }

    get isFailure(): boolean {
        return !this.isSuccess;
    }

    static success(): Result {
        return new Result(true, ErrorCustom.None);
    }

    static successWith<T>(value: T): ResultWithValue<T> {
        return new ResultWithValue<T>(value, true, ErrorCustom.None);
    }

    static failure(error: ErrorCustom): Result {
        return new Result(false, error);
    }

    static failureWith<T>(error: ErrorCustom): ResultWithValue<T> {
        return new ResultWithValue<T>(undefined, false, error);
    }
}

export class ResultWithValue<T> extends Result {
    private readonly _value?: T;

    constructor(value: T | undefined, isSuccess: boolean, error: ErrorCustom) {
        super(isSuccess, error);
        this._value = value;
    }

    get value(): T {
        if (!this.isSuccess) {
        throw new Error("The value of a failure result can't be accessed.");
        }
        return this._value as T;
    }

    static validationFailure<T>(error: ErrorCustom): ResultWithValue<T> {
        return new ResultWithValue<T>(undefined, false, error);
    }

    static fromValue<T>(value: T | null | undefined): ResultWithValue<T> {
        return value != null
        ? Result.successWith(value)
        : Result.failureWith<T>(ErrorCustom.NullValue);
    }
}