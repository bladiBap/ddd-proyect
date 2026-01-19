import { IRequest } from '@core/Abstractions/IResquest';
import { IResultWithValue } from '@core/Abstractions/IResult';
import { IClientDeliveredDTO } from '../Dto/dto';

export class GetClientsForDelivered implements IRequest<IResultWithValue<IClientDeliveredDTO[]>> {
    _result: IResultWithValue<IClientDeliveredDTO[]>;

    constructor(public readonly date : Date) {}
}