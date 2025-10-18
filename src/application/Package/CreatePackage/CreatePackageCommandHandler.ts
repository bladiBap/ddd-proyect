import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CreatePackageCommand } from "./CreatePackageCommand";
import { IUnitOfWork } from "@domain/core/abstractions/IUnitOfWork";
import { Package } from "@infrastructure/Persistence/PersistenceModel/Entities/Package";
import { PackageItem } from "@infrastructure/Persistence/PersistenceModel/Entities/PackageItem";
import { StatusPackage } from "@domain/aggregates/package/Package/StatusPackage";
import { Result } from "@domain/core/results/Result";
import { ErrorCustom } from "@domain/core/results/ErrorCustom";

//Repositories


@CommandHandler(CreatePackageCommand)
@injectable()
export class CreatePackageCommandHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(command: CreatePackageCommand): Promise<Result> {
        const { clientId, addressId, recipeIds } = command;

        await this.unitOfWork.startTransaction();
        try {
            const packageRepo = this.unitOfWork.getRepository(
                require("@infrastructure/Persistence/Repositories/PackageRepository").PackageRepository
            );
            const clientRepo = this.unitOfWork.getRepository(
                require("@infrastructure/Persistence/Repositories/ClientRepository").ClientRepository
            );
            const addressRepo = this.unitOfWork.getRepository(
                require("@infrastructure/Persistence/Repositories/AddressRepository").AddressRepository
            );
            const recipeRepo = this.unitOfWork.getRepository(
                require("@infrastructure/Persistence/Repositories/RecipeRepository").RecipeRepository
            );

            const client = await clientRepo.findByIdAsync(clientId);
            const address = await addressRepo.findByIdAsync(addressId);
            if (!client || !address)
                return Result.failure(
                    ErrorCustom.NotFound("Package.Creation", "Client or Address not found")
                );

            const recipes = await recipeRepo.findByIdsAsync(recipeIds);
            if (recipes.length === 0)
                return Result.failure(
                    ErrorCustom.NotFound("Package.Creation", "Recipes not found")
                );

            const newPackage = new Package();
            newPackage.datePackage = new Date();
            newPackage.status = StatusPackage.PACKAGING;
            newPackage.client = client;
            newPackage.address = address;
            newPackage.packageItems = [];

            for (const recipe of recipes) {
                const item = new PackageItem();
                item.recipe = recipe;
                item.package = newPackage;
                newPackage.packageItems.push(item);
            }

            await packageRepo.saveAsync(newPackage);
            await this.unitOfWork.commit();

            return Result.successWith({ packageId: newPackage.id });
        } catch (error) {
            await this.unitOfWork.rollback();
            return Result.failure(
                ErrorCustom.Problem(
                "Package.CreationFailed",
                "Error creating package: " + (error as Error).message
                )
            );
        }
    }
}
