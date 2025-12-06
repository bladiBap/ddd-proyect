import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/Decorators";
import { CreatePackageCommand } from "./CreatePackageCommand";
import { IUnitOfWork } from "@core/Abstractions/IUnitOfWork";
import { Package } from "@domain/Package/Entities/Package";
import { PackageItem } from "@domain/Package/Entities/PackageItem";
import { StatusPackage } from "@domain/Package/Types/StatusPackage";
import { Result } from "@core/Results/Result";
import { Exception } from "@core/Results/ErrorCustom";
import { IPackageRepository } from "@domain/Package/Repositories/IPackageRepository";
import { IClientRepository } from "@domain/Client/Repositories/IClientRepository";
import { IAddressRepository } from "@domain/Address/Repositories/IAddressRepository";
import { IDailyAllocationRepository } from "@domain/DailyAllocation/Repositories/IDailyAllocationRepository";
import { CodeGenerator } from "@utils/Code";

@injectable()
@CommandHandler(CreatePackageCommand)
export class CreatePackageHandler {

    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("IClientRepository") private readonly clientRepository: IClientRepository,
        @inject("IAddressRepository") private readonly addressRepository: IAddressRepository,
        @inject("IPackageRepository") private readonly packageRepository: IPackageRepository,
        @inject("IDailyAllocationRepository") private readonly dailyAllocationRepository: IDailyAllocationRepository,
    ) {
    }

    async execute(command: CreatePackageCommand): Promise<Result> {
        const { clientId, recipeIds } = command;

        await this.unitOfWork.startTransaction();

        try {

            const client =  await this.clientRepository.getByIdAsync(clientId);
            if (!client) {
                return Result.failure(
                    Exception.NotFound("Client.NotFound", `Client with id ${clientId} not found`)
                );
            }

            const address = await this.addressRepository.getAddressForTodayByClientId(clientId);
            if (!address) {
                return Result.failure(
                    Exception.NotFound("Address.NotFound", `No address found for client id ${clientId} today`)
                );
            }

            const packageExists = await this.packageRepository.getPackageByAddressClientIdAsync(address.getId(), clientId);
            if (packageExists) {
                return Result.failure(
                    Exception.Conflict("Package.AlreadyExists", `Package already exists for client id ${clientId} at address id ${address.getId()} today`)
                );
            }

            const dailyAllocation = await this.dailyAllocationRepository.getDailyAllocationToday(clientId);
            if (!dailyAllocation) {
                return Result.failure(
                    Exception.NotFound("DailyAllocation.NotFound", `No daily allocation found for client id ${clientId} today`)
                );
            }

            const clientHasAllRecipes = dailyAllocation.clientHasAllRecipes(clientId, recipeIds);
            if (!clientHasAllRecipes) {
                return Result.failure(
                    Exception.InvalidOperation("DailyAllocation.MissingRecipes", `Client with id ${clientId} does not have all recipes for today`)
                );
            }

            const newPackage = new Package(0, CodeGenerator.generateCode(), StatusPackage.PACKAGING, clientId, address.getId(), new Date());
            for (const line of dailyAllocation.getLines()) {
                newPackage.addPackageItem(new PackageItem(0, line.getRecipeId(), newPackage.getId(), line.getQuantityNeeded()));
                line.updateQuantityPackaged(line.getQuantityNeeded());
            }
            
            await this.packageRepository.addAsync(newPackage);
            await this.dailyAllocationRepository.updatedLines(dailyAllocation.getLines());
            await this.unitOfWork.commit();

            return Result.success();
        } catch (error)   {
            await this.unitOfWork.rollback();
            return Result.failure(
                Exception.Problem(
                "Package.CreationFailed",
                "Error creating package: " + (error as Error).message
                )
            );
        }
    }
}
