import { OrderDTO } from '@application/Order/Dto/OrderDTO';
import { IRequest } from '@core/Abstractions/IResquest';
import { IResultWithValue } from '../../../../Core/Abstractions/IResult';

export class GetOrderByDay implements IRequest<IResultWithValue<OrderDTO[]>> {

    constructor(public readonly date: Date) {
    }
    _result: IResultWithValue<OrderDTO[]>;
}