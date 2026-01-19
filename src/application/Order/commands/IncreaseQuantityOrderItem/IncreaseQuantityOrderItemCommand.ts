import { IRequest } from '@core/Abstractions/IResquest';
import { IResult } from '@core/Abstractions/IResult';

export class IncreaseQuantityOrderItemCommand implements IRequest<IResult> {
    
    constructor(public readonly orderItemId: number, public readonly quantity?: number) {}
    _result: IResult;
}