import { Exception } from '../Results/Exception';

export interface IResult {
    readonly isSuccess: boolean;
    readonly isFailure: boolean;
    readonly error: Exception;
}

export interface IResultWithValue<T> extends IResult {
    readonly value: T;
}
