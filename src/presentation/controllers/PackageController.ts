import { Request, Response } from 'express';
import { Mediator } from '@/Common/Mediator/Mediator';
import { CreatePackageCommand } from '@application/Package/Commands/CreatePackage/CreatePackageCommand';
import { handlerResponse } from '@/Common/Utils/handlerResponse';
import { DateUtils } from '@common/Utils/Date';

export class PackageController {

    async create(req: Request, res: Response) {
        const mediator = new Mediator();
        const { clientId, recipeIds, date } = req?.body ?? {};
        const dateParsed = DateUtils.formatDate(date);
        const result = await mediator.send(new CreatePackageCommand(clientId, dateParsed, recipeIds));
        return handlerResponse(result, res);
    }
}
