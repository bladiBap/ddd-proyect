import { IRepository } from "core/abstractions/IRepository";
import { Address } from "./Address";
import { OrderRawDTO } from "@application/Order/dto/OrderRawDTO";
import { OrderByClientRawDTO } from "@application/Order/dto/OrderByClientRawDTO";

export interface IAddressRepository extends IRepository<Address> {
    deleteAsync(id: number): Promise<void>;
    getRecipesToPrepare(date: Date): Promise<OrderRawDTO[]>;
    getPerClientNeeds(date: Date): Promise<OrderByClientRawDTO[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressForTodayByClientId(clientId: number): Promise<Address | null>;
}