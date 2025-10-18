import { injectable, inject } from "tsyringe";
import { QueryHandler } from "@application/Mediator/decorators";
import { GetClientsForDeliveredInformationQuery } from "./GetClientsForDeliveredInformationQuery";
import { AddressRepository } from "@infrastructure/Persistence/Repositories/AddressRepository";
import { IUnitOfWork } from "@domain/core/abstractions/IUnitOfWork";
import { IClientRecipesTodayDTO } from "../dto/dto";
import { Result } from "@domain/core/results/Result";
import { ErrorCustom } from "@domain/core/results/ErrorCustom";

@QueryHandler(GetClientsForDeliveredInformationQuery)
@injectable()
export class GetClientsForDeliveredInformationQueryHandler {
    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(query: GetClientsForDeliveredInformationQuery): Promise<Result> {
        await this.unitOfWork.startTransaction();
        
        try {
            const repo = this.unitOfWork.getRepository(AddressRepository);
            const today = new Date();
            const flatData = await repo.getClientsForDeliveredInformation(today);
            const grouped: Record<number, IClientRecipesTodayDTO> = {};
            flatData.forEach(item => {
                if (!grouped[item.clientId]) {
                grouped[item.clientId] = {
                    clientName: item.clientName,
                    id: item.clientId,
                    address: {
                        id: item.addressId,
                        address: item.clientAddress,
                        reference: item.reference,
                        latitude: item.latitude,
                        longitude: item.longitude,
                    },
                    recipes: [],
                };
                }

                grouped[item.clientId].recipes.push({
                    id: item.recipeId,
                    name: item.recipeName,
                });
            });

            const lista = Object.values(grouped);

            return Result.successWith<IClientRecipesTodayDTO[]>(lista);

        } catch (error : any) {
            await this.unitOfWork.rollback();
            return Result.failure(
                ErrorCustom.Problem("OrderItem.CompleteFailed", error.message)
            )
        }
    }
}
