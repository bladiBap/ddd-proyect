import { IRequest } from '@core/Abstractions/IResquest';
import { IResult } from '@core/Abstractions/IResult';

export class GenerateOrderCommand implements IRequest<IResult> {
    _result: IResult;
    constructor(public readonly date: Date) {}
}
