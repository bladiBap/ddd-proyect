import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CreatePackageCommand } from "./CreatePackageCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Package } from "@infrastructure/Persistence/PersistenceModel/Entities/Package";
import { PackageItem } from "@infrastructure/Persistence/PersistenceModel/Entities/PackageItem";
import { StatusPackage } from "@domain/aggregates/package/Package/StatusPackage";
import { Result } from "core/results/Result";
import { ErrorCustom } from "core/results/ErrorCustom";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { IClientRepository } from "@domain/Client/IClientRepository";
import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";
import { IRecipeRepository } from "@domain/aggregates/Recipe/IRecipeRepository";

@CommandHandler(CreatePackageCommand)
@injectable()
export class CreatePackageCommandHandler {

    private readonly unitOfWork: IUnitOfWork;
    
    private packageRepository: IPackageRepository;
    private clientRepository: IClientRepository;
    private addressRepository: IAddressRepository;
    private recipeRepository: IRecipeRepository;

    constructor(
        @inject("IUnitOfWork") unitOfWork: IUnitOfWork,
        @inject("IClientRepository") clientRepository: IClientRepository,
        @inject("IAddressRepository") addressRepository: IAddressRepository,
        @inject("IPackageRepository") packageRepository: IPackageRepository,
        @inject("IRecipeRepository") recipeRepository: IRecipeRepository
    ) {
        this.unitOfWork = unitOfWork;
        this.addressRepository = addressRepository;
        this.clientRepository = clientRepository;
        this.packageRepository = packageRepository;
        this.recipeRepository = recipeRepository;
    }

    async execute(command: CreatePackageCommand): Promise<Result> {
        const { clientId, addressId, recipeIds } = command;

        await this.unitOfWork.startTransaction();
        try {

            const client = await this.clientRepository.getByIdAsync(clientId);
            const address = await this.addressRepository.getByIdAsync(addressId);
            if (!client || !address)
                return Result.failure(
                    ErrorCustom.NotFound("Package.Creation", "Client or Address not found")
                );

            const recipes = await this.recipeRepository.getByIdsAsync(recipeIds);
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
