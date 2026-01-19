import { IRequest } from '@core/Abstractions/IResquest';
import { IResult } from '@core/Abstractions/IResult';

export class CreatePackageCommand implements IRequest<IResult> {
    constructor(
        public readonly clientId: number,
        public readonly recipeIds: number[]
    ) {}
    _result: IResult;

}
