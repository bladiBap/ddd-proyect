import { OrderDTO } from '@application/Order/Dto/OrderDTO';
import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResultWithValue } from '@common/Core/Abstractions/IResult';

export class GetOrderById implements IRequest<IResultWithValue<OrderDTO>> {

    constructor(public readonly id: number) {
    }
    _result: IResultWithValue<OrderDTO>;
}