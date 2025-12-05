import { IRepository } from "core/abstractions/IRepository";
import { Address } from "./Address";
import { RecipeRawDTO } from "@application/order/dto/OrderRawDTO";
import { OrderByClientRawDTO } from "@application/order/dto/OrderByClientRawDTO";

export interface IAddressRepository extends IRepository<Address> {
    deleteAsync(id: number): Promise<void>;
    getPerClientNeeds(date: Date): Promise<OrderByClientRawDTO[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressForTodayByClientId(clientId: number): Promise<Address | null>;
}