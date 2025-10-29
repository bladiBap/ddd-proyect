import { Request, Response } from "express";
import { Mediator } from "@application/Mediator/Mediator";
import { CreatePackageCommand } from "@application/Package/CreatePackage/CreatePackageCommand";

export class PackageController {

    async buildPackage(req: Request, res: Response) {
        
        const mediator = new Mediator();
        const { clientId, recipeIds } = req?.body ?? {};
        try {

            const packageResult = await mediator.send(new CreatePackageCommand(clientId, recipeIds));

            if (!packageResult) {
                return res.status(404).json(packageResult);
            }

            return res.status(200).json(packageResult);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
