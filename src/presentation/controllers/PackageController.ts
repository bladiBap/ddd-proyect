import { Request, Response } from 'express';
import { Mediator } from '@/Common/Mediator/Mediator';
import { CreatePackageCommand } from '@application/Package/Commands/CreatePackage/CreatePackageCommand';
import { handlerResponse } from '@/Common/Utils/handlerResponse';

export class PackageController {

    async create(req: Request, res: Response) {
        const mediator = new Mediator();
        const { clientId, recipeIds } = req?.body ?? {};
        const result = await mediator.send(new CreatePackageCommand(clientId, recipeIds));
        return handlerResponse(result, res);
    }
}
