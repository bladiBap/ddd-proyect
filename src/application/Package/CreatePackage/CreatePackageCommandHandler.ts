import { injectable, inject } from "tsyringe";
import { CommandHandler } from "@application/Mediator/decorators";
import { CreatePackageCommand } from "./CreatePackageCommand";
import { IUnitOfWork } from "core/abstractions/IUnitOfWork";
import { Package } from "@domain/aggregates/package/Package/Package";
import { PackageItem } from "@domain/aggregates/package/PackageItem/PackageItem";
import { StatusPackage } from "@domain/aggregates/package/Package/StatusPackage";
import { Result } from "core/results/Result";
import { ErrorCustom } from "core/results/ErrorCustom";
import { IPackageRepository } from "@domain/aggregates/package/Package/IPackageRepository";
import { IClientRepository } from "@domain/aggregates/client/IClientRepository";
import { IAddressRepository } from "@domain/aggregates/address/IAddressRepository";
import { IDailyAllocationRepository } from "@domain/aggregates/dailyAllocation/IDailyAllocationRepository";

@injectable()
@CommandHandler(CreatePackageCommand)
export class CreatePackageCommandHandler {

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
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.NotFound("Client.NotFound", `Client with id ${clientId} not found`));
            }

            const address = await this.addressRepository.getAddressForTodayByClientId(clientId);
            if (!address) {
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.NotFound("Address.NotFound", `No address found for client id ${clientId} today`));
            }

            const dailyAllocation = await this.dailyAllocationRepository.getDailyAllocationToday(clientId);
            if (!dailyAllocation) {
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.NotFound("DailyAllocation.NotFound", `No daily allocation found for client id ${clientId} today`));
            }

            const clientHasAllRecipes = dailyAllocation.clientHasAllRecipes(clientId, recipeIds);
            if (!clientHasAllRecipes) {
                await this.unitOfWork.rollback();
                return Result.failure(ErrorCustom.NotFound("DailyAllocation.NotFound", `Client with id ${clientId} does not have all recipes for today`));
            }

            const newPackage = new Package(0, `PKG-${Date.now()}`, StatusPackage.PACKAGING, clientId, address.getId(), new Date());
            for (const line of dailyAllocation.getLines()) {
                newPackage.addPackageItem(new PackageItem(0, line.getRecipeId(), newPackage.getId(), line.getQuantityNeeded()));
                line.updateQuantityPackaged(line.getQuantityNeeded());
            }
            
            await this.packageRepository.addAsync(newPackage, this.unitOfWork.getManager());
            await this.dailyAllocationRepository.updatedLines(dailyAllocation.getLines(), this.unitOfWork.getManager());
            await this.unitOfWork.commit();

            return Result.success();
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
